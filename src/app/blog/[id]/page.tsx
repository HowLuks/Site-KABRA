import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { marked } from 'marked';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { id: string } }) {
    const { data } = await supabase.from('blogs').select('*').eq('id', params.id).single();
    if (!data) return { title: 'Post não encontrado | KABRA' };
    return {
        title: `${data.title} | Blog KABRA`,
        description: data.excerpt,
    };
}

export default async function BlogPost({ params }: { params: { id: string } }) {
    const { data: post, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !post) {
        notFound();
    }

    const contentHtml = marked.parse(post.content || '', { breaks: true, gfm: true });

    return (
        <article className="bg-[var(--color-bg-darker)] min-h-screen pt-20 pb-32">
            <div className="container mx-auto px-5 max-w-[800px]">
                <Link href="/blog" className="inline-flex items-center text-[#CCB8A3] text-sm uppercase tracking-wider mb-10 hover:text-[#FF4719] transition-colors font-heading">
                    <span className="mr-2">←</span> Voltar para Conteúdos
                </Link>

                <header className="mb-12 border-b border-[#F2ECDA]/10 pb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="inline-block px-3 py-1 bg-[#36423A] text-[#F2ECDA] text-xs uppercase tracking-wider rounded font-medium">Growth</span>
                        <span className="text-[#CCB8A3] text-sm">{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <h1 className="font-heading font-bold uppercase leading-[1.1] tracking-wide text-[clamp(2.2rem,5vw,3.5rem)] text-[#F2ECDA] mb-6">
                        {post.title}
                    </h1>
                    <p className="text-[1.2rem] text-[#CCB8A3] leading-relaxed">
                        {post.excerpt}
                    </p>
                </header>

                {post.image_url && (
                    <div className="w-full h-[400px] mb-12 rounded-xl overflow-hidden shadow-2xl">
                        <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div
                    className="post-body text-[#CCB8A3] text-[1.15rem] leading-[1.8]"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
            </div>

            {/* Scoped CSS for Markdown */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .post-body p { margin-bottom: 1.5rem; }
                .post-body h1 {
                    font-family: var(--font-heading);
                    font-size: 2.5rem;
                    color: var(--color-creme);
                    margin: 3rem 0 1.5rem;
                    border-bottom: 1px solid rgba(242, 236, 218, 0.1);
                    padding-bottom: 0.5rem;
                    text-transform: uppercase;
                }
                .post-body h2 {
                    font-family: var(--font-heading);
                    font-size: 2.2rem;
                    color: var(--color-cta);
                    margin: 3.5rem 0 1.5rem;
                    text-transform: uppercase;
                }
                .post-body h3 {
                    font-family: var(--font-heading);
                    font-size: 1.6rem;
                    color: var(--color-creme);
                    margin: 2.5rem 0 1rem;
                    text-transform: uppercase;
                }
                .post-body h4, .post-body h5, .post-body h6 {
                    font-family: var(--font-heading);
                    color: var(--color-creme);
                    font-size: 1.3rem;
                    margin: 2rem 0 1rem;
                    text-transform: uppercase;
                }
                .post-body ul, .post-body ol {
                    margin-bottom: 1.5rem;
                    padding-left: 2rem;
                    color: var(--color-details);
                    list-style: disc;
                }
                .post-body li {
                    margin-bottom: 0.5rem;
                }
                .post-body a {
                    color: var(--color-cta);
                    text-decoration: underline;
                }
                .post-body strong {
                    color: white;
                    font-weight: 700;
                }
            `}} />
        </article>
    );
}
