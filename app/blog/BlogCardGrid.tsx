'use client';

import React from 'react';
import { useModal } from '@/app/_components/ModalContext';

type Post = {
  id: string | number;
  slug?: string;
  title: string;
  excerpt?: string;
  image_url?: string;
  created_at: string;
};

export default function BlogCardGrid({ posts }: { posts: Post[] }) {
  const { openModal } = useModal();

  return (
    <div className="blog-grid">
      {posts.map((post) => {
        const dateStr = new Date(post.created_at).toLocaleDateString('pt-BR');
        const postUrl = `/blog/${post.slug || post.id}`;

        return (
          <div
            key={post.id}
            className="post-card"
            role="button"
            tabIndex={0}
            onClick={() => openModal({ redirectUrl: postUrl, origin: 'blog' })}
            onKeyDown={(e) => e.key === 'Enter' && openModal({ redirectUrl: postUrl, origin: 'blog' })}
            style={{ cursor: 'pointer' }}
          >
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
                  color: 'var(--color-cta)',
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
          </div>
        );
      })}
    </div>
  );
}
