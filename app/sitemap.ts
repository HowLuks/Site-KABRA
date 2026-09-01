import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { SITE_URL as BASE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    {
      url: `${BASE_URL}/marketing-para-pequenas-empresas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  const { data: posts } = await supabase
    .from('blogs')
    .select('slug, created_at')
    .eq('published', true);

  const postRoutes: MetadataRoute.Sitemap = (posts || [])
    .filter((post) => post.slug)
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.created_at),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  return [...staticRoutes, ...postRoutes];
}
