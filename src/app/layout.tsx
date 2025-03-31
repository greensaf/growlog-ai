import './globals.css';
import { Inter } from 'next/font/google';
import ThemeToggle from '@/components/ThemeToggle';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Growlog.ai',
  description: 'Журнал гровера с нейронкой',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100`}
      >
        <div className='w-[390px] h-[844px] mx-auto border rounded-md shadow flex flex-col justify-between p-4 transition-colors'>
          <div className='flex-1 overflow-auto'>{children}</div>
          <nav className='border-t mt-4 pt-2 flex justify-around text-xs text-muted-foreground'>
            <a href='/'>📊 Данные</a>
            <a href='/advice'>🧠 Советы</a>
            <a href='/gallery'>📷 Фото</a>
            <a href='/settings'>⚙️ Настройки</a>
            <ThemeToggle />
          </nav>
        </div>
      </body>
    </html>
  );
}
