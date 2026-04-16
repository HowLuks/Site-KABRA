"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <section className="hero min-h-screen flex items-center relative pt-20 bg-[radial-gradient(circle_at_top_right,_var(--color-bg-darker),_var(--color-bg-dark)_80%)] overflow-hidden">
        <div className="container mx-auto px-5 max-w-[1200px] relative z-10">
          <div className="max-w-[800px]">
            <h1 className="text-[clamp(2.2rem,5vw,4rem)] mb-6 text-[#F2ECDA] font-heading font-bold uppercase leading-[1.1] tracking-wide">
              CONTEÚDO SEM<br />POSICIONAMENTO<br />
              <span className="text-[#FF4719]">VIRA RUÍDO.</span>
            </h1>
            <p className="text-[1rem] text-[#CCB8A3] max-w-[600px] mb-12 font-light leading-relaxed">
              Nós fugimos do generalismo. Através do <strong className="text-[#F2ECDA] font-semibold">conteúdo estratégico</strong> e execução afiada, transformamos a essência da sua marca em resultados inquestionáveis.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => document.dispatchEvent(new Event('open-kabra-popup'))} className="inline-flex items-center justify-center font-heading text-[1rem] tracking-wider uppercase border-none cursor-pointer transition-all duration-400 rounded px-11 py-5 bg-[#FF4719] text-[#F2ECDA] hover:bg-[#e03810] hover:-translate-y-0.5 shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_rgba(255,71,25,0.3)]">
                Acelerar meu negócio
              </button>
              <Link href="#manifesto" className="inline-flex items-center justify-center font-heading text-[1rem] tracking-wider uppercase cursor-pointer transition-all duration-400 rounded px-11 py-5 bg-transparent text-[#F2ECDA] border-2 border-[#F2ECDA] hover:bg-[#F2ECDA] hover:text-[#252B27] hover:-translate-y-0.5">
                Descubra a KABRA
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bg-contain bg-no-repeat bg-center opacity-90 w-[250px] h-[250px] bg-[url('/img/Kabra_icones_ave_laranja.png')] top-[10%] right-[5%] rotate-[15deg] pointer-events-none"></div>
        <div className="absolute bg-contain bg-no-repeat bg-center opacity-60 w-[350px] h-[350px] bg-[url('/img/Kabra_icones_arbusto_cinza.png')] bottom-[5%] left-[2%] pointer-events-none"></div>
        <div className="absolute rounded-full blur-[100px] z-0 opacity-15 w-[500px] h-[500px] bg-[#FF4719] top-[-100px] right-[-100px] pointer-events-none"></div>
        <div className="absolute rounded-full blur-[100px] z-0 opacity-15 w-[600px] h-[600px] bg-[#CCB8A3] bottom-[-200px] left-[-200px] pointer-events-none"></div>
      </section>

      <section id="manifesto" className="bg-[#F2ECDA] text-[#252B27] py-32 relative overflow-hidden">
        <div className="absolute bg-contain bg-no-repeat bg-center opacity-90 w-[400px] h-[400px] bg-[url('/img/Kabra_icones_sol_bege.png')] top-[-100px] right-[-150px] -rotate-12 pointer-events-none"></div>

        <div className="container mx-auto px-5 max-w-[1200px] relative z-10 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-20 items-center">
          <div className="text-center md:text-left">
            <h2 className="font-heading font-bold uppercase leading-[1.1] tracking-wide text-[clamp(1.8rem,4vw,3rem)] mb-4 text-[#252B27]">Nosso<br />Manifesto</h2>
            <div className="w-[80px] h-[4px] bg-[#FF4719] mx-auto md:mx-0"></div>
          </div>
          <div className="text-[1rem] leading-[1.8]">
            <p className="text-[1.15rem] font-semibold text-[#FF4719] mb-6">Nascemos para questionar o padrão. Em um mar de agências genéricas, a KABRA escolheu ser o ponto de ignição.</p>
            <p className="mb-6">Nós honramos a história e o legado das marcas que atendemos, mas não nos contentamos com o conforto do que já foi feito. Unimos a ousadia e o lado humano da criatividade à clareza fria da análise de dados.</p>
            <p>O resultado? Um crescimento fora da curva, onde cada história contada tem um propósito claro: <strong>converter e escalar.</strong></p>
          </div>
        </div>
      </section>

      <section id="servicos" className="py-32 bg-[#252B27] relative overflow-hidden">
        <div className="absolute bg-contain bg-no-repeat bg-center opacity-90 w-[450px] h-[450px] bg-[url('/img/Kabra_icones_cacto_bege.png')] bottom-[-150px] left-[-100px] rotate-[10deg] pointer-events-none"></div>
        <div className="container mx-auto px-5 max-w-[1200px] relative z-10">
          <div className="mb-20 text-center">
            <span className="inline-block text-[#CCB8A3] font-heading text-[1.2rem] tracking-widest mb-2">A Engrenagem</span>
            <h2 className="font-heading font-bold uppercase leading-[1.1] tracking-wide text-[clamp(1.8rem,4vw,3rem)] text-[#F2ECDA] mb-4">Pilares de Atuação</h2>
            <p className="text-[#CCB8A3] text-[1.2rem] max-w-[600px] mx-auto">A base da nossa metodologia que garante aceleração constante.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <article className="bg-[#36423A] p-12 rounded-lg border-t-4 border-[#36423A] transition-all duration-400 hover:-translate-y-2 hover:border-[#FF4719] hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)]">
              <div className="text-[#FF4719] mb-8">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <h3 className="font-heading font-bold uppercase text-[1.3rem] mb-4 text-[#F2ECDA]">Conteúdo e Identidade</h3>
              <p className="text-[#CCB8A3] text-[0.95rem]">Construímos narrativas que convertem. Do copywriting magnético ao design impecável, sua marca ganha voz e autoridade.</p>
            </article>

            <article className="bg-[#36423A] p-12 rounded-lg border-t-4 border-[#36423A] transition-all duration-400 hover:-translate-y-2 hover:border-[#FF4719] hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)]">
              <div className="text-[#FF4719] mb-8">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <h3 className="font-heading font-bold uppercase text-[1.3rem] mb-4 text-[#F2ECDA]">Growth Intelligence</h3>
              <p className="text-[#CCB8A3] text-[0.95rem]">A criatividade sem métrica é apenas arte. Nós traduzimos engajamento em dados, otimizando cada etapa do funil de vendas.</p>
            </article>

            <article className="bg-[#36423A] p-12 rounded-lg border-t-4 border-[#36423A] transition-all duration-400 hover:-translate-y-2 hover:border-[#FF4719] hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)]">
              <div className="text-[#FF4719] mb-8">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <h3 className="font-heading font-bold uppercase text-[1.3rem] mb-4 text-[#F2ECDA]">Aceleração de Negócios</h3>
              <p className="text-[#CCB8A3] text-[0.95rem]">Implementamos estratégias full-service de growth para escalar a sua operação rapidamente e dominar o seu segmento.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="contato" className="py-32 bg-[#36423A] border-t border-[#CCB8A3]/10 text-center relative overflow-hidden">
        <div className="absolute bg-contain bg-no-repeat bg-center opacity-90 w-[300px] h-[300px] bg-[url('/img/Kabra_icones_raio_laranja.png')] top-[-50px] right-[2%] -rotate-6 pointer-events-none"></div>
        <div className="container mx-auto px-5 max-w-[800px] relative z-10">
          <h2 className="font-heading font-bold uppercase leading-[1.1] tracking-wide text-[clamp(1.8rem,4vw,2.8rem)] mb-6 text-[#F2ECDA]">Pronto para um crescimento<br /><span className="text-[#FF4719]">fora da curva?</span></h2>
          <p className="text-[1rem] text-[#CCB8A3] mb-12">Se a sua marca busca não apenas aparecer, mas liderar, a KABRA é a parceria certa.</p>
          <div className="flex justify-center mt-8">
            <button onClick={() => document.dispatchEvent(new Event('open-kabra-popup'))} className="inline-flex items-center justify-center font-heading text-[1.2rem] tracking-wider uppercase border-none cursor-pointer transition-all duration-400 rounded px-10 py-5 bg-[#FF4719] text-[#F2ECDA] hover:bg-[#e03810] hover:-translate-y-0.5 min-w-[280px]">
              Quero Acelerar
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
