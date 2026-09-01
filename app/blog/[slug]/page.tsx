import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { SITE_URL } from '@/lib/site';
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

  const canonicalUrl = `${SITE_URL}/blog/${post.slug || slug}`;

  return {
    title: `KABRA | ${post.title}`,
    description: post.meta_description || post.excerpt || 'Lendo artigo no blog da KABRA.',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `KABRA | ${post.title}`,
      description: post.meta_description || post.excerpt || 'Lendo artigo no blog da KABRA.',
      type: 'article',
      url: canonicalUrl,
      images: post.image_url ? [{ url: post.image_url }] : [],
    },
  };
}

function buildArticleJsonLd(post: any, slug: string) {
  const canonicalUrl = `${SITE_URL}/blog/${post.slug || slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.meta_description || post.excerpt || 'Lendo artigo no blog da KABRA.',
    image: post.image_url ? [post.image_url] : undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      '@type': 'Organization',
      name: post.author || 'Agência KABRA',
    },
    publisher: {
      '@type': 'Organization',
      name: 'KABRA',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/img/logo.png`,
        width: 1710,
        height: 272,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleJsonLd(post, slug)) }}
      />
      <BlogPostContent post={post} />
    </>
  );
}
