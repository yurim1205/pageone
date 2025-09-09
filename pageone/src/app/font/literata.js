import localFont from 'next/font/local';

export const literata = localFont({
  src: [
    {
      path: '../../../public/fonts/Literata-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Literata-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-literata',
});
