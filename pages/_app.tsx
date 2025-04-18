import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <Component {...pageProps} />
        <Analytics />
      </ThemeProvider>
    </UserProvider>
  );
}
