import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Growlog.ai',
  description: 'Журнал гровера с нейронкой',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='w-[390px] h-[844px] mx-auto border rounded-md shadow bg-white flex flex-col justify-between p-4'>
          <div className='flex-1 overflow-auto'>{children}</div>
          <nav className='border-t mt-4 pt-2 flex justify-around text-xs text-muted-foreground'>
            <a href='/'>📊 Данные</a>
            <a href='/advice'>🧠 Советы</a>
            <a href='/gallery'>📷 Фото</a>
            <a href='/settings'>⚙️ Настройки</a>
          </nav>
        </div>
      </body>
    </html>
  );
}
