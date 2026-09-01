import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from './_components/Toast';
import { ModalProvider } from './_components/ModalContext';
import LayoutWrapper from './LayoutWrapper';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'KABRA | Agência de Estratégia e Aceleração de Negócios',
  description:
    'A KABRA é uma agência de estratégia energética que une criatividade disruptiva e execução analítica para aceleração de negócios através do storytelling estratégico.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'KABRA | Agência de Estratégia e Aceleração de Negócios',
    description:
      'Unimos criatividade e execução analítica para transformar marcas e acelerar negócios.',
    type: 'website',
    url: SITE_URL,
    // TODO: substituir por uma imagem OG dedicada (1200x630) — usando o logo como placeholder.
    images: [{ url: '/img/logo.png', width: 1710, height: 272, alt: 'KABRA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KABRA | Agência de Estratégia e Aceleração de Negócios',
    description:
      'Unimos criatividade e execução analítica para transformar marcas e acelerar negócios.',
    images: ['/img/logo.png'],
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'KABRA',
  url: SITE_URL,
  logo: `${SITE_URL}/img/logo.png`,
  description:
    'Agência de estratégia energética que une criatividade disruptiva e execução analítica para aceleração de negócios.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Fortaleza',
    addressRegion: 'CE',
    addressCountry: 'BR',
  },
  sameAs: ['https://www.instagram.com/kabramkt'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <ToastProvider>
          <ModalProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ModalProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
