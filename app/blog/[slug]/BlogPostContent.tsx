import React from 'react';
import Link from 'next/link';

export default function BlogPostContent({ post }: { post: any }) {
  const dateStr = new Date(post.created_at).toLocaleDateString('pt-BR');

  return (
    <main style={{ minHeight: '80vh' }}>
      <section className="post-header">
        <div className="container">
          <div className="post-meta">
            {dateStr} &bull; {post.author || 'Agência KABRA'}
          </div>
          <h1 className="post-title">{post.title}</h1>
        </div>
      </section>

      {post.image_url && (
        <div className="post-cover-wrapper">
          <img src={post.image_url} className="post-cover" alt={post.title} />
        </div>
      )}

      <section className="container">
        <div className="post-body">
          <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />

          <div className="back-nav">
            <Link href="/blog" className="btn btn-outline" style={{ borderRadius: '4px' }}>
              ← Explorar mais artigos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
