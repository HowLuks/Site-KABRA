'use strict';
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from './Toast';

type LeadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl?: string;
  origin?: string;
};

export default function LeadModal({ isOpen, onClose, redirectUrl, origin }: LeadModalProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState<string | number | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [classification, setClassification] = useState('');
  const [investment, setInvestment] = useState('');
  const [revenue, setRevenue] = useState('');

  const isBlogGate = !!redirectUrl;

  const handleNextStep = async () => {
    if (!name || !email || !phone) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert([
          {
            email,
            name,
            phone,
            origin: origin || 'popup',
            status: 'new',
            completed_second_step: false,
          },
        ])
        .select();

      if (error) {
        alert('Erro ao salvar etapa 1: ' + error.message);
        console.error(error);
      } else if (data && data.length > 0) {
        if (isBlogGate) {
          handleClose();
          router.push(redirectUrl!);
        } else {
          setLeadId(data[0].id);
          setStep(2);
        }
      }
    } catch (err: any) {
      alert('Erro na etapa 1: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadId) {
      alert('ID do contato não encontrado. Recomece o cadastro.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('submissions')
        .update({
          company,
          role,
          classification,
          investment_plan: investment,
          average_revenue: revenue,
          completed_second_step: true,
        })
        .eq('id', leadId);

      if (error) {
        alert('Erro ao salvar etapa 2: ' + error.message);
        console.error(error);
      } else {
        showToast('Obrigado! Entraremos em contato em breve.');
        handleClose();
      }
    } catch (err: any) {
      alert('Erro na etapa 2: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset Form
    setTimeout(() => {
      setStep(1);
      setLeadId(null);
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setRole('');
      setClassification('');
      setInvestment('');
      setRevenue('');
    }, 400); // Wait for transition fade out
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-content">
        <button className="modal-close" aria-label="Fechar pop-up" onClick={handleClose}>
          &times;
        </button>
        <div className="modal-header">
          <h3 className="modal-title">{isBlogGate ? 'Leia o Artigo Completo' : 'Acelere seu negócio'}</h3>
          <p className="modal-desc">
            {isBlogGate
              ? 'Deixe seus dados para continuar lendo. É rápido!'
              : 'Preencha os dados abaixo e nossa equipe entrará em contato.'}
          </p>
        </div>

        {step === 1 ? (
          <div className="modal-form" id="form-step-1">
            <div className="form-group">
              <label htmlFor="lead-nome">Nome Completo</label>
              <input
                type="text"
                id="lead-nome"
                required
                className="form-input"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lead-email">E-mail Profissional</label>
              <input
                type="email"
                id="lead-email"
                required
                className="form-input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lead-telefone">Telefone / WhatsApp</label>
              <input
                type="tel"
                id="lead-telefone"
                required
                className="form-input"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button
              type="button"
              id="btn-next-step"
              className="btn btn-primary btn-submit modal-btn"
              disabled={loading}
              onClick={handleNextStep}
            >
              {loading ? 'Salvando...' : isBlogGate ? 'Ler Artigo' : 'Continuar'}
            </button>
          </div>
        ) : (
          <form className="modal-form" id="form-step-2" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="lead-empresa">Nome da Empresa</label>
              <input
                type="text"
                id="lead-empresa"
                required
                className="form-input"
                placeholder="Sua empresa"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lead-cargo">Seu Cargo</label>
              <input
                type="text"
                id="lead-cargo"
                required
                className="form-input"
                placeholder="Ex: CEO, Diretor, Analista"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lead-classificacao">Como se identifica no momento?</label>
              <select
                id="lead-classificacao"
                required
                className="form-input"
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
              >
                <option value="" disabled>Selecione uma opção</option>
                <option value="Buscando crescimento acelerado">Buscando crescimento acelerado</option>
                <option value="Desejo reestruturar a marca">Desejo reestruturar a marca</option>
                <option value="Preciso de tráfego e vendas">Preciso de tráfego e vendas</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="lead-investimento">Quanto planeja investir no momento?</label>
              <select
                id="lead-investimento"
                required
                className="form-input"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
              >
                <option value="" disabled>Selecione uma opção</option>
                <option value="Até 5 mil">Até 5 mil</option>
                <option value="Entre 5-10 mil">Entre 5 e 10 mil</option>
                <option value="Entre 10-50 mil">Entre 10 e 50 mil</option>
                <option value="Entre 50-100 mil">Entre 50 e 100 mil</option>
                <option value="+100k">Mais de 100 mil</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="lead-faturamento">Qual o faturamento médio da empresa?</label>
              <select
                id="lead-faturamento"
                required
                className="form-input"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
              >
                <option value="" disabled>Selecione uma opção</option>
                <option value="Até 5 mil">Até 5 mil</option>
                <option value="Entre 5-10 mil">Entre 5 e 10 mil</option>
                <option value="Entre 10-50 mil">Entre 10 e 50 mil</option>
                <option value="Entre 50-100 mil">Entre 50 e 100 mil</option>
                <option value="+100k">Mais de 100 mil</option>
              </select>
            </div>
            <button
              type="submit"
              id="btn-final-step"
              className="btn btn-primary btn-submit modal-btn"
              disabled={loading}
            >
              {loading ? 'Aguarde...' : 'Enviar Solicitação'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
