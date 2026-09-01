'use strict';
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useModal } from './ModalContext';

export default function Header() {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const pathname = usePathname();
  const { openModal } = useModal();

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setIsMenuActive(false);

    if (pathname === '/') {
      // If we are on home, intercept and scroll smoothly
      const element = document.querySelector(targetId);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // If we are not on home, let Next.js navigate to '/' with hash
  };

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMenuActive(false);
    openModal();
  };

  return (
    <header className="header">
      <div className="container">
        <Link href="/" className="logo">
          <img
            src="/img/logo.png"
            alt="KABRA Logo"
            width={226}
            height={36}
            style={{ display: 'block', width: '226px', height: '36px', objectFit: 'contain' }}
          />
        </Link>

        <nav className={`nav ${isMenuActive ? 'active' : ''}`}>
          <ul className="nav-list">
            <li>
              <Link href="/marketing-para-pequenas-empresas" onClick={() => setIsMenuActive(false)} className="nav-link">
                Serviços
              </Link>
            </li>
            <li>
              <Link href="/#servicos" onClick={(e) => handleLinkClick(e, '#servicos')} className="nav-link">
                Pilares
              </Link>
            </li>
            <li>
              <Link href="/#manifesto" onClick={(e) => handleLinkClick(e, '#manifesto')} className="nav-link">
                Manifesto
              </Link>
            </li>
            <li>
              <Link href="/blog" className="nav-link">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/#contato" onClick={(e) => handleLinkClick(e, '#contato')} className="nav-link">
                Contato
              </Link>
            </li>
          </ul>
          <a
            href="https://wa.me/558591927755"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary nav-cta"
          >
            Acelerar agora
          </a>
        </nav>

        <button
          className={`mobile-menu-btn ${isMenuActive ? 'active' : ''}`}
          aria-label="Abrir menu"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
