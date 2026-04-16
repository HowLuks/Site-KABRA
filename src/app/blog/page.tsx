import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 0; // SSR

export const metadata = {
    title: 'Blog KABRA | Conteúdo Estratégico',
    description: 'Insights e estratégias de aceleração digital.',
};

export default async function BlogHub() {
    const { data: blogs } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

    return (
        <section className="bg-[var(--color-bg-darker)] min-h-screen py-20 relative overflow-hidden">
            <div className="absolute bg-contain bg-no-repeat bg-center opacity-90 w-[300px] h-[300px] bg-[url('/img/Kabra_icones_ave_laranja.png')] top-[-50px] right-[2%] rotate-[15deg] pointer-events-none"></div>

            <div className="container mx-auto px-5 max-w-[1200px] relative z-10">
                <div className="text-center max-w-[800px] mx-auto mb-20">
                    <span className="inline-block text-[#CCB8A3] font-heading text-[1.2rem] tracking-widest mb-2">Acervo</span>
                    <h1 className="font-heading font-bold uppercase leading-[1.1] tracking-wide text-[clamp(2.2rem,5vw,3.5rem)] text-[#F2ECDA] mb-4">
                        Conteúdo Estratégico
                    </h1>
                    <p className="text-[1.2rem] text-[#CCB8A3]">Para quem não se satisfaz com o básico. Mergulhe nas nossas teses de aceleração.</p>
                </div>

                {(!blogs || blogs.length === 0) ? (
                    <div className="text-center py-20 text-[#CCB8A3] bg-[#252B27]/50 rounded-lg">
                        <h3 className="font-heading text-2xl uppercase mb-2">Nenhum artigo encontrado</h3>
                        <p>Nossos primeiros conteúdos estão sendo preparados.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map(post => (
                            <Link href={`/blog/${post.id}`} key={post.id} className="group flex flex-col bg-[#252B27] rounded-lg overflow-hidden border-2 border-transparent transition-all duration-400 hover:-translate-y-2 hover:border-[#FF4719] hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)]">
                                {post.image_url ? (
                                    <div className="w-full h-[220px] overflow-hidden">
                                        <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    </div>
                                ) : (
                                    <div className="w-full h-[220px] bg-[#36423A] flex items-center justify-center">
                                        <span className="text-[#CCB8A3] font-heading tracking-widest uppercase opacity-30 text-2xl">KABRA</span>
                                    </div>
                                )}
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="inline-block px-3 py-1 bg-[#36423A] text-[#F2ECDA] text-xs uppercase tracking-wider rounded font-medium">Growth</span>
                                        <span className="text-[#CCB8A3] text-sm">{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <h3 className="text-[#F2ECDA] font-heading text-[1.5rem] uppercase leading-[1.2] mb-3 group-hover:text-[#FF4719] transition-colors">{post.title}</h3>
                                    <p className="text-[#CCB8A3] text-[0.95rem] line-clamp-3 flex-grow">{post.excerpt}</p>

                                    <div className="mt-6 flex items-center text-[#FF4719] font-heading uppercase text-sm tracking-wider">
                                        Ler Artigo <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
