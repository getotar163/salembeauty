import { useEffect, useState } from 'react'
import { useT } from '../i18n'
import { Icon, formatPrice } from './ui'

type DepositPayment = 'kaspi' | 'freedom' | 'card'

export const DEPOSIT_AMOUNT = 1000

const METHODS: { id: DepositPayment; title: string; hint: string; logo: React.ReactNode }[] = [
  {
    id: 'kaspi',
    title: 'Kaspi QR',
    hint: 'Оплата в приложении Kaspi.kz',
    logo: (
      <span className="flex h-9 w-12 items-center justify-center rounded-lg bg-[#F14635] text-white">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <path d="M14 14h2v2h-2zM18 18h2v2h-2z" />
        </svg>
      </span>
    ),
  },
  {
    id: 'freedom',
    title: 'Freedom Pay',
    hint: 'Карта или рассрочка',
    logo: (
      <span className="flex h-9 w-12 items-center justify-center rounded-lg bg-[#1B9B4A] text-[11px] font-bold text-white">
        FP
      </span>
    ),
  },
  {
    id: 'card',
    title: 'Банковская карта',
    hint: 'Visa, Mastercard',
    logo: (
      <span className="flex h-9 w-12 items-center justify-center rounded-lg border border-border bg-card text-foreground">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="5.5" width="18" height="13" rx="2" />
          <path d="M3 10h18M7 15h3" />
        </svg>
      </span>
    ),
  },
]

/** Bottom-sheet that collects a non-refundable deposit before a booking is confirmed. */
export default function DepositModal({
  serviceName,
  masterName,
  masterPhoto,
  dateLabel,
  time,
  price,
  onClose,
  onPaid,
}: {
  serviceName: string
  masterName: string
  masterPhoto: string
  dateLabel: string
  time: string
  price: number
  onClose: () => void
  onPaid: () => void
}) {
  const { t } = useT()
  const [method, setMethod] = useState<DepositPayment>('kaspi')
  const [paying, setPaying] = useState(false)
  const deposit = Math.min(DEPOSIT_AMOUNT, price)
  const rest = price - deposit

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const pay = () => {
    setPaying(true)
    setTimeout(onPaid, 700)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="deposit-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92dvh] w-full max-w-[430px] flex-col gap-4 overflow-y-auto rounded-t-2xl bg-background p-4 pb-[calc(16px+env(safe-area-inset-bottom))] shadow-[0_-12px_60px_rgba(60,40,20,0.18)] sm:rounded-2xl sm:pb-4"
      >
        <div className="mx-auto h-1 w-10 shrink-0 rounded-full bg-border sm:hidden" />

        <div className="flex items-center justify-between gap-3">
          <h2 id="deposit-title" className="font-serif text-2xl text-foreground">
            {t('Подтверждение записи')}
          </h2>
          <button
            onClick={onClose}
            aria-label={t('Закрыть')}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Booking summary */}
        <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <img src={masterPhoto} alt="" className="h-12 w-12 rounded-xl object-cover" />
            <div className="min-w-0">
              <div className="font-semibold leading-snug text-foreground">{t(serviceName)}</div>
              <div className="truncate text-sm text-muted-foreground">{t(masterName)}</div>
            </div>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="inline-flex flex-1 items-center gap-1.5 rounded-xl bg-secondary px-3 py-2 text-secondary-foreground">
              <Icon name="calendar" className="h-4 w-4 text-primary" /> {dateLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-2 text-secondary-foreground">
              <Icon name="clock" className="h-4 w-4 text-primary" /> {time}
            </span>
          </div>
        </section>

        {/* Price breakdown */}
        <section className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('Полная стоимость')}</span>
            <span className="font-medium text-foreground">{formatPrice(price)}</span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-medium text-foreground">{t('Обязательная предоплата')}</div>
              <div className="text-xs text-muted-foreground">{t('для фиксации времени')}</div>
            </div>
            <span className="font-semibold text-primary">{formatPrice(deposit)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2.5">
            <span className="text-muted-foreground">{t('Остаток на месте')}</span>
            <span className="font-medium text-foreground">{formatPrice(rest)}</span>
          </div>
        </section>

        {/* Warning */}
        <div role="note" className="flex gap-3 rounded-2xl border border-accent/25 bg-accent/10 p-3.5 text-sm text-foreground">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3.5L2.5 20h19L12 3.5z" />
            <path d="M12 10v4.5M12 17.3v.2" />
          </svg>
          <p className="leading-snug">
            {t('Предоплата {n} не возвращается при отмене менее чем за 2 часа до записи.', {
              n: formatPrice(deposit),
            })}
          </p>
        </div>

        {/* Deposit payment */}
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-secondary-foreground">{t('Способ оплаты предоплаты')}</h3>
          <div role="radiogroup" className="flex flex-col gap-2">
            {METHODS.map((m) => {
              const on = method === m.id
              return (
                <button
                  key={m.id}
                  role="radio"
                  aria-checked={on}
                  onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-3 rounded-2xl border bg-card p-3 text-left transition ${
                    on ? 'border-primary ring-2 ring-primary/15' : 'border-border hover:border-primary/40'
                  }`}
                >
                  {m.logo}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground">{t(m.title)}</div>
                    <div className="text-xs text-muted-foreground">{t(m.hint)}</div>
                  </div>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${on ? 'border-primary' : 'border-border'}`}>
                    {on && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <button
          onClick={pay}
          disabled={paying}
          className="w-full rounded-2xl bg-primary px-4 py-3.5 font-medium leading-snug text-primary-foreground transition active:scale-[0.98] disabled:opacity-60"
        >
          {paying
            ? t('Обработка платежа…')
            : t('Внести предоплату {n} и подтвердить запись', { n: formatPrice(deposit) })}
        </button>
      </div>
    </div>
  )
}
