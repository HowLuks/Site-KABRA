'use strict';
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname === '/') {
      const element = document.querySelector(targetId);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo">
            <img
              src="/img/Footer logo.png"
              alt="KABRA Logo Footer"
              style={{ display: 'block', width: '100%', maxWidth: '250px', height: 'auto', objectFit: 'contain' }}
            />
          </div>
          <p className="footer-tagline">
            Energia para transformar.
            <br />
            Análise para escalar.
          </p>
        </div>

        <div className="footer-links">
          <h4>Agência</h4>
          <ul>
            <li>
              <Link href="/marketing-para-pequenas-empresas">
                Serviços
              </Link>
            </li>
            <li>
              <Link href="/#servicos" onClick={(e) => handleLinkClick(e, '#servicos')}>
                Pilares
              </Link>
            </li>
            <li>
              <Link href="/#manifesto" onClick={(e) => handleLinkClick(e, '#manifesto')}>
                Manifesto
              </Link>
            </li>
            <li>
              <Link href="/blog">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/#contato" onClick={(e) => handleLinkClick(e, '#contato')}>
                Fale Conosco
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Conecte-se</h4>
          <div className="social-icons">
            <a href="https://www.instagram.com/kabramkt" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} KABRA MKT. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
