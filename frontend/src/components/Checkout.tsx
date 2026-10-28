import { useState } from 'react'
import { useBonus } from '../bonus'
import { useT } from '../i18n'
import { Icon, formatPrice } from './ui'

export type CheckoutItem = { id: string; name: string; brand: string; image: string; price: number; qty: number }

type Delivery = 'courier' | 'express' | 'pickup'
type Payment = 'kaspi' | 'freedom' | 'card' | 'wallet'

const DELIVERY: { id: Delivery; title: string; hint: string; fee: number }[] = [
  { id: 'courier', title: 'Курьерская доставка', hint: 'Завтра, 10:00 – 18:00', fee: 1000 },
  { id: 'express', title: 'Экспресс-доставка (Яндекс/inDrive)', hint: 'За 1–2 часа', fee: 2500 },
  { id: 'pickup', title: 'Самовывоз', hint: 'пр. Абая, 52 · сегодня после 14:00', fee: 0 },
]

const PAYMENT: { id: Payment; title: string; hint: string }[] = [
  { id: 'kaspi', title: 'Kaspi QR', hint: 'Оплата в приложении Kaspi.kz' },
  { id: 'freedom', title: 'Freedom Pay', hint: 'Карта или рассрочка' },
  { id: 'card', title: 'Банковская карта', hint: 'Visa, Mastercard' },
  { id: 'wallet', title: 'Apple Pay / Google Pay', hint: 'В одно касание' },
]

function PaymentLogo({ id }: { id: Payment }) {
  const base = 'flex h-10 w-14 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold'
  if (id === 'kaspi')
    return (
      <span className={`${base} bg-[#F14635] text-white`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" />
        </svg>
      </span>
    )
  if (id === 'freedom') return <span className={`${base} bg-[#1B9B4A] text-white`}>FP</span>
  if (id === 'card')
    return (
      <span className={`${base} border border-border bg-card text-foreground`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="5.5" width="18" height="13" rx="2" />
          <path d="M3 10h18M7 15h3" />
        </svg>
      </span>
    )
  return (
    <span className={`${base} gap-0.5 bg-foreground text-background`}>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8C7 7.3 5.6 8.2 4.8 9.6c-1.7 2.9-.4 7.2 1.2 9.5.8 1.1 1.7 2.4 2.9 2.4 1.2-.1 1.6-.8 3-.8s1.8.8 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.6-1-2.6-3.9zM14.1 5.5c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3z" />
      </svg>
      Pay
    </span>
  )
}

function Radio({ on }: { on: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
        on ? 'border-primary' : 'border-border'
      }`}
    >
      {on && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
    </span>
  )
}

export default function Checkout({
  items,
  onClose,
  onPaid,
}: {
  items: CheckoutItem[]
  onClose: () => void
  onPaid: () => void
}) {
  const { t, lang } = useT()
  const { balance, spend } = useBonus()
  const [delivery, setDelivery] = useState<Delivery>('courier')
  const [payment, setPayment] = useState<Payment>('kaspi')
  const [useBonuses, setUseBonuses] = useState(false)
  const [bonusInput, setBonusInput] = useState('')
  const [done, setDone] = useState(false)

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const fee = DELIVERY.find((d) => d.id === delivery)!.fee
  const maxBonus = Math.min(balance, subtotal + fee)
  const applied = useBonuses ? Math.min(Number(bonusInput.replace(/\D/g, '')) || 0, maxBonus) : 0
  const total = subtotal + fee - applied
  const num = (n: number) => n.toLocaleString(lang === 'EN' ? 'en-US' : 'ru-RU')

  const pay = () => {
    spend(applied, 'Оплата заказа бонусами')
    setDone(true)
  }

  return (
    <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-[430px] flex-col bg-background">
      <div className="h-[env(safe-area-inset-top)] bg-background" />
      <div className="flex items-center gap-3 px-4 pb-3 pt-3">
        {!done && (
          <button
            onClick={onClose}
            aria-label={t('Назад')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground active:scale-95"
          >
            <Icon name="arrow-left" className="h-5 w-5" />
          </button>
        )}
        <div className="flex-1">
          <div className="font-serif text-lg text-foreground">
            {done ? t('Заказ оплачен') : t('Оформление заказа')}
          </div>
          {!done && (
            <div className="text-xs text-muted-foreground">
              {t('{n} товаров', { n: items.reduce((s, i) => s + i.qty, 0) })}
            </div>
          )}
        </div>
      </div>

      {done ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-foreground">{t('Спасибо за заказ!')}</h2>
          <p className="max-w-[18rem] text-sm text-muted-foreground">
            {t(DELIVERY.find((d) => d.id === delivery)!.title)} · {formatPrice(total)}
            {applied > 0 && <> · {t('списано {n} бонусов', { n: num(applied) })}</>}
          </p>
          <button
            onClick={onPaid}
            className="mt-2 w-full rounded-2xl bg-primary py-3.5 font-medium text-primary-foreground transition active:scale-[0.98]"
          >
            {t('Готово')}
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-6 pt-2">
            {/* Items */}
            <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
              {items.map((i) => (
                <div key={i.id} className="flex items-center gap-3">
                  <img src={i.image} alt="" className="h-12 w-12 rounded-xl bg-muted object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{t(i.name)}</div>
                    <div className="text-xs text-muted-foreground">
                      {i.brand} · ×{i.qty}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{formatPrice(i.price * i.qty)}</span>
                </div>
              ))}
            </section>

            {/* Delivery */}
            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-xl text-foreground">{t('Способ доставки')}</h2>
              <div role="radiogroup" className="flex flex-col gap-2">
                {DELIVERY.map((d) => {
                  const on = delivery === d.id
                  return (
                    <button
                      key={d.id}
                      role="radio"
                      aria-checked={on}
                      onClick={() => setDelivery(d.id)}
                      className={`flex items-center gap-3 rounded-2xl border bg-card p-4 text-left transition ${
                        on ? 'border-primary ring-2 ring-primary/15' : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <Radio on={on} />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-foreground">{t(d.title)}</div>
                        <div className="text-sm text-muted-foreground">{t(d.hint)}</div>
                      </div>
                      <span className={`text-sm font-semibold ${d.fee === 0 ? 'text-primary' : 'text-foreground'}`}>
                        {d.fee === 0 ? t('Бесплатно') : formatPrice(d.fee)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Payment */}
            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-xl text-foreground">{t('Способ оплаты')}</h2>
              <div role="radiogroup" className="grid grid-cols-1 gap-2">
                {PAYMENT.map((p) => {
                  const on = payment === p.id
                  return (
                    <button
                      key={p.id}
                      role="radio"
                      aria-checked={on}
                      onClick={() => setPayment(p.id)}
                      className={`flex items-center gap-3 rounded-2xl border bg-card p-3 text-left transition ${
                        on ? 'border-primary ring-2 ring-primary/15' : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <PaymentLogo id={p.id} />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-foreground">{t(p.title)}</div>
                        <div className="text-sm text-muted-foreground">{t(p.hint)}</div>
                      </div>
                      <Radio on={on} />
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Bonuses */}
            <section className="flex flex-col gap-3 rounded-2xl bg-accent/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👑</span>
                  <div>
                    <div className="font-medium text-foreground">{t('Оплатить бонусами')}</div>
                    <div className="text-sm text-muted-foreground">
                      {t('Доступно: {n} бонусов', { n: num(balance) })}{' '}
                      <span className="whitespace-nowrap">{t('(1 бонус = 1 ₸)')}</span>
                    </div>
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={useBonuses}
                  aria-label={t('Оплатить бонусами')}
                  onClick={() => {
                    setUseBonuses((v) => !v)
                    if (!useBonuses && !bonusInput) setBonusInput(String(maxBonus))
                  }}
                  className={`relative h-[31px] w-[51px] shrink-0 rounded-full transition ${
                    useBonuses ? 'bg-primary' : 'bg-border'
                  }`}
                >
                  <span
                    className={`absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow transition-all ${
                      useBonuses ? 'left-[22px]' : 'left-[2px]'
                    }`}
                  />
                </button>
              </div>
              {useBonuses && (
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center rounded-xl border border-border bg-card transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                    <input
                      inputMode="numeric"
                      value={bonusInput}
                      onChange={(e) => setBonusInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="0"
                      className="w-full bg-transparent px-4 py-3 text-foreground outline-none"
                    />
                    <span className="pr-4 text-sm text-muted-foreground">{t('бонусов')}</span>
                  </div>
                  <button
                    onClick={() => setBonusInput(String(maxBonus))}
                    className="rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition active:scale-95"
                  >
                    {t('Макс.')}
                  </button>
                </div>
              )}
            </section>

            {/* Summary */}
            <section className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-4 text-sm">
              <h2 className="font-serif text-xl text-foreground">{t('Ваш заказ')}</h2>
              <Row label={t('Товары')} value={formatPrice(subtotal)} />
              <Row label={t('Доставка')} value={fee === 0 ? t('Бесплатно') : formatPrice(fee)} />
              {applied > 0 && <Row label={t('Оплачено бонусами')} value={`−${formatPrice(applied)}`} accent />}
              <div className="mt-1 flex items-baseline justify-between border-t border-border pt-3">
                <span className="font-medium text-foreground">{t('Итого')}</span>
                <span className="font-serif text-2xl text-foreground">{formatPrice(total)}</span>
              </div>
            </section>
          </div>

          <div className="border-t border-border bg-card/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
            <button
              onClick={pay}
              disabled={items.length === 0}
              className="w-full rounded-2xl bg-primary py-3.5 font-medium text-primary-foreground transition active:scale-[0.98] disabled:opacity-40"
            >
              {t('Подтвердить и оплатить')} · {formatPrice(total)}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${accent ? 'text-primary' : 'text-foreground'}`}>{value}</span>
    </div>
  )
}
