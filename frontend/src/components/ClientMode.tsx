import { useMemo, useState } from 'react'
import { categories, masters, promos } from '../data'
import type { Booking, Master, Service } from '../data'
import BookingFlow from './BookingFlow'
import BusinessProfile from './BusinessProfile'
import { useT } from '../i18n'
import { Icon, Stars, VenueBadge, formatPrice } from './ui'

export default function ClientMode({
  onConfirmBooking,
}: {
  onConfirmBooking: (b: Booking) => void
}) {
  const { t } = useT()
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [selected, setSelected] = useState<Master | null>(null)
  const [bizOpen, setBizOpen] = useState(false)
  // booking overlay: which master + optional pre-picked service
  const [booking, setBooking] = useState<{ master: Master; service: Service | null } | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return masters.filter((m) => {
      if (activeCat && m.categoryId !== activeCat) return false
      if (!q) return true
      return (
        m.name.toLowerCase().includes(q) ||
        m.specialty.toLowerCase().includes(q) ||
        m.district.toLowerCase().includes(q)
      )
    })
  }, [query, activeCat])

  const activeName = activeCat
    ? categories.find((c) => c.id === activeCat)?.name
    : null

  const overlay = booking && (
    <BookingFlow
      master={booking.master}
      service={booking.service}
      onClose={() => setBooking(null)}
      onConfirm={(b) => onConfirmBooking(b)}
    />
  )

  if (bizOpen) {
    return <BusinessProfile onBack={() => setBizOpen(false)} onConfirmBooking={onConfirmBooking} />
  }

  if (selected) {
    return (
      <>
        <MasterDetail
          master={selected}
          onBack={() => setSelected(null)}
          onBook={(service) => setBooking({ master: selected, service })}
        />
        {overlay}
      </>
    )
  }

  return (
    <div className="w-full px-5 pb-28 pt-4">
      {/* Search */}
      <div className="relative">
        <Icon
          name="search"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('Поиск услуг, мастеров, салонов')}
          className="w-full rounded-2xl border border-border bg-card py-3.5 pl-12 pr-4 text-base shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Salon ad / promo banners */}
      <section className="mt-5 -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 no-scrollbar">
        {promos.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              const m = masters.find((mm) => mm.name === p.salon)
              if (m) setSelected(m)
            }}
            className="relative aspect-[16/9] w-[85%] flex-shrink-0 snap-start overflow-hidden rounded-3xl text-left"
          >
            <img src={p.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-5 text-white">
              <span className="mb-1 w-fit rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-medium">
                {t('Реклама')} · {p.salon}
              </span>
              <span className="font-serif text-2xl leading-tight">{t(p.title)}</span>
              <span className="mt-0.5 text-sm text-white/85">{t(p.subtitle)}</span>
              <span className="mt-2 inline-flex w-fit items-center gap-1 text-sm font-medium">
                {t(p.cta)} <Icon name="chevron" className="h-4 w-4" />
              </span>
            </div>
          </button>
        ))}
      </section>

      {/* Featured partner */}
      <button
        onClick={() => setBizOpen(true)}
        className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left shadow-sm transition active:scale-[0.99]"
      >
        <img
          src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&h=200&fit=crop&auto=format"
          alt=""
          className="h-14 w-14 rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate font-semibold text-foreground">Gentlemen Lab</span>
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              {t('Партнёр')}
            </span>
          </div>
          <div className="truncate text-sm text-muted-foreground">{t('Барбершоп и магазин косметики')}</div>
          <div className="text-xs text-muted-foreground">★ 4.9 · {t('Услуги, магазин и вакансии')}</div>
        </div>
        <Icon name="chevron" className="h-5 w-5 shrink-0 text-muted-foreground" />
      </button>

      {/* Categories */}
      <section className="mt-7">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-serif text-2xl text-foreground">{t('Категории')}</h2>
          {activeCat && (
            <button
              onClick={() => setActiveCat(null)}
              className="text-sm font-medium text-primary active:opacity-60"
            >
              {t('Сбросить')}
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map((c) => {
            const isActive = activeCat === c.id
            return (
              <button
                key={c.id}
                onClick={() => setActiveCat(isActive ? null : c.id)}
                className={`group relative overflow-hidden rounded-2xl border text-left transition active:scale-[0.98] ${
                  isActive ? 'border-primary ring-2 ring-primary/30' : 'border-border'
                }`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                  <img
                    src={c.image}
                    alt={t(c.name)}
                    className={`h-full w-full object-cover ${
                      c.tone === 'neutral' ? 'saturate-[0.8]' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="text-sm font-semibold leading-tight text-white">{t(c.name)}</div>
                  <div className="mt-0.5 text-xs text-white/80">{t(c.tagline)}</div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Results */}
      <section className="mt-8">
        <h2 className="mb-4 font-serif text-2xl text-foreground">
          {activeName ? t(activeName) : t('Популярные мастера')}
          <span className="ml-2 align-middle text-sm font-sans text-muted-foreground">
            {results.length}
          </span>
        </h2>
        {results.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground">
            {t('Ничего не найдено. Попробуйте изменить запрос или категорию.')}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {results.map((m) => (
              <MasterCard key={m.id} master={m} onOpen={() => setSelected(m)} />
            ))}
          </div>
        )}
      </section>

      {overlay}
    </div>
  )
}

function MasterCard({ master, onOpen }: { master: Master; onOpen: () => void }) {
  const { t } = useT()
  return (
    <button
      onClick={onOpen}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition active:scale-[0.99]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <img
          src={master.cover}
          alt={master.name}
          className={`h-full w-full object-cover ${
            master.venueType === 'barbershop' ? 'saturate-[0.85]' : ''
          }`}
        />
        <div className="absolute left-3 top-3">
          <VenueBadge type={master.venueType} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight text-foreground">{t(master.name)}</h3>
          <Stars rating={master.rating} reviews={master.reviews} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{t(master.specialty)}</p>
        <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Icon name="pin" className="h-4 w-4" />
          {t(master.district)}, {t(master.city)}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm text-muted-foreground">
            {t('от')} <span className="font-semibold text-foreground">{formatPrice(master.priceFrom)}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            {t('Записаться')} <Icon name="chevron" className="h-4 w-4" />
          </span>
        </div>
      </div>
    </button>
  )
}

function MasterDetail({
  master,
  onBack,
  onBook,
}: {
  master: Master
  onBack: () => void
  onBook: (service: Service | null) => void
}) {
  const { t } = useT()
  return (
    <div className="w-full px-5 pb-40 pt-4">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground active:opacity-60"
      >
        <Icon name="arrow-left" className="h-4 w-4" /> {t('Назад')}
      </button>

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-muted">
          <img src={master.cover} alt={master.name} className="h-full w-full object-cover" />
          <div className="absolute left-4 top-4">
            <VenueBadge type={master.venueType} />
          </div>
        </div>

        <div className="p-5">
          <h1 className="font-serif text-2xl text-foreground">{t(master.name)}</h1>
          <p className="mt-1 text-muted-foreground">{t(master.specialty)}</p>
          <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
            <Stars rating={master.rating} reviews={master.reviews} />
            <span className="inline-flex items-center gap-1">
              <Icon name="pin" className="h-4 w-4" />
              {t(master.district)}, {t(master.city)}
            </span>
          </div>

          <p className="mt-4 leading-relaxed text-secondary-foreground">{t(master.bio)}</p>

          {/* Services */}
          <h2 className="mt-7 font-serif text-xl text-foreground">{t('Услуги')}</h2>
          <ul className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border">
            {master.services.map((s) => (
              <li key={s.name} className="flex items-center justify-between gap-4 bg-card px-4 py-3">
                <div>
                  <div className="font-medium text-foreground">{t(s.name)}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon name="clock" className="h-3.5 w-3.5" /> {t('{n} мин', { n: s.duration })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">{formatPrice(s.price)}</div>
                  <button
                    onClick={() => onBook(s)}
                    className="mt-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition active:scale-95"
                  >
                    {t('Выбрать')}
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Gallery */}
          <h2 className="mt-7 font-serif text-xl text-foreground">{t('Работы')}</h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {master.gallery.map((g, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-xl bg-muted">
                <img src={g} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking bar — floats above the tab bar, within the phone column */}
      <div className="fixed bottom-[calc(60px+env(safe-area-inset-bottom))] left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <span className="text-sm text-muted-foreground">
            {t('от')} <span className="font-semibold text-foreground">{formatPrice(master.priceFrom)}</span>
          </span>
          <button
            onClick={() => onBook(null)}
            className="rounded-full bg-primary px-6 py-2.5 font-medium text-primary-foreground transition active:scale-95"
          >
            {t('Записаться')}
          </button>
        </div>
      </div>
    </div>
  )
}
