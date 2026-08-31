'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Props = {
  materialUrl: string;
  materialTitle?: string | null;
  postSlug: string;
};

export default function MaterialDownloadSection({ materialUrl, materialTitle, postSlug }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('submissions').insert([{
        email,
        name,
        phone,
        origin: `material-${postSlug}`,
        status: 'new',
        completed_second_step: false,
      }]);

      if (error) {
        alert('Erro ao enviar. Tente novamente.');
        console.error(error);
        return;
      }

      setUnlocked(true);
    } catch (err: any) {
      alert('Erro inesperado: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="material-download-section">
      <div className="material-download-inner">
        <div className="material-download-badge">Material Gratuito</div>
        <h3 className="material-download-title">
          {materialTitle || 'Baixe o material complementar'}
        </h3>
        <p className="material-download-desc">
          Preencha seus dados abaixo para liberar o acesso gratuito.
        </p>

        {unlocked ? (
          <div className="material-download-success">
            <p className="material-success-msg">Acesso liberado! Clique para baixar:</p>
            <a
              href={materialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary material-download-btn"
            >
              Baixar Material
            </a>
          </div>
        ) : (
          <form className="material-download-form" onSubmit={handleSubmit}>
            <div className="material-form-row">
              <input
                type="text"
                className="form-input"
                placeholder="Seu nome completo"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                className="form-input"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="tel"
                className="form-input"
                placeholder="(11) 99999-9999"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary material-download-btn"
                disabled={loading}
              >
                {loading ? 'Aguarde...' : 'Baixar Agora'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
