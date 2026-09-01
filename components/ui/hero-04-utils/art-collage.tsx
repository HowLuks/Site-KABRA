import * as React from 'react';

export interface ArtCollageProps {
  primaryImage: string;
  secondaryImage: string;
  primaryAlt?: string;
  secondaryAlt?: string;
}

export function ArtCollage({
  primaryImage,
  secondaryImage,
  primaryAlt = '',
  secondaryAlt = '',
}: Readonly<ArtCollageProps>) {
  return (
    <div className="relative mx-auto aspect-4/5 w-full max-w-md sm:max-w-lg">
      <div className="border-border bg-muted absolute inset-0 right-6 bottom-6 overflow-hidden rounded-2xl border shadow-xl sm:right-10 sm:bottom-10">
        <img
          src={primaryImage}
          alt={primaryAlt}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute right-0 bottom-0 w-2/5 drop-shadow-[0_25px_25px_rgba(0,0,0,0.3)]">
        <img
          src={secondaryImage}
          alt={secondaryAlt}
          className="h-auto w-full object-contain"
        />
      </div>
    </div>
  );
}
