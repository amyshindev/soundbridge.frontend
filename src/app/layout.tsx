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
      <body className="min-h-full flex flex-col bg-sb-bg text-sb-primary antialiased font-sans">
        <ToastProvider>
          <LocaleProvider>
            <PlayerProvider>
            {/* GNB */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 pb-[72px] md:pb-[56px]">
              {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Floating Audio Player */}
            <PlayerBar />

            {/* Mobile Bottom Tabbar */}
            <BottomTabBar />
            </PlayerProvider>
          </LocaleProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

