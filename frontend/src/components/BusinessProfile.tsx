import { useState } from 'react'
import type { Booking, Master, Service } from '../data'
import { useT } from '../i18n'
import BookingFlow from './BookingFlow'
import Checkout from './Checkout'
import { Icon, Stars, formatPrice } from './ui'
import SocialContactBlock from './SocialContactBlock'
import { SingleLocationMap } from './MapView'

/* ---------- Business data (public profile of a barbershop + cosmetics store) ---------- */

const business = {
  name: 'Gentlemen Lab',
  tagline: 'Барбершоп и магазин косметики',
  logo: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&h=200&fit=crop&auto=format',
  cover: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&h=400&fit=crop&auto=format',
  rating: 4.9,
  reviews: 412,
  address: 'пр. Абая, 52, Алматы',
  hours: 'Ежедневно 10:00 – 22:00',
  whatsapp: '+77019876543',
  instagram: 'gentlemenlab.kz',
  coordinates: { lat: 43.2389, lng: 76.9152 },
}

type ServiceGroup = { title: string; items: Service[] }

const serviceGroups: ServiceGroup[] = [
  {
    title: 'Стрижки',
    items: [
      { name: 'Мужская стрижка', price: 7000, duration: 45 },
      { name: 'Стрижка + борода', price: 10000, duration: 75 },
      { name: 'Оформление бороды', price: 4500, duration: 30 },
    ],
  },
  {
    title: 'Уход за лицом',
    items: [
      { name: 'Королевское бритьё', price: 6000, duration: 40 },
      { name: 'Чистка лица', price: 9000, duration: 50 },
    ],
  },
  {
    title: 'Ногтевой сервис',
    items: [
      { name: 'Мужской маникюр', price: 5000, duration: 40 },
      { name: 'Педикюр', price: 8000, duration: 60 },
    ],
  },
]

type StoreCategory = 'Все' | 'Масла' | 'Воски' | 'Шампуни' | 'Уход'
type StoreProduct = {
  id: string
  name: string
  brand: string
  spec: string
  price: number
  cashback: number
  category: Exclude<StoreCategory, 'Все'>
  image: string
}

const storeCategories: StoreCategory[] = ['Все', 'Масла', 'Воски', 'Шампуни', 'Уход']

const storeProducts: StoreProduct[] = [
  { id: 'g1', name: 'Масло для бороды', brand: 'Proraso', spec: '30 мл', price: 6900, cashback: 345, category: 'Масла', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=400&fit=crop&auto=format' },
  { id: 'g2', name: 'Воск для укладки', brand: 'Reuzel', spec: '113 г · сильная фиксация', price: 8500, cashback: 425, category: 'Воски', image: 'https://images.unsplash.com/photo-1626808642875-0aa545482dfb?w=400&h=400&fit=crop&auto=format' },
  { id: 'g3', name: 'Шампунь для волос и бороды', brand: 'American Crew', spec: '250 мл', price: 7200, cashback: 360, category: 'Шампуни', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop&auto=format' },
  { id: 'g4', name: 'Крем после бритья', brand: 'Baxter', spec: '100 мл', price: 9900, cashback: 495, category: 'Уход', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop&auto=format' },
  { id: 'g5', name: 'Матовая паста', brand: 'Layrite', spec: '120 г · средняя фиксация', price: 7800, cashback: 390, category: 'Воски', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop&auto=format' },
  { id: 'g6', name: 'Сыворотка для лица', brand: 'Lab Series', spec: '50 мл', price: 14500, cashback: 725, category: 'Уход', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&auto=format' },
]

const careers = [
  { id: 'c1', title: 'Барбер', exp: 'Опыт от 1 года', pay: '50% от услуг', type: 'Полная занятость' },
  { id: 'c2', title: 'Мастер маникюра', exp: 'Опыт от 6 месяцев', pay: 'от 300 000 ₸', type: 'Сменный график' },
  { id: 'c3', title: 'Консультант магазина', exp: 'Без опыта', pay: 'от 250 000 ₸', type: 'Полная занятость' },
]

/** Business adapter so the shared BookingFlow can book its services. */
const asMaster: Master = {
  id: 'biz-gentlemen-lab',
  name: business.name,
  venueType: 'barbershop',
  categoryId: 'barber',
  specialty: business.tagline,
  district: 'Алмалинский',
  city: 'Алматы',
  rating: business.rating,
  reviews: business.reviews,
  priceFrom: 4500,
  photo: business.logo,
  cover: business.cover,
  bio: '',
  services: serviceGroups.flatMap((g) => g.items),
  gallery: [],
}

type Tab = 'services' | 'store' | 'careers'

/* ---------- Page ---------- */

export default function BusinessProfile({
  onBack,
  onConfirmBooking,
  overrides,
}: {
  onBack: () => void
  onConfirmBooking: (b: Booking) => void
  /** Lets a freshly registered business preview its own page */
  overrides?: { name: string; tagline: string }
}) {
  const { t } = useT()
  const name = overrides?.name || business.name
  const tagline = overrides?.tagline || business.tagline
  const [tab, setTab] = useState<Tab>('services')
  const [storeCat, setStoreCat] = useState<StoreCategory>('Все')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [applied, setApplied] = useState<Set<string>>(new Set())
  const [checkout, setCheckout] = useState(false)
  const [booking, setBooking] = useState<Service | null | undefined>(undefined)

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
  const count = Object.values(cart).reduce((a, b) => a + b, 0)
  const total = Object.entries(cart).reduce(
    (s, [id, q]) => s + (storeProducts.find((p) => p.id === id)?.price ?? 0) * q,
    0,
  )
  const cashback = Object.entries(cart).reduce(
    (s, [id, q]) => s + (storeProducts.find((p) => p.id === id)?.cashback ?? 0) * q,
    0,
  )
  const list = storeCat === 'Все' ? storeProducts : storeProducts.filter((p) => p.category === storeCat)

  return (
    <div className="w-full px-5 pb-40 pt-4">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground active:opacity-60"
      >
        <Icon name="arrow-left" className="h-4 w-4" /> {t('Назад')}
      </button>

      {/* Banner + profile */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-muted">
          <img src={business.cover} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
        </div>
        <div className="relative px-5 pb-5">
          <div className="-mt-9 flex items-end justify-between gap-3">
            <img
              src={business.logo}
              alt={name}
              className="h-[72px] w-[72px] rounded-2xl border-4 border-card object-cover shadow-sm"
            />
            <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                <path d="M12 2l2.4 1.8 3-.2.9 2.9 2.5 1.7-1 2.8 1 2.8-2.5 1.7-.9 2.9-3-.2L12 22l-2.4-1.8-3 .2-.9-2.9-2.5-1.7 1-2.8-1-2.8 2.5-1.7.9-2.9 3 .2L12 2zm-1.2 13.6l5.7-5.7-1.4-1.4-4.3 4.3-2-2-1.4 1.4 3.4 3.4z" />
              </svg>
              {t('Проверенный партнёр')}
            </span>
          </div>

          <h1 className="mt-3 font-serif text-2xl text-foreground">{name}</h1>
          <p className="mt-0.5 text-muted-foreground">{t(tagline)}</p>
          <div className="mt-2">
            <Stars rating={business.rating} reviews={business.reviews} />
          </div>

          <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-secondary/60 p-3 text-sm text-secondary-foreground">
            <span className="inline-flex items-center gap-2">
              <Icon name="pin" className="h-4 w-4 shrink-0 text-primary" /> {t(business.address)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="clock" className="h-4 w-4 shrink-0 text-primary" /> {t(business.hours)}
              <span className="ml-auto rounded-full bg-card px-2 py-0.5 text-xs font-semibold text-primary">
                {t('Открыто')}
              </span>
            </span>
          </div>

          {/* Social Contact Block for this business */}
          <div className="mt-4">
            <SocialContactBlock links={{ whatsapp: business.whatsapp, instagram: business.instagram }} />
          </div>

          {/* Location on Map */}
          <div className="mt-4">
            <SingleLocationMap
              name={name}
              address={business.address}
              coordinates={business.coordinates}
              venueType="barbershop"
            />
          </div>
        </div>
      </div>

      {/* Tab bar — segmented control */}
      <div role="tablist" className="mt-5 flex w-full rounded-[14px] bg-secondary p-1">
        {(
          [
            ['services', 'Услуги'],
            ['store', 'Магазин'],
            ['careers', 'Вакансии'],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex-1 whitespace-nowrap rounded-[11px] px-3 py-2 text-sm font-medium transition ${
              tab === id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground active:opacity-70'
            }`}
          >
            {t(label)}
          </button>
        ))}
      </div>

      {/* Services */}
      {tab === 'services' && (
        <div className="mt-5 flex flex-col gap-6">
          {serviceGroups.map((g) => (
            <section key={g.title}>
              <h2 className="font-serif text-xl text-foreground">{t(g.title)}</h2>
              <ul className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border">
                {g.items.map((s) => (
                  <li key={s.name} className="flex items-center justify-between gap-4 bg-card px-4 py-3">
                    <div>
                      <div className="font-medium text-foreground">{t(s.name)}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('{n} мин', { n: s.duration })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">{formatPrice(s.price)}</span>
                      <button
                        onClick={() => setBooking(s)}
                        className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary active:scale-95"
                      >
                        {t('Записаться')}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {/* Store */}
      {tab === 'store' && (
        <div className="mt-5">
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar">
            {storeCategories.map((c) => (
              <button
                key={c}
                onClick={() => setStoreCat(c)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  storeCat === c
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-secondary-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {t(c)}
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {list.map((p) => (
              <StoreCard key={p.id} product={p} qty={cart[p.id] ?? 0} onAdd={() => add(p.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Careers */}
      {tab === 'careers' && (
        <div className="mt-5 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">{t('Ищем мастеров и барберов в команду')}</p>
          {careers.map((c) => {
            const done = applied.has(c.id)
            return (
              <div key={c.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{t(c.title)}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{t(c.exp)}</p>
                  </div>
                  <span className="whitespace-nowrap font-semibold text-foreground">{t(c.pay)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    {t(c.type)}
                  </span>
                  <button
                    onClick={() => setApplied((s) => new Set(s).add(c.id))}
                    disabled={done}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition active:scale-95 ${
                      done ? 'bg-secondary text-muted-foreground' : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {done ? t('Отклик отправлен') : t('Откликнуться')}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Cart bar */}
      {count > 0 && (
        <div className="fixed bottom-[calc(72px+env(safe-area-inset-bottom))] left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 px-4">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-foreground px-4 py-3 text-background shadow-lg">
            <div>
              <div className="text-sm font-semibold">
                {t('{n} в корзине', { n: count })} · {formatPrice(total)}
              </div>
              <div className="text-xs opacity-70">{t('Кешбэк +{n} бонусов', { n: cashback })}</div>
            </div>
            <button
              onClick={() => setCheckout(true)}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground active:scale-95">
              {t('Оформить')}
            </button>
          </div>
        </div>
      )}

      {checkout && (
        <Checkout
          items={Object.entries(cart).map(([id, qty]) => {
            const p = storeProducts.find((x) => x.id === id)!
            return { id, name: p.name, brand: p.brand, image: p.image, price: p.price, qty }
          })}
          onClose={() => setCheckout(false)}
          onPaid={() => {
            setCart({})
            setCheckout(false)
          }}
        />
      )}

      {booking !== undefined && (
        <BookingFlow
          master={asMaster}
          service={booking}
          onClose={() => setBooking(undefined)}
          onConfirm={onConfirmBooking}
        />
      )}
    </div>
  )
}

function StoreCard({ product: p, qty, onAdd }: { product: StoreProduct; qty: number; onAdd: () => void }) {
  const { t } = useT()
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <img src={p.image} alt={t(p.name)} className="h-full w-full object-cover" />
        <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
          👑 {t('Кешбэк +{n} бонусов', { n: p.cashback })}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-0.5 p-3">
        <div className="text-xs text-muted-foreground">{p.brand}</div>
        <div className="text-sm font-medium leading-snug text-foreground">{t(p.name)}</div>
        <div className="text-xs text-muted-foreground">{t(p.spec)}</div>
        <div className="mt-auto pt-2 font-semibold text-foreground">{formatPrice(p.price)}</div>
        <button
          onClick={onAdd}
          className="mt-2 flex h-9 w-full items-center justify-center gap-1 rounded-xl bg-primary text-xs font-semibold text-primary-foreground transition active:scale-95"
        >
          <Icon name="bag" className="h-4 w-4" />
          {qty > 0 ? t('В корзине · {n}', { n: qty }) : t('В корзину')}
        </button>
      </div>
    </div>
  )
}
