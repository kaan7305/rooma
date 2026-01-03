import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/MobileNav';
import { WebSocketProvider } from '@/lib/websocket-context';
import { ToastProvider } from '@/lib/toast-context';
import { ThemeProvider } from '@/lib/theme-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NestQuarter - Global Student Housing Platform',
  description:
    'Find your perfect student home. Sublet, rent, and connect with verified housing worldwide.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  console.log('[Blocking Script] Saved theme:', savedTheme);

                  // Clean up invalid theme values
                  if (savedTheme !== 'light' && savedTheme !== 'dark') {
                    console.log('[Blocking Script] Invalid theme, resetting to light');
                    localStorage.setItem('theme', 'light');
                  }

                  const theme = localStorage.getItem('theme') || 'light';
                  console.log('[Blocking Script] Using theme:', theme);

                  // Remove both classes first
                  document.documentElement.classList.remove('light', 'dark');
                  // Add the correct theme
                  document.documentElement.classList.add(theme);

                  console.log('[Blocking Script] Applied classes:', document.documentElement.className);
                } catch (e) {
                  console.error('[Blocking Script] Error:', e);
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`} suppressHydrationWarning>
        <ThemeProvider>
          <WebSocketProvider>
            <ToastProvider>
              <Navbar />
              {children}
              <MobileNav />
            </ToastProvider>
          </WebSocketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
