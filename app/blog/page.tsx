import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// Force dynamic rendering to fetch the latest blogs on each request
export const revalidate = 0;

export default async function BlogList() {
  let blogs: any[] = [];
  let fetchError = false;

  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blogs:', error);
      fetchError = true;
    } else {
      blogs = data || [];
    }
  } catch (err) {
    console.error('Fetch error:', err);
    fetchError = true;
  }

  return (
    <main style={{ minHeight: '80vh' }}>
      <section className="blog-header">
        <div className="container">
          <span className="eyebrow">Conteúdo Estratégico</span>
          <h1 className="section-title text-creme" style={{ fontSize: '3.5rem' }}>
            KABRA <span className="text-accent">Blog</span>
          </h1>
          <p className="section-description" style={{ margin: '1rem auto 0', maxWidth: '600px' }}>
            Perspectivas não-convencionais, tecnologia e estratégias focadas em aceleração de negócios.
          </p>
        </div>
      </section>

      <section className="container">
        {fetchError ? (
          <div className="empty-state" style={{ textAlign: 'center', width: '100%', padding: '4rem' }}>
            Erro ao carregar os artigos do banco de dados.
          </div>
        ) : blogs.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', width: '100%', padding: '4rem' }}>
            Nenhum artigo publicado ainda. Fique de olho! 🚀
          </div>
        ) : (
          <div className="blog-grid">
            {blogs.map((post) => {
              const dateStr = new Date(post.created_at).toLocaleDateString('pt-BR');
              const postSlugOrId = post.slug || post.id;
              
              return (
                <Link key={post.id} href={`/blog/${postSlugOrId}`} className="post-card">
                  {post.image_url ? (
                    <img src={post.image_url} className="post-img" alt={post.title} />
                  ) : (
                    <div
                      className="post-img"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#1b201d',
                        color: 'var(--color-bg-darker)',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '2rem',
                      }}
                    >
                      KABRA
                    </div>
                  )}
                  <div className="post-content">
                    <span className="post-date">{dateStr}</span>
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-excerpt">{post.excerpt || ''}</p>
                    <span className="read-more">Ler artigo completo →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
