"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminPage() {
    const [user, setUser] = useState<any>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    // Login Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Dashboard State
    const [view, setView] = useState<'dashboard' | 'submissions' | 'blogs'>('dashboard');
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [selectedLead, setSelectedLead] = useState<any>(null);

    // Blog Edit State
    const [showBlogForm, setShowBlogForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState<any>(null);
    const [blogForm, setBlogForm] = useState({ title: '', excerpt: '', content: '', image_url: '' });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setLoadingAuth(false);
        };
        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
        });
        return () => authListener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, view]);

    const fetchData = async () => {
        if (view === 'dashboard' || view === 'submissions') {
            const { data } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
            setSubmissions(data || []);
        }
        if (view === 'dashboard' || view === 'blogs') {
            const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
            setBlogs(data || []);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setLoginError(error.message.includes('Invalid login') ? "Credenciais incorretas." : error.message);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    // Login View
    if (loadingAuth) return <div className="min-h-screen bg-[var(--color-bg-darker)] flex items-center justify-center text-[#F2ECDA]">Carregando...</div>;

    if (!user) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center p-5 pt-20">
                <div className="bg-[var(--color-bg-darker)] p-10 rounded-xl w-full max-w-[400px] border-t-4 border-[#FF4719] shadow-2xl">
                    <h2 className="text-[#F2ECDA] font-heading text-2xl uppercase mb-6 text-center">Acesso KABRA</h2>
                    {loginError && <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4 text-sm">{loginError}</div>}
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required className="p-3 bg-[var(--color-bg-dark)] border border-[rgba(242,236,218,0.1)] rounded text-[#F2ECDA] outline-none focus:border-[#FF4719]" />
                        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required className="p-3 bg-[var(--color-bg-dark)] border border-[rgba(242,236,218,0.1)] rounded text-[#F2ECDA] outline-none focus:border-[#FF4719]" />
                        <button type="submit" className="mt-2 bg-[#FF4719] hover:bg-[#e03810] text-[#F2ECDA] font-bold py-3 rounded uppercase tracking-wider transition-colors">Entrar</button>
                    </form>
                </div>
            </div>
        );
    }

    // Admin Interface
    return (
        <div className="flex min-h-screen bg-[var(--color-bg-darker)] font-body z-[999] relative">
            {/* Sidebar */}
            <aside className="w-full max-w-[250px] bg-[var(--color-bg-dark)] border-r border-[#F2ECDA]/10 flex flex-col h-full sticky left-0 top-0 pt-32">
                <div className="p-6 border-b border-[#F2ECDA]/10 text-[#CCB8A3] text-sm">
                    Logado como:<br /><strong className="text-[#F2ECDA] break-all">{user.email}</strong>
                </div>
                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <button onClick={() => { setView('dashboard'); setShowBlogForm(false) }} className={`text-left px-4 py-3 rounded transition-colors ${view === 'dashboard' ? 'bg-[#FF4719] text-[#F2ECDA]' : 'text-[#CCB8A3] hover:bg-[#36423A]'}`}>Visão Geral</button>
                    <button onClick={() => { setView('submissions'); setShowBlogForm(false) }} className={`text-left px-4 py-3 rounded transition-colors ${view === 'submissions' ? 'bg-[#FF4719] text-[#F2ECDA]' : 'text-[#CCB8A3] hover:bg-[#36423A]'}`}>Leads</button>
                    <button onClick={() => { setView('blogs'); setShowBlogForm(false) }} className={`text-left px-4 py-3 rounded transition-colors ${view === 'blogs' ? 'bg-[#FF4719] text-[#F2ECDA]' : 'text-[#CCB8A3] hover:bg-[#36423A]'}`}>Artigos</button>
                </nav>
                <div className="p-4 border-t border-[#F2ECDA]/10">
                    <button onClick={handleLogout} className="w-full px-4 py-3 text-[#CCB8A3] hover:text-[#FF4719] hover:bg-[#36423A] rounded transition-colors text-left uppercase text-xs tracking-wider">Sair do Painel</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 bg-[var(--color-bg-darker)] pt-32 min-h-screen overflow-y-auto">
                <h1 className="text-3xl font-heading text-[#F2ECDA] uppercase mb-8 border-b border-[#F2ECDA]/10 pb-4">
                    {view === 'dashboard' && 'Visão Geral'}
                    {view === 'submissions' && 'Leads Cadastrados'}
                    {view === 'blogs' && 'Gerenciamento de Artigos'}
                </h1>

                {/* DASHBOARD VIEW */}
                {view === 'dashboard' && (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-[#36423A] p-6 rounded-lg text-center border-t-2 border-[#FF4719] shadow-lg">
                                <div className="text-[#CCB8A3] text-sm uppercase tracking-wider mb-2">Total Leads</div>
                                <div className="text-4xl text-[#F2ECDA] font-bold">{submissions.length}</div>
                            </div>
                            <div className="bg-[#36423A] p-6 rounded-lg text-center border-t-2 border-[#FF4719] shadow-lg">
                                <div className="text-[#CCB8A3] text-sm uppercase tracking-wider mb-2">Novos Leads</div>
                                <div className="text-4xl text-[#FF4719] font-bold">{submissions.filter(s => s.status === 'new').length}</div>
                            </div>
                            <div className="bg-[#36423A] p-6 rounded-lg text-center border-t-2 border-[#FF4719] shadow-lg">
                                <div className="text-[#CCB8A3] text-sm uppercase tracking-wider mb-2">Artigos Publicados</div>
                                <div className="text-4xl text-[#F2ECDA] font-bold">{blogs.length}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* SUBMISSIONS VIEW */}
                {(view === 'submissions' || view === 'dashboard') && submissions.length > 0 && (
                    <div className="mb-12">
                        {view === 'dashboard' && <h2 className="text-xl text-[#F2ECDA] mb-4 font-heading uppercase">Leads Recentes</h2>}
                        <div className="bg-[var(--color-bg-dark)] rounded-lg overflow-x-auto shadow-xl">
                            <table className="w-full text-left min-w-[600px]">
                                <thead className="bg-[#36423A] text-[#CCB8A3] text-sm uppercase">
                                    <tr>
                                        <th className="p-4 font-medium">Data / Origem</th>
                                        <th className="p-4 font-medium">Contato</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.slice(0, view === 'dashboard' ? 5 : 999).map(sub => (
                                        <tr key={sub.id} className="border-t border-[#F2ECDA]/5 hover:bg-[#36423A]/50 transition-colors">
                                            <td className="p-4 text-[#F2ECDA]">
                                                {new Date(sub.created_at).toLocaleDateString('pt-BR')}<br />
                                                <span className="text-[#CCB8A3] text-xs uppercase">{sub.origin}</span>
                                            </td>
                                            <td className="p-4 text-[#F2ECDA]">
                                                <strong>{sub.name}</strong><br />
                                                <span className="text-[#CCB8A3] text-sm">{sub.email} - {sub.company} ({sub.role})</span>
                                            </td>
                                            <td className="p-4">
                                                {sub.status === 'new'
                                                    ? <span className="bg-[#FF4719]/20 text-[#FF4719] px-2 py-1 rounded text-xs uppercase border border-[#FF4719]/30">Novo</span>
                                                    : <span className="bg-[#36423A] text-[#CCB8A3] px-2 py-1 rounded text-xs uppercase border border-[#CCB8A3]/30">Visto</span>}
                                            </td>
                                            <td className="p-4 flex gap-3 flex-wrap items-center">
                                                {sub.status === 'new' && (
                                                    <button onClick={async () => {
                                                        await supabase.from('submissions').update({ status: 'read' }).eq('id', sub.id);
                                                        fetchData();
                                                    }} className="text-[#FF4719] text-sm hover:underline font-bold">Marcar Visto</button>
                                                )}
                                                <button onClick={() => setSelectedLead(sub)} className="text-[#CCB8A3] text-sm hover:text-[#F2ECDA] border border-[#CCB8A3]/30 px-3 py-1 rounded transition-colors whitespace-nowrap">
                                                    Ver Detalhes
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* BLOGS VIEW */}
                {view === 'blogs' && !showBlogForm && (
                    <div>
                        <button onClick={() => { setEditingBlog(null); setBlogForm({ title: '', excerpt: '', content: '', image_url: '' }); setShowBlogForm(true) }} className="mb-6 bg-[#FF4719] hover:bg-[#e03810] text-[#F2ECDA] px-5 py-3 rounded uppercase text-sm font-bold tracking-wider transition-all hover:-translate-y-0.5">
                            + Novo Artigo
                        </button>

                        <div className="bg-[var(--color-bg-dark)] rounded-lg overflow-x-auto shadow-xl">
                            <table className="w-full text-left min-w-[600px]">
                                <thead className="bg-[#36423A] text-[#CCB8A3] text-sm uppercase">
                                    <tr>
                                        <th className="p-4 font-medium">Data</th>
                                        <th className="p-4 font-medium">Título</th>
                                        <th className="p-4 font-medium">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blogs.map(blog => (
                                        <tr key={blog.id} className="border-t border-[#F2ECDA]/5 hover:bg-[#36423A]/50 transition-colors">
                                            <td className="p-4 text-[#F2ECDA]">{new Date(blog.created_at).toLocaleDateString('pt-BR')}</td>
                                            <td className="p-4 text-[#F2ECDA]"><strong>{blog.title}</strong></td>
                                            <td className="p-4 flex gap-4 mt-2">
                                                <button onClick={() => {
                                                    setEditingBlog(blog);
                                                    setBlogForm({ title: blog.title, excerpt: blog.excerpt, content: blog.content, image_url: blog.image_url || '' });
                                                    setShowBlogForm(true);
                                                }} className="text-[#CCB8A3] hover:text-[#F2ECDA] text-sm border border-[#CCB8A3]/30 px-3 py-1 rounded">Editar</button>
                                                <button onClick={async () => {
                                                    if (confirm('Excluir permanentemente?')) {
                                                        await supabase.from('blogs').delete().eq('id', blog.id);
                                                        fetchData();
                                                    }
                                                }} className="text-[#FF4719] hover:text-white text-sm border border-[#FF4719]/30 px-3 py-1 rounded hover:bg-[#FF4719]">Excluir</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* BLOG FORM */}
                {view === 'blogs' && showBlogForm && (
                    <div className="bg-[var(--color-bg-dark)] p-8 rounded-lg max-w-[800px] border border-[#F2ECDA]/10 shadow-2xl">
                        <h2 className="text-[#F2ECDA] font-heading text-2xl uppercase mb-6 text-center">{editingBlog ? 'Editar Artigo' : 'Criar Novo Artigo'}</h2>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            if (editingBlog) {
                                await supabase.from('blogs').update(blogForm).eq('id', editingBlog.id);
                            } else {
                                await supabase.from('blogs').insert([{ ...blogForm, published: true, author_id: user.id }]);
                            }
                            setShowBlogForm(false);
                            fetchData();
                        }} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-[#CCB8A3] text-sm mb-1">Título</label>
                                <input type="text" required value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} className="w-full p-3 bg-[#36423A] border border-[#F2ECDA]/10 rounded text-[#F2ECDA] outline-none focus:border-[#FF4719]" />
                            </div>
                            <div>
                                <label className="block text-[#CCB8A3] text-sm mb-1">URL da Imagem de Capa</label>
                                <input type="url" value={blogForm.image_url} onChange={e => setBlogForm({ ...blogForm, image_url: e.target.value })} className="w-full p-3 bg-[#36423A] border border-[#F2ECDA]/10 rounded text-[#F2ECDA] outline-none focus:border-[#FF4719]" />
                            </div>
                            <div>
                                <label className="block text-[#CCB8A3] text-sm mb-1">Resumo (Excerpt)</label>
                                <input type="text" required value={blogForm.excerpt} onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })} className="w-full p-3 bg-[#36423A] border border-[#F2ECDA]/10 rounded text-[#F2ECDA] outline-none focus:border-[#FF4719]" />
                            </div>
                            <div>
                                <label className="flex justify-between text-[#CCB8A3] text-sm mb-1">Conteúdo</label>
                                <div className="bg-[#252B27]/50 p-4 rounded mb-2 border border-[#F2ECDA]/5 text-xs text-[#CCB8A3]">
                                    **Lembrete:** Para Títulos H1 use `# Texto` com *espaço* após o hashtag. Pule uma linha em branco para criar um novo parágrafo.
                                </div>
                                <textarea required value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} className="w-full p-4 min-h-[500px] bg-[#36423A] border border-[#F2ECDA]/10 rounded text-[#F2ECDA] outline-none focus:border-[#FF4719] font-mono text-sm leading-relaxed"></textarea>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <button type="submit" className="bg-[#FF4719] hover:bg-[#e03810] text-[#F2ECDA] px-8 py-3 flex-1 rounded uppercase font-bold tracking-wider">{editingBlog ? 'Salvar Alterações' : 'Publicar Artigo'}</button>
                                <button type="button" onClick={() => setShowBlogForm(false)} className="bg-transparent border border-[#CCB8A3] text-[#CCB8A3] hover:text-[#F2ECDA] hover:border-[#F2ECDA] px-8 py-3 rounded uppercase tracking-wider">Cancelar</button>
                            </div>
                        </form>
                    </div>
                )}
            </main>

            {/* MODAL DETALHES DO LEAD */}
            {selectedLead && (
                <div className="fixed inset-0 bg-[#0F1210]/90 backdrop-blur-sm flex justify-center items-center z-[10000] p-4" onClick={(e) => { if (e.target === e.currentTarget) setSelectedLead(null); }}>
                    <div className="bg-[#36423A] p-8 rounded-lg w-full max-w-[500px] border-t-4 border-[#FF4719] shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setSelectedLead(null)} className="absolute top-4 right-5 text-[#CCB8A3] text-3xl leading-none hover:text-[#FF4719]">&times;</button>
                        <h3 className="text-xl font-heading text-[#F2ECDA] uppercase mb-6 border-b border-[#F2ECDA]/10 pb-4">Detalhes do Lead</h3>

                        <div className="flex flex-col gap-3 text-[#CCB8A3] text-sm">
                            <p><strong className="text-[#F2ECDA]">Nome:</strong> {selectedLead.name || '-'}</p>
                            <p><strong className="text-[#F2ECDA]">E-mail:</strong> {selectedLead.email || '-'}</p>
                            <p><strong className="text-[#F2ECDA]">Telefone:</strong> {selectedLead.phone || '-'}</p>

                            <div className="h-px bg-[#F2ECDA]/10 my-2"></div>

                            <p><strong className="text-[#F2ECDA]">Empresa:</strong> {selectedLead.company || '-'}</p>
                            <p><strong className="text-[#F2ECDA]">Cargo:</strong> {selectedLead.role || '-'}</p>
                            <p><strong className="text-[#F2ECDA]">Momento:</strong> {selectedLead.classification || selectedLead.role || '-'}</p>
                            <p><strong className="text-[#F2ECDA]">Investimento:</strong> {selectedLead.investment_plan || '-'}</p>
                            <p><strong className="text-[#F2ECDA]">Faturamento:</strong> {selectedLead.average_revenue || '-'}</p>

                            <div className="h-px bg-[#F2ECDA]/10 my-2"></div>

                            <p className={`font-bold pb-2 ${selectedLead.completed_second_step ? 'text-[#4CAF50]' : 'text-[#f44336]'}`}>
                                Completou Etapa 2? {selectedLead.completed_second_step ? 'Sim' : 'Não'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
