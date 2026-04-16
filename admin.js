/**
 * KABRA Admin Dashboard Logic (Supabase + GitHub Auth)
 */
document.addEventListener('DOMContentLoaded', async () => {
    const supabaseClient = window.supabaseClient;
    const loginOverlay = document.getElementById('login-overlay');
    const adminInterface = document.getElementById('admin-interface');
    const adminLoginForm = document.getElementById('admin-login-form');
    const btnLogout = document.getElementById('btn-logout');
    const loginError = document.getElementById('login-error');

    // Elementos do Layout Nav
    const navLinks = document.querySelectorAll('.nav-link[data-view]');
    const viewTitle = document.getElementById('view-title');
    const viewContent = document.getElementById('view-content');

    let currentUser = null;

    if (!supabaseClient) {
        if (loginError) {
            loginError.textContent = "Supabase não configurado. Adicione suas chaves no config.js.";
            loginError.style.display = 'block';
        }
        return;
    }

    // 1. VERIFICAR AUTENTICAÇÃO
    const { data: { session }, error } = await supabaseClient.auth.getSession();

    if (session) {
        startAdminMode(session.user);
    } else {
        loginOverlay.style.display = 'flex';
        adminInterface.style.display = 'none';
    }

    // Listener para mudança de auth no OAUTH redirect
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
            startAdminMode(session.user);
        } else if (event === 'SIGNED_OUT') {
            loginOverlay.style.display = 'flex';
            adminInterface.style.display = 'none';
        }
    });

    // 2. LOGINS
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            loginError.style.display = 'none';

            const btnSubmit = document.getElementById('btn-login-submit');
            if (btnSubmit) { btnSubmit.disabled = true; btnSubmit.textContent = "Verificando..."; }

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                loginError.textContent = (error.message.includes('Invalid login')) ? "Erro: E-mail ou senha incorretos." : "Erro: " + error.message;
                loginError.style.display = 'block';
                if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.textContent = "Entrar no Painel"; }
            }
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', async (e) => {
            e.preventDefault();
            await supabaseClient.auth.signOut();
            window.location.reload();
        });
    }

    // 3. INICIAR DASHBOARD E NAVEGAÇÃO
    function startAdminMode(user) {
        currentUser = user;
        loginOverlay.style.display = 'none';
        adminInterface.style.display = 'flex';

        navLinks.forEach(link => {
            // Remove listeners antigos criando um clone limpo
            const novoLink = link.cloneNode(true);
            link.parentNode.replaceChild(novoLink, link);

            novoLink.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.getAttribute('data-view');

                document.querySelectorAll('.nav-link[data-view]').forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');

                renderView(view);
            });
        });

        // Loop inicial
        renderView('dashboard');
    }

    // -----------------------------------------
    // DB FETCHERS (Supabase)
    // -----------------------------------------
    async function fetchSubmissions() {
        const { data, error } = await supabaseClient
            .from('submissions')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) console.error("Database Error Subs:", error);
        return data || [];
    }

    async function fetchBlogs() {
        const { data, error } = await supabaseClient
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) console.error("Database Error Blogs:", error);
        return data || [];
    }

    // -----------------------------------------
    // ROUTER
    // -----------------------------------------
    async function renderView(viewName) {
        viewContent.innerHTML = '<div class="empty-state">Buscando dados do banco...</div>';

        if (viewName === 'dashboard') {
            viewTitle.textContent = 'Visão Geral';
            await renderDashboard();
        } else if (viewName === 'submissions') {
            viewTitle.textContent = 'Leads Cadastrados';
            await renderSubmissions();
        } else if (viewName === 'blogs') {
            viewTitle.textContent = 'Gerenciamento de Artigos';
            await renderBlogs();
        }
    }

    // -- Dashboard --
    async function renderDashboard() {
        const submissions = await fetchSubmissions();
        const blogs = await fetchBlogs();
        const newLeads = submissions.filter(s => s.status === 'new').length;

        viewContent.innerHTML = `
            <div class="dashboard-grid">
                <div class="stat-card">
                    <div class="stat-title">Total de Cadastros</div>
                    <div class="stat-value">${submissions.length}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Novos Contatos</div>
                    <div class="stat-value text-accent">${newLeads}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Artigos Publicados</div>
                    <div class="stat-value">${blogs.length}</div>
                </div>
            </div>
            <div class="view-header-actions" style="margin-top: 3rem;">
                <h2>Cadastros Recentes</h2>
            </div>
            ${generateSubmissionsTable(submissions.slice(0, 5), false)}
        `;
    }

    // -- Submissions --
    async function renderSubmissions() {
        const submissions = await fetchSubmissions();
        viewContent.innerHTML = `
            <div class="view-header-actions">
                <h2>Todos os Contatos</h2>
            </div>
            ${generateSubmissionsTable(submissions, true)}
        `;

        document.querySelectorAll('.mark-read-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                const btnRef = e.target;
                btnRef.disabled = true;
                btnRef.textContent = "...";

                const { error } = await supabaseClient
                    .from('submissions')
                    .update({ status: 'read' })
                    .eq('id', id);

                if (!error) renderView('submissions');
                else console.error(error);
            });
        });
    }

    function generateSubmissionsTable(list, showActions) {
        if (list.length === 0) return `<div class="empty-state">Nenhum cadastro encontrado.</div>`;

        let rows = list.map(sub => {
            const dateStr = sub.created_at ? new Date(sub.created_at).toLocaleDateString('pt-BR') : 'Recente';
            const extraInfo = [];
            if (sub.name) extraInfo.push(sub.name);
            if (sub.company) extraInfo.push(sub.company);
            const detailLabel = extraInfo.length > 0 ? `<br><small style="color:var(--color-details); margin-top:2px; display:block">${extraInfo.join(' - ')}</small>` : '';

            return `
            <tr>
                <td>${dateStr} <br><small style="color:var(--color-details); font-size:0.75rem; text-transform:uppercase">${sub.origin || 'geral'}</small></td>
                <td><strong>${sub.email}</strong>${detailLabel}</td>
                <td>
                    <span class="badge ${sub.status === 'new' ? 'new' : ''}">
                        ${sub.status === 'new' ? 'Novo' : 'Visto'}
                    </span>
                </td>
                ${showActions ? `
                <td>
                    ${sub.status === 'new' ?
                        `<button class="btn btn-outline mark-read-btn" data-id="${sub.id}" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">Marcar Visto</button>`
                        : `<span style="color:var(--color-details); font-size:0.8rem;">Analisado</span>`
                    }
                </td>` : ''}
            </tr>
            `;
        }).join('');

        return `
            <div class="data-table-container">
                <table class="admin-table">
                    <thead><tr><th>Data/Origem</th><th>Contato</th><th>Status</th>${showActions ? '<th>Ações</th>' : ''}</tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>`;
    }

    // -- Blogs --
    async function renderBlogs() {
        const blogs = await fetchBlogs();
        viewContent.innerHTML = `
            <div class="view-header-actions">
                <h2>Artigos do Blog</h2>
                <button class="btn btn-primary" id="add-blog-btn">+ Novo Artigo</button>
            </div>
            <div id="blog-list-container">
                ${generateBlogsTable(blogs)}
            </div>
            <div id="blog-form-container" style="display: none;"></div>
        `;

        document.getElementById('add-blog-btn').addEventListener('click', showBlogForm);

        document.querySelectorAll('.btn-delete-blog').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm('Tem certeza que deseja excluir permanentemente este post?')) {
                    const id = e.target.getAttribute('data-id');
                    const { error } = await supabaseClient.from('blogs').delete().eq('id', id);
                    if (!error) renderView('blogs');
                }
            });
        });
    }

    function generateBlogsTable(list) {
        if (list.length === 0) return `<div class="empty-state">Nenhum artigo disponível no banco de dados.</div>`;

        let rows = list.map(blog => {
            const dateStr = blog.created_at ? new Date(blog.created_at).toLocaleDateString('pt-BR') : 'Hoje';
            return `
            <tr>
                <td>${dateStr}</td>
                <td><strong>${blog.title}</strong></td>
                <td><span class="badge ${blog.published ? '' : 'new'}">${blog.published ? 'Publicado' : 'Rascunho'}</span></td>
                <td><button class="btn btn-outline btn-delete-blog" data-id="${blog.id}" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">Excluir</button></td>
            </tr>`;
        }).join('');

        return `
            <div class="data-table-container">
                <table class="admin-table">
                    <thead><tr><th>Data</th><th>Título</th><th>Status</th><th>Ações</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>`;
    }

    function showBlogForm() {
        document.getElementById('blog-list-container').style.display = 'none';
        document.getElementById('add-blog-btn').style.display = 'none';

        const formContainer = document.getElementById('blog-form-container');
        formContainer.style.display = 'block';

        formContainer.innerHTML = `
            <form id="new-blog-form" class="admin-form">
                <h3>Criar Novo Artigo</h3>
                <div class="form-group">
                    <label>Título do Post</label>
                    <input type="text" id="blog-title" class="form-input" required placeholder="Ex: O Futuro do Growth Hacking">
                </div>
                <div class="form-group">
                    <label>URL / Link da Imagem de Capa</label>
                    <input type="url" id="blog-image" class="form-input" placeholder="https://site.com/imagem.jpg">
                </div>
                <div class="form-group">
                    <label>Resumo</label>
                    <input type="text" id="blog-excerpt" class="form-input" required placeholder="Escreva uma breve descrição...">
                </div>
                <div class="form-group">
                    <label style="display:flex; justify-content:space-between; align-items:center;">
                        Conteúdo 
                        <span style="font-size:0.8rem; color:var(--color-details); font-weight:normal;">Suporta formatação padrão (Markdown)</span>
                    </label>
                    <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 6px; margin-bottom: 0.5rem; font-size: 0.85rem; color: var(--color-details); border: 1px solid rgba(255,255,255,0.05); line-height: 1.6;">
                        <strong style="color:var(--color-creme)">Guia Rápido de Formatação:</strong><br>
                        <code style="background:rgba(0,0,0,0.3); padding:2px 4px; border-radius:3px; color:#ff8a66">#</code> Título H1 &nbsp;|&nbsp; 
                        <code style="background:rgba(0,0,0,0.3); padding:2px 4px; border-radius:3px; color:#ff8a66">##</code> Subtítulo H2 &nbsp;|&nbsp; 
                        <code style="background:rgba(0,0,0,0.3); padding:2px 4px; border-radius:3px; color:#ff8a66">###</code> Título Menor H3<br>
                        <code style="background:rgba(0,0,0,0.3); padding:2px 4px; border-radius:3px; color:#ff8a66">**</code><strong>Texto Negrito</strong><code style="background:rgba(0,0,0,0.3); padding:2px 4px; border-radius:3px; color:#ff8a66">**</code> &nbsp;|&nbsp; 
                        <code style="background:rgba(0,0,0,0.3); padding:2px 4px; border-radius:3px; color:#ff8a66">*</code><em>Texto Itálico</em><code style="background:rgba(0,0,0,0.3); padding:2px 4px; border-radius:3px; color:#ff8a66">*</code> &nbsp;|&nbsp; 
                        <code style="background:rgba(0,0,0,0.3); padding:2px 4px; border-radius:3px; color:#ff8a66">-</code> Item de Lista<br>
                        <code style="background:rgba(0,0,0,0.3); padding:2px 4px; border-radius:3px; color:#ff8a66">[Texto do Link](https://site.com)</code> para inserir links externos.<br>
                        <i style="opacity:0.7; font-size: 0.8rem; display:block; margin-top:5px;">💡 Pule sempre uma linha em branco para criar um novo parágrafo.</i>
                    </div>
                    <textarea id="blog-body" class="form-input" required placeholder="Escreva o conteúdo do artigo..." style="min-height: 400px; font-family: Consolas, monospace; font-size: 0.95rem; line-height: 1.5;"></textarea>
                </div>
                <div class="action-buttons">
                    <button type="submit" id="btn-publish-blog" class="btn btn-primary">Publicar</button>
                    <button type="button" class="btn btn-outline" id="cancel-blog-btn">Cancelar</button>
                </div>
            </form>
        `;

        document.getElementById('cancel-blog-btn').addEventListener('click', () => renderView('blogs'));

        document.getElementById('new-blog-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-publish-blog');
            btn.disabled = true;
            btn.textContent = "Salvando no Banco...";

            const title = document.getElementById('blog-title').value;
            const excerpt = document.getElementById('blog-excerpt').value;
            const content = document.getElementById('blog-body').value;
            const image_url = document.getElementById('blog-image').value;

            const { error } = await supabaseClient.from('blogs').insert([{
                title, excerpt, content, image_url, published: true, author_id: currentUser?.id
            }]);

            if (error) {
                alert("Erro ao publicar: " + error.message);
                btn.disabled = false;
                btn.textContent = "Publicar";
            } else {
                renderView('blogs');
            }
        });
    }
});
