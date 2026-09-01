'use strict';
'use client';

import React, { useState } from 'react';
import { Hero04 } from '@/components/ui/hero-04';
import { useModal } from '../_components/ModalContext';
import { STEPS, FAQS } from './data';

export default function ServicoPequenasEmpresasContent() {
  const { openModal } = useModal();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCtaClick = (origin: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openModal({ origin });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq((current) => (current === index ? null : index));
  };

  return (
    <main>
      {/* SEÇÃO 1 — Hero */}
      <Hero04
        title="Marketing com escopo fechado"
        titleLine2="para quem tem negócio pequeno e não pode gastar errado"
        description="A Kabra cuida do tráfego e do conteúdo da sua empresa com um plano de trabalho claro, sem letra miúda e sem depender de você entender de marketing para saber se está funcionando."
        primaryImage="/img/hero/team-debating.webp"
        secondaryImage="/img/hero/raio-3d.webp"
        primaryAlt="Equipe da Kabra debatendo estratégia de marketing em volta de uma mesa"
        secondaryAlt="Logo 3D do raio da identidade visual da Kabra"
        animation="none"
        primaryCTA={{
          ctaEnabled: true,
          text: 'Falar com a Kabra',
          variant: 'default',
          size: 'lg',
          onClick: handleCtaClick('lp-pequenas-empresas-hero'),
        }}
        secondaryCTA={{
          ctaEnabled: true,
          text: 'Ver como funciona',
          link: '#como-funciona',
          variant: 'link',
        }}
      />

      {/* SEÇÃO 2 — O problema que a gente resolve */}
      <section id="problema" className="manifesto" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="grafismo grafismo-1"></div>
        <div className="container manifesto-grid">
          <div className="manifesto-intro">
            <h2 className="section-title text-dark">
              O problema
              <br />
              que a gente resolve
            </h2>
            <div className="accent-line"></div>
          </div>
          <div className="manifesto-body">
            <p className="lead-text">
              Micro e pequena empresa não tem margem para testar cinco agências até achar uma que entrega.
            </p>
            <p>
              O dono geralmente já está sobrecarregado tocando a operação, e contratar marketing vira mais uma
              responsabilidade em vez de um alívio.
            </p>
            <p>
              A Kabra trabalha com <strong>escopo fechado</strong>, tráfego e conteúdo, exatamente para isso não
              acontecer. Você sabe o que está contratando, sabe o que esperar, e não precisa aprender a linguagem
              técnica de marketing para acompanhar o trabalho.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — Como funciona */}
      <section id="como-funciona" className="services" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="grafismo grafismo-2"></div>
        <div className="container">
          <div className="section-header center">
            <span className="eyebrow">O Processo</span>
            <h2 className="section-title">Como funciona</h2>
            <p className="section-description">Quatro etapas, sem letra miúda, do diagnóstico ao ajuste contínuo.</p>
          </div>

          <div className="svc-path">
            <div className="svc-path-line"></div>
            {STEPS.map((step) => (
              <div className="svc-path-item" key={step.number}>
                <span className="svc-path-marker">{step.number}</span>
                <div className="svc-path-text">
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — Cases */}
      <section id="cases" className="svc-cases">
        <div className="container">
          <div className="section-header center">
            <span className="eyebrow">Resultados Reais</span>
            <h2 className="section-title">Cases</h2>
            <p className="section-description">Trabalho de escopo fechado, com números que sustentam o discurso.</p>
          </div>

          <div className="svc-cases-grid">
            <article className="svc-case-card">
              <h3 className="svc-case-name">Lecoland Petshop</h3>
              <p className="svc-case-text">
                Trabalho contínuo de tráfego pago (Meta Ads) e produção de criativos para um petshop local. Em 4
                meses de campanha, geramos mais de 600 leads, todos entregues como oportunidades reais para o time
                comercial trabalhar.
              </p>
              <div className="svc-case-stat">
                <span className="svc-case-stat-number">+600</span>
                <span className="svc-case-stat-label">
                  leads em
                  <br />4 meses
                </span>
              </div>
            </article>

            <article className="svc-case-card">
              <h3 className="svc-case-name">Dona Cely Joias</h3>
              <p className="svc-case-text">
                Campanha de tráfego pago para o Dia dos Namorados, com R$ 1.000 investidos em anúncios. O retorno em
                vendas foi de R$ 40.000, um retorno de 40 vezes o valor investido no período da campanha.
              </p>
              <div className="svc-case-stat">
                <span className="svc-case-stat-number">40x</span>
                <span className="svc-case-stat-label">
                  retorno sobre
                  <br />o investimento
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 — Por que a Kabra */}
      <section id="porque-kabra" className="services" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="grafismo grafismo-3"></div>
        <div className="container">
          <div className="section-header center">
            <span className="eyebrow">Diferenciais</span>
            <h2 className="section-title">Por que a Kabra</h2>
          </div>

          <div className="services-grid">
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
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <path d="m9 14 2 2 4-4" />
                </svg>
              </div>
              <h3 className="service-title">Escopo fechado</h3>
              <p className="service-text">
                Você sabe exatamente o que está contratando. Sem pacote inflado, sem entrega genérica.
              </p>
            </article>

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
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <h3 className="service-title">Método GOAT</h3>
              <p className="service-text">
                Nosso processo de trabalho identifica o gargalo real do seu negócio antes de sair produzindo
                conteúdo ou rodando anúncio sem direção.
              </p>
            </article>

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
                  <path d="M3 14v-3a9 9 0 0 1 18 0v3" />
                  <path d="M21 14v4a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
                  <path d="M3 14v4a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
              </div>
              <h3 className="service-title">Acompanhamento direto</h3>
              <p className="service-text">
                Você fala com quem está tocando sua conta, não com um atendimento terceirizado que não entende do
                seu negócio.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6 — Perguntas frequentes */}
      <section id="faq" className="svc-faq">
        <div className="container">
          <div className="section-header center">
            <span className="eyebrow">Dúvidas</span>
            <h2 className="section-title">Perguntas frequentes</h2>
          </div>

          <div className="svc-faq-list">
            {FAQS.map((faq, index) => {
              const isActive = openFaq === index;
              return (
                <div className={`svc-faq-item ${isActive ? 'active' : ''}`} key={faq.question}>
                  <button
                    type="button"
                    className="svc-faq-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isActive}
                  >
                    <span>{faq.question}</span>
                    <svg
                      className="svc-faq-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <div className="svc-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEÇÃO 7 — CTA final */}
      <section id="contato" className="cta-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="grafismo grafismo-passaro"></div>
        <div className="container cta-container">
          <h2 className="cta-title">Pronto para colocar o marketing da sua empresa em ordem?</h2>
          <p className="cta-desc">
            Conta pra gente o momento do seu negócio. Se fizer sentido pra ambos os lados, a gente te mostra
            exatamente como seria o trabalho.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button onClick={handleCtaClick('lp-pequenas-empresas-final')} className="btn btn-primary btn-large">
              Agendar conversa com a Kabra
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
