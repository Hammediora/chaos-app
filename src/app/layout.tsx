import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/layout/Navigation';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ChaosHub — Retro Chaos Playground',
  description: 'Generate jokes, excuses, roasts, memes, and facts. A retro meme culture meets old money chaos playground.',
  keywords: ['memes', 'jokes', 'excuses', 'facts', 'chaos', 'generator'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1410',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Navigation />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
