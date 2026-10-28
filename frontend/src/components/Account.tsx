import { useEffect, useRef, useState } from 'react'
import { masters, products } from '../data'
import { useT } from '../i18n'
import { Icon, Stars, formatPrice } from './ui'
import type { BusinessInfo, JobSeeker } from './AuthModal'

/* ---------- shared bits ---------- */

function TopBar({ title, onBack, right }: { title: React.ReactNode; onBack: () => void; right?: React.ReactNode }) {
  const { t } = useT()
  return (
    <div className="flex items-center gap-3 pb-4">
      <button
        onClick={onBack}
        aria-label={t('Назад')}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground active:scale-95"
      >
        <Icon name="arrow-left" className="h-5 w-5" />
      </button>
      <h2 className="min-w-0 flex-1 font-serif text-2xl leading-tight text-foreground">{title}</h2>
      {right}
    </div>
  )
}

function Pencil({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" />
    </svg>
  )
}

function Heart({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M12 20s-7-4.4-9.2-8.6C1.3 8.4 3 5 6.4 5c2 0 3.3 1.1 3.9 2.1h3.4C14.3 6.1 15.6 5 17.6 5 21 5 22.7 8.4 21.2 11.4 19 15.6 12 20 12 20z" />
    </svg>
  )
}

export function WhatsAppIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 001.8-1.2 2.2 2.2 0 00.1-1.2c0-.1-.2-.2-.5-.3z" />
    </svg>
  )
}

/* ---------- Profile ---------- */

export type User = { name: string; photo: string | null; phone: string }

export function ProfileScreen({
  user,
  balance,
  onUpdate,
  onOpen,
  onLogout,
  seeker,
  onOpenJobs,
}: {
  user: User
  balance: number
  onUpdate: (u: User) => void
  onOpen: (screen: 'favorites' | 'history' | 'payments' | 'support' | 'wallet') => void
  onLogout: () => void
  seeker?: JobSeeker
  onOpenJobs?: () => void
}) {
  const { t, lang } = useT()
  const fileRef = useRef<HTMLInputElement>(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(user.name)

  const saveName = () => {
    const name = draft.trim()
    if (name) onUpdate({ ...user, name })
    else setDraft(user.name)
    setEditing(false)
  }

  const onPhoto = (f: File | undefined) => {
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => onUpdate({ ...user, photo: String(reader.result) })
    reader.readAsDataURL(f)
  }

  const rows: { id: 'favorites' | 'history' | 'payments' | 'support'; icon: 'heart' | 'calendar' | 'wallet' | 'chat'; label: string }[] = [
    { id: 'favorites', icon: 'heart', label: 'Избранное' },
    { id: 'history', icon: 'calendar', label: 'История записей' },
    { id: 'payments', icon: 'wallet', label: 'Способы оплаты' },
    { id: 'support', icon: 'chat', label: 'Поддержка' },
  ]

  return (
    <div className="flex flex-col gap-5 px-5 pb-8 pt-6">
      {/* Profile card */}
      <section className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <button
          onClick={() => fileRef.current?.click()}
          aria-label={t('Изменить фото')}
          className="relative shrink-0 rounded-full active:scale-95"
        >
          {user.photo ? (
            <img src={user.photo} alt="" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary font-serif text-3xl text-primary">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
              <circle cx="12" cy="13" r="3.2" />
            </svg>
          </span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPhoto(e.target.files?.[0])} />

        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={saveName}
                onKeyDown={(e) => e.key === 'Enter' && saveName()}
                className="w-full min-w-0 rounded-xl border border-primary bg-background px-3 py-1.5 font-serif text-xl text-foreground outline-none ring-2 ring-primary/20"
              />
            </div>
          ) : (
            <button
              onClick={() => {
                setDraft(user.name)
                setEditing(true)
              }}
              className="group flex items-center gap-2 text-left"
            >
              <span className="break-words font-serif text-2xl leading-tight text-foreground">{user.name}</span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground group-hover:text-primary">
                <Pencil className="h-3.5 w-3.5" />
              </span>
            </button>
          )}
          <p className="mt-1 text-sm text-muted-foreground">{user.phone}</p>
          <p className="text-sm text-muted-foreground">{t('Алматы')}</p>
        </div>
      </section>

      {/* Loyalty card */}
      <button
        onClick={() => onOpen('wallet')}
        className="flex w-full items-center justify-between gap-4 rounded-2xl bg-accent p-5 text-left text-accent-foreground shadow-sm transition active:scale-[0.99]"
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm text-accent-foreground/75">{t('Бонусный баланс')}</span>
          <span className="font-serif text-3xl leading-none">
            {balance.toLocaleString(lang === 'EN' ? 'en-US' : 'ru-RU')}
          </span>
          <span className="text-xs text-accent-foreground/70">{t('1 бонус = 1 ₸')}</span>
        </div>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-foreground/12 text-3xl">👑</span>
      </button>

      {seeker && (
        <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-serif text-xl text-foreground">{t('Профиль соискателя')}</h3>
            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">{t('Резюме открыто')}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">{t(seeker.specialty)}</span>
            <span className="rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">{t(seeker.experience)}</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground">{seeker.about}</p>
          <div className="flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-2 text-sm text-foreground">
            <span aria-hidden="true">📄</span>
            <span className="break-all">{seeker.resumeName}</span>
          </div>
          {onOpenJobs && (
            <button onClick={onOpenJobs} className="w-full rounded-2xl bg-primary py-3 font-medium text-primary-foreground transition active:scale-[0.98]">
              {t('Смотреть вакансии')}
            </button>
          )}
        </section>
      )}

      {/* Menu */}
      <nav className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {rows.map((r) => (
          <button
            key={r.id}
            onClick={() => onOpen(r.id)}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:bg-secondary/60"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon name={r.icon} className="h-5 w-5" />
            </span>
            <span className="flex-1 font-medium text-foreground">{t(r.label)}</span>
            <Icon name="chevron" className="h-5 w-5 shrink-0 text-muted-foreground" />
          </button>
        ))}
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left font-medium text-[#C2362B] transition active:bg-secondary/60"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C2362B]/10">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" />
            </svg>
          </span>
          {t('Выйти')}
        </button>
      </nav>
    </div>
  )
}

/* ---------- Business cabinet ---------- */

export function BusinessCabinet({
  info,
  phone,
  onOpenPage,
  onOpenSupport,
  onLogout,
}: {
  info: BusinessInfo
  phone: string
  onOpenPage: () => void
  onOpenSupport: () => void
  onLogout: () => void
}) {
  const { t } = useT()
  const stats: [string, string][] = [
    ['0', 'Записей сегодня'],
    ['0', 'Заказов'],
    ['—', 'Рейтинг'],
  ]
  return (
    <div className="flex flex-col gap-5 px-5 pb-8 pt-6">
      <section className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary font-serif text-3xl text-primary-foreground">
          {info.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">{t('Кабинет бизнеса')}</span>
          <h2 className="break-words font-serif text-2xl leading-tight text-foreground">{info.name}</h2>
          <p className="text-sm text-muted-foreground">{t(info.category)}</p>
          <p className="text-sm text-muted-foreground">{phone} · {info.email}</p>
        </div>
      </section>

      <button
        onClick={onOpenPage}
        className="flex w-full items-center gap-4 rounded-2xl bg-accent p-5 text-left text-accent-foreground shadow-sm transition active:scale-[0.99]"
      >
        <div className="flex-1">
          <div className="font-serif text-xl">{t('Страница бизнеса')}</div>
          <div className="text-sm text-accent-foreground/75">{t('Так клиенты видят ваши услуги, магазин и вакансии')}</div>
        </div>
        <Icon name="chevron" className="h-6 w-6 shrink-0" />
      </button>

      <div className="grid grid-cols-3 gap-2">
        {stats.map(([v, l]) => (
          <div key={l} className="rounded-2xl border border-border bg-card p-3 text-center">
            <div className="font-serif text-2xl text-foreground">{v}</div>
            <div className="text-xs leading-tight text-muted-foreground">{t(l)}</div>
          </div>
        ))}
      </div>

      {info.tags.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-4">
          <h3 className="mb-2 text-sm font-medium text-secondary-foreground">{t('Услуги')}</h3>
          <div className="flex flex-wrap gap-2">
            {info.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{t(tag)}</span>
            ))}
          </div>
        </section>
      )}

      <nav className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        <button onClick={onOpenSupport} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:bg-secondary/60">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon name="chat" className="h-5 w-5" />
          </span>
          <span className="flex-1 font-medium text-foreground">{t('Поддержка')}</span>
          <Icon name="chevron" className="h-5 w-5 shrink-0 text-muted-foreground" />
        </button>
        <button onClick={onLogout} className="flex w-full items-center gap-3 px-4 py-3.5 text-left font-medium text-[#C2362B] transition active:bg-secondary/60">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C2362B]/10">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" />
            </svg>
          </span>
          {t('Выйти')}
        </button>
      </nav>
    </div>
  )
}

/* ---------- Favorites ---------- */

export function FavoritesScreen({ onBack, onBook }: { onBack: () => void; onBook: () => void }) {
  const { t } = useT()
  const [tab, setTab] = useState<'masters' | 'goods'>('masters')
  const [favMasters, setFavMasters] = useState(() => new Set(masters.slice(0, 3).map((m) => m.id)))
  const [favGoods, setFavGoods] = useState(() => new Set(products.slice(0, 3).map((p) => p.id)))
  const [inCart, setInCart] = useState<Set<string>>(new Set())
  const toggle = (set: Set<string>, id: string) => {
    const next = new Set(set)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  }

  const ms = masters.filter((m) => favMasters.has(m.id))
  const gs = products.filter((p) => favGoods.has(p.id))

  return (
    <div className="px-5 pb-8 pt-6">
      <TopBar
        title={t('Избранное')}
        onBack={onBack}
        right={
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-sm font-semibold text-primary-foreground">
            {favMasters.size + favGoods.size}
          </span>
        }
      />

      <div role="tablist" className="flex w-full rounded-[14px] bg-secondary p-1">
        {(
          [
            ['masters', 'Мастера и барбершопы'],
            ['goods', 'Косметика и товары'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex-1 rounded-[11px] px-2 py-2 text-sm font-medium leading-tight transition ${
              tab === id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground active:opacity-70'
            }`}
          >
            {t(label)}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {tab === 'masters' &&
          (ms.length === 0 ? (
            <Empty />
          ) : (
            ms.map((m) => (
              <article key={m.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <img src={m.photo} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold leading-snug text-foreground">{t(m.name)}</h3>
                    <p className="text-sm text-muted-foreground">{t(m.specialty)}</p>
                    <div className="mt-1">
                      <Stars rating={m.rating} reviews={m.reviews} />
                    </div>
                  </div>
                  <button
                    onClick={() => setFavMasters((s) => toggle(s, m.id))}
                    aria-label={t('Убрать из избранного')}
                    className="text-primary active:scale-90"
                  >
                    <Heart filled />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                  <span className="text-sm text-muted-foreground">
                    {t('от')} <span className="font-semibold text-foreground">{formatPrice(m.priceFrom)}</span>
                  </span>
                  <button onClick={onBook} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground active:scale-95">
                    {t('Записаться')}
                  </button>
                </div>
              </article>
            ))
          ))}

        {tab === 'goods' &&
          (gs.length === 0 ? (
            <Empty />
          ) : (
            gs.map((p) => (
              <article key={p.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <img src={p.image} alt="" className="h-16 w-16 shrink-0 rounded-xl bg-muted object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-muted-foreground">{p.brand}</div>
                    <h3 className="font-semibold leading-snug text-foreground">{t(p.name)}</h3>
                    <span className="mt-1 inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                      {t('+{n} бонусов', { n: Math.round(p.price * 0.05) })}
                    </span>
                  </div>
                  <button
                    onClick={() => setFavGoods((s) => toggle(s, p.id))}
                    aria-label={t('Убрать из избранного')}
                    className="text-primary active:scale-90"
                  >
                    <Heart filled />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                  <span className="font-semibold text-foreground">{formatPrice(p.price)}</span>
                  <button
                    onClick={() => setInCart((s) => new Set(s).add(p.id))}
                    className={`rounded-full px-4 py-2 text-sm font-medium active:scale-95 ${
                      inCart.has(p.id) ? 'bg-accent/10 text-accent' : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {inCart.has(p.id) ? t('В корзине') : t('В корзину')}
                  </button>
                </div>
              </article>
            ))
          ))}
      </div>
    </div>
  )
}

function Empty() {
  const { t } = useT()
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
      {t('Здесь пока пусто')}
    </div>
  )
}

/* ---------- Payment methods ---------- */

type Card = { id: string; brand: 'Visa' | 'Mastercard'; last4: string; exp: string; primary: boolean }

const digits = (s: string) => s.replace(/\D/g, '')

export function PaymentMethodsScreen({ onBack, balance }: { onBack: () => void; balance: number }) {
  const { t, lang } = useT()
  const [cards, setCards] = useState<Card[]>([{ id: 'c1', brand: 'Visa', last4: '4821', exp: '08/28', primary: true }])
  const [adding, setAdding] = useState(false)
  const [num, setNum] = useState('')
  const [exp, setExp] = useState('')
  const [cvv, setCvv] = useState('')
  const valid = digits(num).length === 16 && /^(0[1-9]|1[0-2])\/\d\d$/.test(exp) && digits(cvv).length === 3

  const save = () => {
    const d = digits(num)
    setCards((c) => [...c, { id: 'c' + Date.now(), brand: d.startsWith('5') ? 'Mastercard' : 'Visa', last4: d.slice(-4), exp, primary: false }])
    setNum('')
    setExp('')
    setCvv('')
    setAdding(false)
  }
  const makePrimary = (id: string) => setCards((c) => c.map((x) => ({ ...x, primary: x.id === id })))

  const input =
    'w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'

  return (
    <div className="px-5 pb-8 pt-6">
      <TopBar title={t('Способы оплаты')} onBack={onBack} />

      <div className="flex flex-col gap-3">
        {/* Kaspi */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F14635] text-xs font-bold text-white">Kaspi</span>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-foreground">Kaspi Pay / QR</div>
            <div className="text-sm text-muted-foreground">{t('Привязан')} · +7 700 ••• •• 42</div>
          </div>
          <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">{t('Активен')}</span>
        </div>

        {/* Cards */}
        {cards.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span
              className={`flex h-11 w-14 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                c.brand === 'Visa' ? 'bg-[#1A1F71] text-white' : 'bg-foreground text-background'
              }`}
            >
              {c.brand === 'Visa' ? 'VISA' : (
                <span className="flex">
                  <span className="h-4 w-4 rounded-full bg-[#EB001B]" />
                  <span className="-ml-1.5 h-4 w-4 rounded-full bg-[#F79E1B]/90" />
                </span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 font-medium text-foreground">
                {c.brand} •••• {c.last4}
                {c.primary && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{t('Основная')}</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">{t('Действует до {d}', { d: c.exp })}</div>
            </div>
            {!c.primary && (
              <button onClick={() => makePrimary(c.id)} className="text-xs font-semibold text-primary">
                {t('Сделать основной')}
              </button>
            )}
          </div>
        ))}

        {/* Freedom */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1B9B4A] text-xs font-bold text-white">FP</span>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-foreground">Freedom Pay</div>
            <div className="text-sm text-muted-foreground">{t('Карта или рассрочка')}</div>
          </div>
          <button className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground">{t('Подключить')}</button>
        </div>

        {/* Add card */}
        {adding ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-primary/40 bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{t('Новая карта')}</h3>
              <button onClick={() => setAdding(false)} className="text-sm font-medium text-muted-foreground">
                {t('Отмена')}
              </button>
            </div>
            <input
              inputMode="numeric"
              autoComplete="cc-number"
              value={num}
              onChange={(e) => setNum(digits(e.target.value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '))}
              placeholder={t('Номер карты')}
              className={`${input} tracking-wider`}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                inputMode="numeric"
                autoComplete="cc-exp"
                value={exp}
                onChange={(e) => {
                  const d = digits(e.target.value).slice(0, 4)
                  setExp(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d)
                }}
                placeholder={t('ММ/ГГ')}
                className={input}
              />
              <input
                inputMode="numeric"
                autoComplete="cc-csc"
                type="password"
                value={cvv}
                onChange={(e) => setCvv(digits(e.target.value).slice(0, 3))}
                placeholder="CVV"
                className={input}
              />
            </div>
            <button
              onClick={save}
              disabled={!valid}
              className="w-full rounded-2xl bg-primary py-3.5 font-medium text-primary-foreground transition active:scale-[0.98] disabled:opacity-40"
            >
              {t('Сохранить карту')}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/50 bg-card py-3.5 font-medium text-primary transition active:scale-[0.99]"
          >
            <Icon name="plus" className="h-5 w-5" /> {t('Добавить новую карту')}
          </button>
        )}

        {/* Info */}
        <div className="flex gap-3 rounded-2xl bg-accent/10 p-4 text-sm text-foreground">
          <span className="text-xl leading-none">👑</span>
          <p className="leading-snug">
            {t('Бонусы ({n} ₸) можно списывать при оплате услуг и товаров.', {
              n: balance.toLocaleString(lang === 'EN' ? 'en-US' : 'ru-RU'),
            })}{' '}
            <span className="text-muted-foreground">{t('Бонусный баланс списывается при подтверждении заказа или записи.')}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

/* ---------- Support chat (full screen) ---------- */

type Msg = { id: number; from: 'me' | 'agent'; text: string }

export function SupportChat({ onBack }: { onBack: () => void }) {
  const { t } = useT()
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, from: 'agent', text: 'Здравствуйте! Чем можем вам помочь?' },
    { id: 2, from: 'me', text: 'Здравствуйте, хочу проверить статус записи' },
  ])
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const [file, setFile] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const [operator, setOperator] = useState(false)

  const replyFor = (body: string, intent?: string, hasFile?: boolean) => {
    const q = body.toLowerCase()
    if (intent === 'deposit' || /предоплат|депозит|deposit|алдын ала|1 ?000/.test(q))
      return 'Предоплата 1 000 ₸ засчитывается в стоимость услуги. Она не возвращается, только если отменить запись менее чем за 2 часа. Если списание прошло дважды — пришлите номер записи, вернём в течение 24 часов.'
    if (intent === 'order' || /заказ|доставк|order|тапсырыс|курьер/.test(q))
      return 'Ваш последний заказ передан курьеру и будет доставлен завтра с 10:00 до 18:00. Трек-номер придёт в SMS.'
    if (/запис|статус|booking|жазыл/.test(q))
      return 'Ваша ближайшая запись подтверждена ✅ Мастер ждёт вас в назначенное время. Напоминание придёт за 2 часа.'
    if (hasFile && !body.trim()) return 'Файл получен, спасибо! Уже смотрим.'
    return 'Спасибо! Передала ваш вопрос специалисту — ответим здесь в течение 2 минут.'
  }

  const agentSay = (texts: string[], delay = 1100) => {
    setTyping(true)
    texts.forEach((text, i) =>
      setTimeout(() => {
        setMessages((m) => [...m, { id: Date.now() + i, from: 'agent', text }])
        if (i === texts.length - 1) setTyping(false)
      }, delay * (i + 1)),
    )
  }

  const send = (body: string, intent?: string) => {
    const full = [body.trim(), file && `📎 ${file}`].filter(Boolean).join('\n')
    if (!full) return
    const hadFile = !!file
    setMessages((m) => [...m, { id: Date.now(), from: 'me', text: full }])
    setText('')
    setFile(null)
    if (intent === 'operator' || (/оператор|operator|человек/.test(body.toLowerCase()) && !operator)) {
      setOperator(true)
      agentSay(['Оператор Айгерим подключилась к чату', 'Здравствуйте! Я Айгерим, оператор SalemBeauty. Опишите, пожалуйста, вашу ситуацию — помогу.'])
    } else {
      agentSay([replyFor(body, intent, hadFile)])
    }
  }

  // Answer the pre-filled client question on open so the chat feels live
  const greeted = useRef(false)
  useEffect(() => {
    if (greeted.current) return
    greeted.current = true
    agentSay(['Ваша ближайшая запись подтверждена ✅ Мастер ждёт вас в назначенное время. Напоминание придёт за 2 часа.'], 900)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chips: [string, string][] = [
    ['Вопрос по предоплате 1 000 ₸', 'deposit'],
    ['Где мой заказ?', 'order'],
    ['Связаться с оператором', 'operator'],
  ]

  return (
    <div className="fixed inset-0 z-[70] mx-auto flex h-dvh w-full max-w-[430px] flex-col bg-background">
      <div className="h-[env(safe-area-inset-top)]" />
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <button
          onClick={onBack}
          aria-label={t('Назад')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground active:scale-95"
        >
          <Icon name="arrow-left" className="h-5 w-5" />
        </button>
        <div className="relative shrink-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-serif text-lg text-primary-foreground">S</span>
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-[#2EAD5B]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold leading-tight text-foreground">{t('Поддержка SalemBeauty')}</div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-[#2EAD5B]" />
            {typing ? t('Печатает…') : <>{t('В сети')} • {t('Отвечает за 2 мин')}</>}
          </div>
        </div>
        <a
          href="https://wa.me/77273000000"
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white active:scale-95"
        >
          <WhatsAppIcon />
        </a>
      </div>

      {/* Feed */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        <div className="self-center rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">{t('Сегодня')}</div>
        {messages.map((m, i) => (
          <div key={m.id} className="flex flex-col gap-2">
            <div
              className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-snug shadow-sm ${
                m.from === 'me'
                  ? 'self-end rounded-tr-md bg-primary text-primary-foreground'
                  : 'self-start rounded-tl-md border border-border bg-card text-foreground'
              }`}
            >
              {t(m.text)}
            </div>
            {i === 0 && (
              <div className="flex flex-wrap gap-2">
                {chips.map(([c, intent]) => (
                  <button
                    key={c}
                    onClick={() => send(t(c), intent)}
                    className="rounded-full border border-primary/40 bg-card px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/5 active:scale-95"
                  >
                    {t(c)}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-2 self-start rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 shadow-sm">
            {[0, 150, 300].map((d) => (
              <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${d}ms` }} />
            ))}
            <span className="sr-only">{t('Печатает…')}</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card px-3 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3">
        {file && (
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
            📎 {file}
            <button onClick={() => setFile(null)} aria-label={t('Удалить')} className="ml-1">×</button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            aria-label={t('Прикрепить файл')}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 11.5l-8.2 8.2a5 5 0 01-7.1-7.1l8.5-8.5a3.3 3.3 0 014.7 4.7l-8.5 8.5a1.7 1.7 0 01-2.4-2.4l7.8-7.8" />
            </svg>
          </button>
          <input ref={fileRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)} />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                e.preventDefault()
                send(text)
              }
            }}
            placeholder={t('Напишите сообщение...')}
            className="h-11 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={() => send(text)}
            disabled={!text.trim() && !file}
            aria-label={t('Отправить')}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition active:scale-95 disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M3.4 20.4l17.5-7.5a1 1 0 000-1.8L3.4 3.6a.9.9 0 00-1.3 1L4 11l9 1-9 1-1.9 6.4a.9.9 0 001.3 1z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
