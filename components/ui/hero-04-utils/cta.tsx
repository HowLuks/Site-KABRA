import * as React from 'react';
import Link from 'next/link';

import { Button, type ButtonProps } from '@/components/ui/button';

export interface CtaProps {
  ctaEnabled?: boolean;
  text: string;
  link?: string;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Cta({ cta }: Readonly<{ cta: CtaProps }>) {
  if (!cta?.ctaEnabled) return null;

  if (cta.onClick) {
    return (
      <Button variant={cta.variant} size={cta.size} onClick={cta.onClick}>
        {cta.text}
      </Button>
    );
  }

  return (
    <Button asChild variant={cta.variant} size={cta.size}>
      <Link href={cta.link || '#'}>{cta.text}</Link>
    </Button>
  );
}
