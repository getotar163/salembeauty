export default function Dashboard() {
  // Временные (mock) данные для визуализации макета
  const stats = [
    { label: 'Записей сегодня', value: '12', trend: '+2', trendUp: true },
    { label: 'Выручка', value: '145 000 ₸', trend: '+15%', trendUp: true },
    { label: 'Новых клиентов', value: '4', trend: '0', trendUp: null },
    { label: 'Активных мастеров', value: '8', trend: '', trendUp: null },
  ];

  const upcomingBookings = [
    { id: 1, client: 'Анна С.', service: 'Стрижка + Окрашивание', master: 'Елена', time: '10:00 - 12:30', status: 'Ожидается' },
    { id: 2, client: 'Мария К.', service: 'Маникюр', master: 'Ольга', time: '11:00 - 12:00', status: 'В процессе' },
    { id: 3, client: 'Айгерим', service: 'Ламинирование ресниц', master: 'Алия', time: '13:00 - 14:00', status: 'Ожидается' },
  ];

  return (
    <div className="space-y-6">
      {/* Карточки статистики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 shadow-sm">
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <div className="flex items-end gap-3 mt-2">
              <h3 className="text-3xl font-semibold">{stat.value}</h3>
              {stat.trend && (
                <span className={`text-sm mb-1 ${stat.trendUp ? 'text-green-400' : 'text-gray-500'}`}>
                  {stat.trend}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Основная сетка: Записи и Уведомления */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Левая колонка: Ближайшие записи */}
        <div className="lg:col-span-2 bg-[#1E1E1E] rounded-xl border border-gray-800 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Ближайшие записи</h3>
            <button className="text-sm text-[#D4AF37] hover:underline">Смотреть все</button>
          </div>
          
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-[#121212] rounded-lg border border-gray-800/50 hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-lg font-bold border border-gray-700">
                    {booking.client.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-100">{booking.client}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{booking.service} <span className="mx-1">•</span> Мастер: {booking.master}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-200">{booking.time}</p>
                  <span className={`inline-block mt-1.5 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider rounded-full ${
                    booking.status === 'В процессе' 
                      ? 'bg-green-900/40 text-green-400 border border-green-800' 
                      : 'bg-gray-800 text-gray-300 border border-gray-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Правая колонка: Резюме и Поддержка */}
        <div className="bg-[#1E1E1E] rounded-xl border border-gray-800 p-6 shadow-sm flex flex-col gap-8">
          
          {/* Секция: Заявки (Резюме) */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Новые резюме</h3>
              <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-xs px-2 py-1 rounded">1 новая</span>
            </div>
            <div className="p-4 bg-[#121212] rounded-lg border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-xs font-bold">ВМ</div>
                <div>
                  <p className="text-sm font-medium">Виктория М.</p>
                  <p className="text-xs text-gray-400">Мастер маникюра</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">Опыт работы 3 года, проходила обучение в школе ParisNail. Ищу работу на полный график...</p>
            </div>
          </div>

          {/* Секция: Поддержка */}
          <div>
            <h3 className="text-lg font-medium mb-4">Открытые тикеты</h3>
            <div className="space-y-3">
              <div className="p-3 bg-[#121212] rounded-lg border border-gray-800 hover:border-gray-700 cursor-pointer">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-red-400">Срочно: Отмена записи</p>
                  <span className="text-[10px] text-gray-500">10 мин назад</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Клиент: Айдана К.</p>
              </div>
              <div className="p-3 bg-[#121212] rounded-lg border border-gray-800 hover:border-gray-700 cursor-pointer">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium">Вопрос по услуге</p>
                  <span className="text-[10px] text-gray-500">2 часа назад</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Клиент: Динара</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
