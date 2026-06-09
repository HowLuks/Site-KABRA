import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import BlogPostContent from './BlogPostContent';
import DraftViewer from './DraftViewer';

// Force dynamic rendering to fetch the latest post on request
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }>;
};

// Helper function to fetch the blog post from Supabase
async function getPost(slug: string) {
  // 1. Try to fetch by slug
  let query = supabase.from('blogs').select('*').eq('slug', slug);
  let { data, error } = await query.single();

  // 2. Fallback: Try to fetch by ID (supports UUIDs and numeric IDs for legacy URLs)
  if (error || !data) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    const isNumeric = /^\d+$/.test(slug);

    if (isUuid || isNumeric) {
      const fallbackQuery = supabase.from('blogs').select('*').eq('id', slug);
      const fallbackResult = await fallbackQuery.single();
      if (!fallbackResult.error && fallbackResult.data) {
        data = fallbackResult.data;
      }
    }
  }

  return data;
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Artigo Não Encontrado | KABRA',
      description: 'O artigo que você procura não foi encontrado no blog da KABRA.',
    };
  }

  // If draft, return private metadata to avoid leaking search content
  if (!post.published) {
    return {
      title: 'Rascunho de Artigo | KABRA',
      description: 'Área restrita de rascunhos. Apenas administradores autorizados.',
      robots: 'noindex, nofollow',
    };
  }

  return {
    title: `KABRA | ${post.title}`,
    description: post.meta_description || post.excerpt || 'Lendo artigo no blog da KABRA.',
    openGraph: {
      title: `KABRA | ${post.title}`,
      description: post.meta_description || post.excerpt || 'Lendo artigo no blog da KABRA.',
      type: 'article',
      images: post.image_url ? [{ url: post.image_url }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // If the post is a draft (not published), render the DraftViewer to check client permissions
  if (!post.published) {
    return <DraftViewer slug={slug} fallbackPost={post} />;
  }

  // Otherwise, render full server-side content
  return <BlogPostContent post={post} />;
}
