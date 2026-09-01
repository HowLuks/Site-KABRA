import type { Metadata } from 'next';
import ServicoPequenasEmpresasContent from './ServicoPequenasEmpresasContent';
import { FAQS } from './data';

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export const metadata: Metadata = {
  title: 'Marketing com Escopo Fechado para Pequenas Empresas | KABRA',
  description:
    'A KABRA cuida do tráfego e do conteúdo da sua empresa com um plano de trabalho claro, sem letra miúda e sem depender de você entender de marketing para saber se está funcionando.',
  openGraph: {
    title: 'Marketing com Escopo Fechado para Pequenas Empresas | KABRA',
    description:
      'A KABRA cuida do tráfego e do conteúdo da sua empresa com um plano de trabalho claro, sem letra miúda.',
    type: 'website',
  },
};

export default function ServicoPequenasEmpresasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ServicoPequenasEmpresasContent />
    </>
  );
}
