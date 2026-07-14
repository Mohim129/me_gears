import type { Metadata } from 'next';
import { Montserrat, Inter, Anybody } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['600', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const anybody = Anybody({
  subsets: ['latin'],
  variable: '--font-anybody',
  weight: ['800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ME GEARS | Modern Edgy Confidence',
  description: 'Crafting industrial-chic apparel for those who lead with confidence and edge. Precision engineering meets high fashion.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${montserrat.variable} ${inter.variable} ${anybody.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body-md bg-surface text-on-surface overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
