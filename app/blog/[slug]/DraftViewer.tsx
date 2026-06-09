'use strict';
'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import BlogPostContent from './BlogPostContent';

type DraftViewerProps = {
  slug: string;
  fallbackPost: any;
};

export default function DraftViewer({ slug, fallbackPost }: DraftViewerProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAdmin === null) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-dark)' }}>
        <div className="empty-state">Verificando credenciais de acesso...</div>
      </div>
    );
  }

  if (!isAdmin) {
    // Show premium 404 state
    return (
      <main style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-bg-dark)' }}>
        <h1 className="section-title text-accent" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Artigo Não Encontrado</h1>
        <p style={{ color: 'var(--color-details)', maxWidth: '500px', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
          O artigo que você procura não está publicado ou o link está incorreto.
        </p>
        <a href="/blog" className="btn btn-outline" style={{ borderRadius: '4px' }}>
          Voltar ao Blog
        </a>
      </main>
    );
  }

  // Render content for admin
  return <BlogPostContent post={fallbackPost} />;
}
