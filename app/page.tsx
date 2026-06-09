'use strict';
'use client';

import React from 'react';
import { useModal } from './_components/ModalContext';

export default function Home() {
  const { openModal } = useModal();

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    openModal();
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              CONTEÚDO SEM
              <br />
              POSICIONAMENTO
              <br />
              <span className="text-accent">VIRA RUÍDO.</span>
            </h1>
            <p className="hero-subtitle">
              Nós fugimos do generalismo. Através do <strong>conteúdo estratégico</strong> e execução afiada,
              transformamos a essência da sua marca em resultados inquestionáveis.
            </p>
            <div className="hero-actions">
              <button onClick={handleCtaClick} className="btn btn-primary btn-large">
                Acelerar meu negócio
              </button>
              <a href="#manifesto" className="btn btn-outline btn-large">
                Descubra a KABRA
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Visual Elements */}
        <div className="grafismo grafismo-passaro"></div>
        <div className="grafismo grafismo-4"></div>
        <div className="hero-decor decor-1"></div>
        <div className="hero-decor decor-2"></div>
      </section>

      {/* Manifesto Section */}
      <section id="manifesto" className="manifesto" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="grafismo grafismo-1"></div>
        <div className="container manifesto-grid">
          <div className="manifesto-intro">
            <h2 className="section-title text-dark">
              Nosso
              <br />
              Manifesto
            </h2>
            <div className="accent-line"></div>
          </div>
          <div className="manifesto-body">
            <p className="lead-text">
              Nascemos para questionar o padrão. Em um mar de agências genéricas, a KABRA escolheu ser o ponto de
              ignição.
            </p>
            <p>
              Nós honramos a história e o legado das marcas que atendemos, mas não nos contentamos com o conforto do
              que já foi feito. Unimos a ousadia e o lado humano da criatividade à clareza fria da análise de dados.
            </p>
            <p>
              O resultado? Um crescimento fora da curva, onde cada história contada tem um propósito claro:{' '}
              <strong>converter e escalar.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Pilares de Atuação (Services) */}
      <section id="servicos" className="services" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="grafismo grafismo-2"></div>
        <div className="container">
          <div className="section-header center">
            <span className="eyebrow">A Engrenagem</span>
            <h2 className="section-title">Pilares de Atuação</h2>
            <p className="section-description">A base da nossa metodologia que garante aceleração constante.</p>
          </div>

          <div className="services-grid">
            {/* Service 1 */}
            <article className="service-card">
              <div className="service-icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6" />
                  <path d="m9 15 3 3 3-3" />
                </svg>
              </div>
              <h3 className="service-title">Storytelling Estratégico</h3>
              <p className="service-text">
                Construímos narrativas profundas e humanas que conectam a sua marca ao cliente ideal, gerando
                identificação e desejo imediato.
              </p>
            </article>

            {/* Service 2 */}
            <article className="service-card">
              <div className="service-icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <h3 className="service-title">Execução Analítica</h3>
              <p className="service-text">
                A criatividade sem métrica é apenas arte. Nós traduzimos engajamento em dados, otimizando cada etapa do
                funil de vendas.
              </p>
            </article>

            {/* Service 3 */}
            <article className="service-card">
              <div className="service-icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3 className="service-title">Aceleração de Negócios</h3>
              <p className="service-text">
                Implementamos estratégias full-service de growth para escalar a sua operação rapidamente e dominar o
                seu segmento de mercado.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA de Fechamento */}
      <section id="contato" className="cta-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="grafismo grafismo-3"></div>
        <div className="container cta-container">
          <h2 className="cta-title">
            Pronto para um crescimento
            <br />
            <span className="text-accent">fora da curva?</span>
          </h2>
          <p className="cta-desc">
            Se a sua marca busca não apenas aparecer, mas liderar, a KABRA é a parceria certa.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button onClick={handleCtaClick} className="btn btn-primary btn-large">
              Acelerar meu negócio
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
