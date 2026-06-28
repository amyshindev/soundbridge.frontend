import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/common/ToastProvider';
import { PlayerProvider } from '@/context/PlayerContext';
import { LocaleProvider } from '@/context/LocaleContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PlayerBar } from '@/components/layout/PlayerBar';
import { BottomTabBar } from '@/components/layout/BottomTabBar';

export const metadata: Metadata = {
  title: 'SoundBridge (사운드브릿지) — 내 플리에 국악 한 스푼.',
  description: '좋아하는 음악의 감성으로 어울리는 국악을 찾고, 샘플 라이브러리로 나만의 사운드를 만들어 보세요.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col text-slate-900 antialiased font-sans">
        <div className="sb-page-bg" aria-hidden="true" />
        <ToastProvider>
          <LocaleProvider>
            <PlayerProvider>
            <Navbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-28">
              {children}
            </main>

            <Footer />

            <PlayerBar />

            <BottomTabBar />
            </PlayerProvider>
          </LocaleProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

