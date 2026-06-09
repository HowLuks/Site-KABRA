import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from './_components/Toast';
import { ModalProvider } from './_components/ModalContext';
import LayoutWrapper from './LayoutWrapper';

export const metadata: Metadata = {
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
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
