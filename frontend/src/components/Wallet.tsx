import type { BonusEntry, Booking } from '../data'
import { useT } from '../i18n'
import { Icon, VenueBadge, formatPrice } from './ui'

export function Wallet({
  balance,
  history,
}: {
  balance: number
  history: BonusEntry[]
}) {
  const { t, lang } = useT()
  const loc = lang === 'KZ' ? 'kk-KZ' : lang === 'EN' ? 'en-US' : 'ru-RU'
  return (
    <div className="px-5 pb-6 pt-6">
      <h2 className="mb-5 font-serif text-2xl text-foreground">{t('Бонусы и кошелёк')}</h2>

      {/* Balance card */}
      <div className="relative overflow-hidden rounded-3xl bg-accent p-6 text-accent-foreground">
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute right-5 top-5 text-3xl">👑</div>
        <div className="text-sm text-accent-foreground/70">{t('Мой баланс')}</div>
        <div className="mt-1 flex items-end gap-2">
          <span className="font-serif text-5xl leading-none">
            {balance.toLocaleString(loc)}
          </span>
          <span className="pb-1 text-accent-foreground/80">{t('бонусов')}</span>
        </div>
        <p className="mt-3 max-w-[15rem] text-sm text-accent-foreground/70">
          {t('Оплачивайте бонусами до 30% стоимости услуги')}
        </p>
      </div>

      <h3 className="mb-3 mt-7 font-serif text-lg text-foreground">{t('История операций')}</h3>
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {history.map((e) => (
          <div key={e.id} className="flex items-center justify-between px-4 py-3.5">
            <span className="text-foreground">{e.label.startsWith('За запись · ') ? `${t('За запись')} · ${e.label.slice(12)}` : t(e.label)}</span>
            <span
              className={`font-semibold ${e.amount >= 0 ? 'text-accent' : 'text-primary'}`}
            >
              {e.amount >= 0 ? '+' : ''}
              {e.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BookingsScreen({ bookings }: { bookings: Booking[] }) {
  const { t, lang } = useT()
  return (
    <div className="px-5 pb-6 pt-6">
      <h2 className="mb-5 font-serif text-2xl text-foreground">{t('Мои записи')}</h2>
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <Icon name="calendar" className="h-7 w-7" />
          </div>
          <p className="max-w-[16rem] text-sm text-muted-foreground">
            {t('У вас пока нет записей. Выберите мастера и запишитесь на удобное время.')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <img src={b.photo} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-foreground">{t(b.masterName)}</span>
                    <VenueBadge type={b.venueType} />
                  </div>
                  <span className="text-sm text-muted-foreground">{t(b.serviceName)}</span>
                </div>
                <span className="font-semibold text-foreground">{formatPrice(b.price)}</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3 text-sm text-secondary-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="calendar" className="h-4 w-4 text-primary" /> {b.dateISO
                    ? new Date(b.dateISO + 'T12:00').toLocaleDateString(
                        lang === 'KZ' ? 'kk-KZ' : lang === 'EN' ? 'en-US' : 'ru-RU',
                        { day: 'numeric', month: 'long', weekday: 'short' },
                      )
                    : t(b.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="clock" className="h-4 w-4 text-primary" /> {b.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
