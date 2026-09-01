'use strict';
'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '../_components/Toast';
import 'react-quill-new/dist/quill.snow.css';

// Load ReactQuill dynamically to avoid document/window reference errors during Server-Side Rendering (SSR)
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--color-details)' }}>
      Carregando editor visual...
    </div>
  ),
});

// Helper function to create SEO friendly URL slug from text
function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normalize accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

export default function AdminDashboard() {
  const { showToast } = useToast();

  // Authentication States
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'submissions' | 'blogs' | 'media'>('dashboard');

  // Database Data States
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Modal Details State
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  // Blog Editor State
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);
  const [blogEditId, setBlogEditId] = useState<string | number | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImageUrl, setBlogImageUrl] = useState('');
  const [blogCoverFile, setBlogCoverFile] = useState<File | null>(null);
  const [blogSlug, setBlogSlug] = useState('');
  const [blogMetaDesc, setBlogMetaDesc] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogPublished, setBlogPublished] = useState(true);
  const [blogPublishing, setBlogPublishing] = useState(false);
  const [blogMaterialUrl, setBlogMaterialUrl] = useState('');
  const [blogMaterialTitle, setBlogMaterialTitle] = useState('');

  // Image Uploader State
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaDesc, setMediaDesc] = useState('');
  const [mediaUploading, setMediaUploading] = useState(false);

  // 1. Authenticate user session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch all databases tables
  const fetchData = async () => {
    if (!session) return;
    setDataLoading(true);
    try {
      // Fetch Submissions
      const { data: subsData, error: subsError } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch Blogs
      const { data: blogsData, error: blogsError } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch Media Images
      const { data: mediaData, error: mediaError } = await supabase
        .from('blog_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (subsError) console.error('Subs fetch error:', subsError);
      if (blogsError) console.error('Blogs fetch error:', blogsError);
      if (mediaError) console.error('Media fetch error:', mediaError);

      setSubmissions(subsData || []);
      setBlogs(blogsData || []);
      setMediaItems(mediaData || []);
    } catch (err) {
      console.error('Data loading error:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError(error.message.includes('Invalid login') ? 'E-mail ou senha incorretos.' : error.message);
      } else {
        setSession(data.session);
        showToast('Login realizado com sucesso! 🔓');
      }
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    showToast('Sessão encerrada.');
  };

  // Leads actions
  const handleMarkAsRead = async (id: number | string) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status: 'read' })
        .eq('id', id);

      if (error) {
        alert('Erro ao atualizar status: ' + error.message);
      } else {
        showToast('Status do contato atualizado!');
        fetchData();
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // Blog CRUD actions
  const handleOpenBlogForm = (post: any = null) => {
    setBlogCoverFile(null);
    if (post) {
      setBlogEditId(post.id);
      setBlogTitle(post.title);
      setBlogExcerpt(post.excerpt || '');
      setBlogContent(post.content || '');
      setBlogImageUrl(post.image_url || '');
      setBlogSlug(post.slug || '');
      setBlogMetaDesc(post.meta_description || '');
      setBlogAuthor(post.author || '');
      setBlogPublished(post.published ?? true);
      setBlogMaterialUrl(post.material_url || '');
      setBlogMaterialTitle(post.material_title || '');
    } else {
      setBlogEditId(null);
      setBlogTitle('');
      setBlogExcerpt('');
      setBlogContent('');
      setBlogImageUrl('');
      setBlogSlug('');
      setBlogMetaDesc('');
      setBlogAuthor('Agência KABRA');
      setBlogPublished(true);
      setBlogMaterialUrl('');
      setBlogMaterialTitle('');
    }
    setIsBlogFormOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogExcerpt || !blogContent) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setBlogPublishing(true);

    try {
      let finalImageUrl = blogImageUrl.trim() || null;

      // If a cover file is chosen, upload it to Supabase Storage
      if (blogCoverFile) {
        const fileExt = blogCoverFile.name.split('.').pop();
        const fileName = `covers/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        
        const { error: uploadErr } = await supabase.storage
          .from('blog-images')
          .upload(fileName, blogCoverFile);

        if (uploadErr) {
          throw new Error('Erro ao fazer upload da imagem de capa: ' + uploadErr.message);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(fileName);

        finalImageUrl = publicUrl;

        // Also save this cover image to the main gallery
        await supabase
          .from('blog_images')
          .insert([
            {
              url: publicUrl,
              title: `Capa: ${blogTitle}`,
              description: `Imagem de capa carregada automaticamente para o post: ${blogTitle}`,
            },
          ]);
      }

      // If slug is empty, generate it based on title
      const finalSlug = blogSlug.trim() ? generateSlug(blogSlug) : generateSlug(blogTitle);

      const postPayload = {
        title: blogTitle,
        excerpt: blogExcerpt,
        content: blogContent,
        image_url: finalImageUrl,
        slug: finalSlug,
        meta_description: blogMetaDesc.trim() || blogExcerpt.substring(0, 160),
        published: blogPublished,
        author: blogAuthor.trim() || null,
        author_id: session?.user?.id,
        material_url: blogMaterialUrl.trim() || null,
        material_title: blogMaterialTitle.trim() || null,
      };

      let error = null;
      if (blogEditId) {
        // Edit Blog
        const { error: editErr } = await supabase
          .from('blogs')
          .update(postPayload)
          .eq('id', blogEditId);
        error = editErr;
      } else {
        // Create Blog
        const { error: createErr } = await supabase
          .from('blogs')
          .insert([postPayload]);
        error = createErr;
      }

      if (error) {
        alert('Erro ao salvar artigo: ' + error.message);
        console.error(error);
      } else {
        showToast(blogEditId ? 'Artigo atualizado com sucesso!' : 'Artigo publicado com sucesso!');
        setIsBlogFormOpen(false);
        fetchData();
      }
    } catch (err: any) {
      alert(err.message || 'Erro inesperado ao salvar.');
    } finally {
      setBlogPublishing(false);
    }
  };

  const handleDeleteBlog = async (id: number | string) => {
    if (confirm('Tem certeza de que deseja excluir permanentemente este post?')) {
      try {
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (error) {
          alert('Erro ao excluir: ' + error.message);
        } else {
          showToast('Artigo excluído.');
          fetchData();
        }
      } catch (err: any) {
        console.error(err);
      }
    }
  };

  // Image Upload actions
  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile || !mediaTitle) {
      alert('Por favor, selecione um arquivo de imagem e defina um título.');
      return;
    }

    setMediaUploading(true);
    try {
      // 1. Upload to Supabase Storage Bucket
      const fileExt = mediaFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from('blog-images')
        .upload(filePath, mediaFile);

      if (uploadErr) {
        throw new Error('Erro no Storage: ' + uploadErr.message);
      }

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      // 3. Save to database table 'blog_images'
      const { error: dbErr } = await supabase
        .from('blog_images')
        .insert([
          {
            url: publicUrl,
            title: mediaTitle,
            description: mediaDesc || null,
          },
        ]);

      if (dbErr) {
        throw new Error('Erro ao salvar no banco: ' + dbErr.message);
      }

      showToast('Imagem carregada com sucesso!');
      setMediaFile(null);
      setMediaTitle('');
      setMediaDesc('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchData();
    } catch (err: any) {
      alert(err.message);
      console.error(err);
    } finally {
      setMediaUploading(false);
    }
  };

  const handleDeleteImage = async (id: string, url: string) => {
    if (confirm('Tem certeza de que deseja excluir esta imagem da galeria?')) {
      try {
        // Extract file path from public URL
        // Example: https://.../storage/v1/object/public/blog-images/uploads/filename.jpg
        const parts = url.split('/blog-images/');
        if (parts.length > 1) {
          const filePath = parts[1];
          // Delete from storage
          await supabase.storage.from('blog-images').remove([filePath]);
        }

        // Delete database record from Supabase 'blog_images'
        const { error } = await supabase.from('blog_images').delete().eq('id', id);
        if (error) {
          alert('Erro ao excluir do banco de dados: ' + error.message);
        } else {
          showToast('Imagem removida com sucesso!');
          fetchData();
        }
      } catch (err: any) {
        console.error(err);
      }
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('URL da imagem copiada para a área de transferência! 📋');
  };

  // Auth loading screen
  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--color-bg-darker)' }}>
        <div className="empty-state">Verificando sessão de administrador...</div>
      </div>
    );
  }

  // 1. Show Login Screen if no active session
  if (!session) {
    return (
      <div id="login-overlay" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'var(--color-bg-darker)', zIndex: 9999 }}>
        <h2 className="logo" style={{ marginBottom: '2rem' }}>KABRA ADMIN</h2>
        <form onSubmit={handleLogin} className="admin-form" style={{ width: '90%', maxWidth: '400px', textAlign: 'left' }}>
          <p style={{ marginBottom: '1rem', color: 'var(--color-details)', textAlign: 'center' }}>Área restrita. Faça login para continuar.</p>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>E-mail</label>
            <input
              type="email"
              className="form-input"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Senha</label>
            <input
              type="password"
              className="form-input"
              required
              placeholder="Sua senha secreta"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loginLoading}>
            {loginLoading ? 'Verificando...' : 'Entrar no Painel'}
          </button>
          {loginError && (
            <p style={{ color: '#ff4d4d', marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
              {loginError}
            </p>
          )}
        </form>
      </div>
    );
  }

  // 2. Render Administrative Dashboard Panel
  return (
    <div className="admin-wrapper">
      {/* Sidebar Nav */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2 className="logo">KABRA</h2>
          <div style={{ marginTop: '5px' }}>
            <span className="admin-badge">Painel Admin</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button
            onClick={() => { setActiveTab('dashboard'); setIsBlogFormOpen(false); }}
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => { setActiveTab('submissions'); setIsBlogFormOpen(false); }}
            className={`nav-link ${activeTab === 'submissions' ? 'active' : ''}`}
          >
            Leads Cadastrados
          </button>
          <button
            onClick={() => { setActiveTab('blogs'); }}
            className={`nav-link ${activeTab === 'blogs' ? 'active' : ''}`}
          >
            Artigos do Blog
          </button>
          <button
            onClick={() => { setActiveTab('media'); setIsBlogFormOpen(false); }}
            className={`nav-link ${activeTab === 'media' ? 'active' : ''}`}
          >
            Banco de Imagens
          </button>
          <div style={{ flexGrow: 1 }}></div>
          <button
            onClick={handleLogout}
            className="nav-link"
            style={{ color: '#ff4d4d', fontSize: '0.95rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            🔓 Fazer Logout
          </button>
          <a href="/" className="nav-link back-link" style={{ marginTop: '1rem' }}>
            ← Voltar ao Site
          </a>
        </nav>
      </aside>

      {/* Main Panel Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1 className="section-title text-creme" style={{ marginBottom: 0, fontSize: '2rem' }}>
            {activeTab === 'dashboard' && 'Visão Geral'}
            {activeTab === 'submissions' && 'Leads Cadastrados'}
            {activeTab === 'blogs' && 'Gerenciamento de Artigos'}
            {activeTab === 'media' && 'Banco de Imagens'}
          </h1>
        </header>

        <div className="admin-content">
          {dataLoading ? (
            <div className="empty-state">Sincronizando com o banco de dados...</div>
          ) : (
            <>
              {/* TAB 1: VISÃO GERAL */}
              {activeTab === 'dashboard' && (
                <div>
                  <div className="dashboard-grid">
                    <div className="stat-card">
                      <div className="stat-title">Total de Cadastros</div>
                      <div className="stat-value">{submissions.length}</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-title">Novos Contatos</div>
                      <div className="stat-value text-accent">
                        {submissions.filter((s) => s.status === 'new').length}
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-title">Artigos Publicados</div>
                      <div className="stat-value">{blogs.length}</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-title">Imagens na Galeria</div>
                      <div className="stat-value">{mediaItems.length}</div>
                    </div>
                  </div>

                  <div className="view-header-actions" style={{ marginTop: '3rem' }}>
                    <h2>Cadastros Recentes</h2>
                  </div>

                  {submissions.length === 0 ? (
                    <div className="empty-state">Nenhum cadastro encontrado.</div>
                  ) : (
                    <div className="data-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Data/Origem</th>
                            <th>Contato</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {submissions.slice(0, 5).map((sub) => {
                            const dateStr = sub.created_at ? new Date(sub.created_at).toLocaleDateString('pt-BR') : 'Recente';
                            return (
                              <tr key={sub.id}>
                                <td>
                                  {dateStr}
                                  <br />
                                  <small style={{ color: 'var(--color-details)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                    {sub.origin || 'geral'}
                                  </small>
                                </td>
                                <td>
                                  <strong>{sub.email}</strong>
                                  {(sub.name || sub.company) && (
                                    <small style={{ color: 'var(--color-details)', marginTop: '2px', display: 'block' }}>
                                      {sub.name} {sub.company && ` - ${sub.company}`}
                                    </small>
                                  )}
                                </td>
                                <td>
                                  <span className={`badge ${sub.status === 'new' ? 'new' : ''}`}>
                                    {sub.status === 'new' ? 'Novo' : 'Visto'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: SUBMISSIONS */}
              {activeTab === 'submissions' && (
                <div>
                  <div className="view-header-actions">
                    <h2>Todos os Contatos</h2>
                  </div>

                  {submissions.length === 0 ? (
                    <div className="empty-state">Nenhum cadastro encontrado.</div>
                  ) : (
                    <div className="data-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Data/Origem</th>
                            <th>Contato</th>
                            <th>Status</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {submissions.map((sub) => {
                            const dateStr = sub.created_at ? new Date(sub.created_at).toLocaleDateString('pt-BR') : 'Recente';
                            return (
                              <tr key={sub.id}>
                                <td>
                                  {dateStr}
                                  <br />
                                  <small style={{ color: 'var(--color-details)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                    {sub.origin || 'geral'}
                                  </small>
                                </td>
                                <td>
                                  <strong>{sub.email}</strong>
                                  {(sub.name || sub.company) && (
                                    <small style={{ color: 'var(--color-details)', marginTop: '2px', display: 'block' }}>
                                      {sub.name} {sub.company && ` - ${sub.company}`}
                                    </small>
                                  )}
                                </td>
                                <td>
                                  <span className={`badge ${sub.status === 'new' ? 'new' : ''}`}>
                                    {sub.status === 'new' ? 'Novo' : 'Visto'}
                                  </span>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                    {sub.status === 'new' ? (
                                      <button
                                        onClick={() => handleMarkAsRead(sub.id)}
                                        className="btn btn-outline"
                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                      >
                                        Marcar Visto
                                      </button>
                                    ) : (
                                      <span style={{ color: 'var(--color-details)', fontSize: '0.8rem' }}>Analisado</span>
                                    )}
                                    <button
                                      onClick={() => setSelectedLead(sub)}
                                      className="btn btn-outline"
                                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                    >
                                      Ver Detalhes
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: BLOGS */}
              {activeTab === 'blogs' && (
                <div>
                  {!isBlogFormOpen ? (
                    <div>
                      <div className="view-header-actions">
                        <h2>Artigos do Blog</h2>
                        <button className="btn btn-primary" onClick={() => handleOpenBlogForm()}>
                          + Novo Artigo
                        </button>
                      </div>

                      {blogs.length === 0 ? (
                        <div className="empty-state">Nenhum artigo disponível no banco de dados.</div>
                      ) : (
                        <div className="data-table-container">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>Data</th>
                                <th>Título</th>
                                <th>Slug / SEO</th>
                                <th>Status</th>
                                <th>Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {blogs.map((blog) => {
                                const dateStr = blog.created_at ? new Date(blog.created_at).toLocaleDateString('pt-BR') : 'Hoje';
                                return (
                                  <tr key={blog.id}>
                                    <td>{dateStr}</td>
                                    <td>
                                      <strong>{blog.title}</strong>
                                    </td>
                                    <td>
                                      <code style={{ fontSize: '0.8rem', color: 'var(--color-details)' }}>
                                        {blog.slug || '-'}
                                      </code>
                                    </td>
                                    <td>
                                      <span className={`badge ${blog.published ? '' : 'new'}`}>
                                        {blog.published ? 'Publicado' : 'Rascunho'}
                                      </span>
                                    </td>
                                    <td>
                                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                          onClick={() => handleOpenBlogForm(blog)}
                                          className="btn btn-outline"
                                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderColor: 'var(--color-cta)', color: 'var(--color-cta)' }}
                                        >
                                          Editar
                                        </button>
                                        <button
                                          onClick={() => handleDeleteBlog(blog.id)}
                                          className="btn btn-outline"
                                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                        >
                                          Excluir
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* BLOG WRITE/EDIT FORM */
                    <form onSubmit={handleSaveBlog} className="admin-form" style={{ maxWidth: '800px', margin: '0 auto' }}>
                      <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        {blogEditId ? 'Editar Artigo' : 'Criar Novo Artigo'}
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label>Título do Post *</label>
                          <input
                            type="text"
                            className="form-input"
                            required
                            placeholder="Ex: O Futuro do Growth Hacking"
                            value={blogTitle}
                            onChange={(e) => setBlogTitle(e.target.value)}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label>Autor</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Ex: Lucas Freitas ou Agência KABRA"
                            value={blogAuthor}
                            onChange={(e) => setBlogAuthor(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Imagem de Capa (URL ou Upload)</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          <input
                            type="url"
                            className="form-input"
                            placeholder="Link da imagem (https://site.com/imagem.jpg)"
                            value={blogImageUrl}
                            onChange={(e) => setBlogImageUrl(e.target.value)}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-details)' }}>Ou envie um arquivo:</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="form-input"
                              style={{ padding: '0.4rem 0.8rem', width: 'auto', flexGrow: 1 }}
                              onChange={(e) => setBlogCoverFile(e.target.files ? e.target.files[0] : null)}
                            />
                          </div>
                        </div>

                      </div>

                      <div className="form-group">
                        <label>Slug de SEO (Opcional)</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Ex: o-futuro-do-growth-hacking (Se deixar em branco, geramos baseado no título)"
                          value={blogSlug}
                          onChange={(e) => setBlogSlug(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Meta Description de SEO (Opcional)</label>
                        <textarea
                          className="form-input"
                          placeholder="Descrição rápida de até 160 caracteres para buscadores Google."
                          maxLength={160}
                          style={{ minHeight: '60px' }}
                          value={blogMetaDesc}
                          onChange={(e) => setBlogMetaDesc(e.target.value)}
                        />
                        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--color-details)' }}>
                          {blogMetaDesc.length}/160 caracteres
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Resumo / Excerpt *</label>
                        <input
                          type="text"
                          className="form-input"
                          required
                          placeholder="Escreva uma breve descrição..."
                          value={blogExcerpt}
                          onChange={(e) => setBlogExcerpt(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          Conteúdo *
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-details)', fontWeight: 'normal' }}>
                            Editor Visual WYSIWYG
                          </span>
                        </label>
                        <ReactQuill
                          theme="snow"
                          value={blogContent}
                          onChange={setBlogContent}
                          placeholder="Escreva o conteúdo do artigo..."
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                              ['link', 'image'],
                              ['clean']
                            ]
                          }}
                        />
                      </div>

                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-details)', marginBottom: '1rem' }}>
                          Material para Download (opcional) — Ao preencher, um formulário de captura aparecerá no final do artigo e liberará o link após o preenchimento.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Link do Material</label>
                            <input
                              type="url"
                              className="form-input"
                              placeholder="https://drive.google.com/... ou qualquer link"
                              value={blogMaterialUrl}
                              onChange={(e) => setBlogMaterialUrl(e.target.value)}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Título do Material</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Ex: Planilha de Jornada do Cliente"
                              value={blogMaterialTitle}
                              onChange={(e) => setBlogMaterialTitle(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.8rem', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                        <input
                          type="checkbox"
                          id="blog-published"
                          checked={blogPublished}
                          onChange={(e) => setBlogPublished(e.target.checked)}
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <label htmlFor="blog-published" style={{ cursor: 'pointer', userSelect: 'none', marginBottom: 0, color: 'var(--color-creme)' }}>
                          Publicar Artigo (Se desmarcado, ficará salvo como rascunho privado)
                        </label>
                      </div>
 
                      <div className="action-buttons">
                        <button type="submit" className="btn btn-primary" disabled={blogPublishing}>
                          {blogPublishing ? 'Salvando...' : blogEditId ? 'Salvar Edição' : 'Publicar'}
                        </button>
                        <button type="button" className="btn btn-outline" onClick={() => setIsBlogFormOpen(false)}>
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 4: BANCO DE IMAGENS */}
              {activeTab === 'media' && (
                <div>
                  {/* Upload Form */}
                  <form onSubmit={handleUploadImage} className="admin-form" style={{ marginBottom: '3rem' }}>
                    <h3>Subir Nova Imagem para a Galeria</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div className="form-group">
                        <label>Arquivo de Imagem *</label>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="form-input"
                          accept="image/*"
                          required
                          onChange={(e) => setMediaFile(e.target.files ? e.target.files[0] : null)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Título da Imagem (SEO Alt Tag) *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Ex: Gráfico de Leads Crescendo"
                          required
                          value={mediaTitle}
                          onChange={(e) => setMediaTitle(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Descrição / Contexto</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ex: Gráfico gerado para demonstrar funil na seção 2 do post."
                        value={mediaDesc}
                        onChange={(e) => setMediaDesc(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '200px' }} disabled={mediaUploading}>
                      {mediaUploading ? 'Carregando Imagem...' : 'Subir Imagem'}
                    </button>
                  </form>

                  {/* Gallery */}
                  <h2>Galeria de Imagens</h2>
                  {mediaItems.length === 0 ? (
                    <div className="empty-state" style={{ marginTop: '1.5rem' }}>Nenhuma imagem cadastrada no banco de dados.</div>
                  ) : (
                    <div className="media-gallery-grid">
                      {mediaItems.map((item) => (
                        <div key={item.id} className="media-item-card">
                          <img src={item.url} alt={item.title} className="media-item-preview" />
                          <div className="media-item-info">
                            <span className="media-item-title">{item.title}</span>
                            <p className="media-item-desc">{item.description || 'Sem descrição.'}</p>
                            <div className="media-item-actions">
                              <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => handleCopyUrl(item.url)}
                              >
                                Copiar Link
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline"
                                style={{ borderColor: '#ff4d4d', color: '#ff4d4d' }}
                                onClick={() => handleDeleteImage(item.id, item.url)}
                              >
                                Excluir
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* LEAD DETAILS MODAL OVERLAY */}
      {selectedLead && (
        <div
          id="details-modal"
          className="modal-overlay active"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)' }}
          onClick={(e) => e.target === e.currentTarget && setSelectedLead(null)}
        >
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto', background: 'var(--color-bg-dark)', padding: '2rem', borderRadius: '8px', width: '450px', maxWidth: '90%', position: 'relative' }}>
            <button
              className="modal-close"
              style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', color: '#fff', cursor: 'pointer' }}
              onClick={() => setSelectedLead(null)}
            >
              &times;
            </button>
            <h3 style={{ marginBottom: '20px', color: 'var(--color-cta)' }}>Detalhes do Lead</h3>
            <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text)' }}>
              <p><strong>Nome:</strong> {selectedLead.name || '-'}</p>
              <p><strong>E-mail:</strong> {selectedLead.email || '-'}</p>
              <p><strong>Telefone:</strong> {selectedLead.phone || '-'}</p>
              <p style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <strong>Empresa:</strong> {selectedLead.company || '-'}
              </p>
              <p><strong>Cargo:</strong> {selectedLead.role || '-'}</p>
              <p><strong>Momento:</strong> {selectedLead.classification || '-'}</p>
              <p><strong>Investimento:</strong> {selectedLead.investment_plan || '-'}</p>
              <p><strong>Faturamento:</strong> {selectedLead.average_revenue || '-'}</p>
              <p style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', color: selectedLead.completed_second_step ? '#4caf50' : '#f44336' }}>
                <strong>Completou Etapa 2?</strong> {selectedLead.completed_second_step ? 'Sim' : 'Não'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
