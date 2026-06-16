'use strict';
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import LeadModal from './LeadModal';

export type ModalOptions = {
  redirectUrl?: string;
  origin?: string;
};

type ModalContextType = {
  openModal: (options?: ModalOptions) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<ModalOptions>({});

  const openModal = (options: ModalOptions = {}) => {
    setModalOptions(options);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setModalOptions({});
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <LeadModal isOpen={isOpen} onClose={closeModal} {...modalOptions} />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
