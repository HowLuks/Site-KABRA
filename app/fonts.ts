import localFont from 'next/font/local';

export const boxing = localFont({
  src: [
    { path: '../public/fonts/Boxing-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Boxing-Regular.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-heading',
  display: 'swap',
  fallback: ['Teko', 'Impact', 'sans-serif'],
});

export const montaguSlab = localFont({
  src: '../public/fonts/MontaguSlab-VariableFont.ttf',
  weight: '100 900',
  style: 'normal',
  variable: '--font-body',
  display: 'swap',
  fallback: ['serif'],
});
