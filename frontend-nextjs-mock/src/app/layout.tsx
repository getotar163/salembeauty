import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata = {
  title: 'SalemBeauty Dashboard',
  description: 'Управление салоном красоты',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} flex h-screen overflow-hidden bg-[#121212] text-white`}>
        {/* Боковая панель (Sidebar) */}
        <aside className="w-64 bg-[#1E1E1E] border-r border-gray-800 flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-[#D4AF37]">SalemBeauty</h1>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <a href="#" className="block px-4 py-3 bg-gray-800/80 rounded-lg text-white font-medium border border-gray-700">Дашборд</a>
            <a href="#" className="block px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">Записи</a>
            <a href="#" className="block px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">Расписание</a>
            <a href="#" className="block px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">Мастера</a>
            <a href="#" className="block px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">Услуги</a>
            <a href="#" className="block px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors flex justify-between items-center">
              Поддержка
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">1</span>
            </a>
          </nav>
          
          {/* Профиль внизу сайдбара */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
                АД
              </div>
              <div>
                <p className="text-sm font-medium">Администратор</p>
                <p className="text-xs text-gray-400">admin@salem.kz</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Основной контент */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Верхняя панель (Header) */}
          <header className="h-16 bg-[#1A1A1A] border-b border-gray-800 flex items-center justify-between px-8">
            <h2 className="text-xl font-semibold">Обзор</h2>
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white p-2">
                🔔 Уведомления
              </button>
              <button className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-medium hover:bg-[#b5952f] transition-colors">
                + Новая запись
              </button>
            </div>
          </header>

          {/* Скроллируемая область контента */}
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
