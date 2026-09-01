import React from 'react';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabaseClient';
import BlogCardGrid from './BlogCardGrid';

// Force dynamic rendering to fetch the latest blogs on each request
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Blog KABRA | Estratégia e Aceleração de Negócios',
  description:
    'Perspectivas não-convencionais, tecnologia e estratégias focadas em aceleração de negócios. Artigos da agência KABRA.',
  openGraph: {
    title: 'Blog KABRA | Estratégia e Aceleração de Negócios',
    description:
      'Perspectivas não-convencionais, tecnologia e estratégias focadas em aceleração de negócios.',
    type: 'website',
  },
};

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
          <h1 className="section-title text-creme" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
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
          <BlogCardGrid posts={blogs} />
        )}
      </section>
    </main>
  );
}
