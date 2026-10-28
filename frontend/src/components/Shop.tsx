import { useMemo, useState } from 'react'
import { products, shopCategories } from '../data'
import type { Product, ShopCategory } from '../data'
import { useT } from '../i18n'
import { Icon, formatPrice } from './ui'
import Checkout from './Checkout'

export default function Shop() {
  const { t } = useT()
  const [cat, setCat] = useState<ShopCategory>('Для тебя')
  // cart: productId -> qty
  const [cart, setCart] = useState<Record<string, number>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [checkout, setCheckout] = useState(false)

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
  const remove = (id: string) =>
    setCart((c) => {
      const next = { ...c }
      if ((next[id] ?? 0) <= 1) delete next[id]
      else next[id] -= 1
      return next
    })

  const list = useMemo(
    () => (cat === 'Для тебя' ? products.filter((p) => p.featured) : products.filter((p) => p.category === cat)),
    [cat],
  )

  const count = Object.values(cart).reduce((a, b) => a + b, 0)
  const total = Object.entries(cart).reduce(
    (sum, [id, q]) => sum + (products.find((p) => p.id === id)?.price ?? 0) * q,
    0,
  )

  return (
    <div className="px-5 pb-28 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-foreground">{t('Магазин')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('Покупай любимую косметику')}</p>
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground active:scale-95"
        >
          <Icon name="bag" className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* category tabs */}
      <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar">
        {shopCategories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              cat === c
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-secondary-foreground active:scale-95'
            }`}
          >
            {t(c)}
          </button>
        ))}
      </div>

      {/* product grid */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} qty={cart[p.id] ?? 0} onAdd={() => add(p.id)} />
        ))}
      </div>

      {/* checkout bar */}
      {count > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-[calc(60px+env(safe-area-inset-bottom))] left-1/2 z-20 flex w-[calc(100%-2.5rem)] max-w-[390px] -translate-x-1/2 items-center justify-between rounded-2xl bg-primary px-5 py-3.5 text-primary-foreground shadow-lg active:scale-[0.99]"
        >
          <span className="font-medium">{t('Корзина')} · {count}</span>
          <span className="font-semibold">{formatPrice(total)}</span>
        </button>
      )}

      {/* cart sheet */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-[430px] items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="relative w-full rounded-t-3xl bg-background pb-[calc(16px+env(safe-area-inset-bottom))]">
            <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-border" />
            <div className="flex items-center justify-between px-5 py-4">
              <h3 className="font-serif text-xl text-foreground">{t('Корзина')}</h3>
              <button
                onClick={() => setCartOpen(false)}
                className="text-sm font-medium text-muted-foreground active:opacity-60"
              >
                {t('Закрыть')}
              </button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto px-5">
              {count === 0 ? (
                <p className="py-10 text-center text-muted-foreground">{t('Корзина пуста')}</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(cart).map(([id, q]) => {
                    const p = products.find((x) => x.id === id)!
                    return (
                      <div key={id} className="flex items-center gap-3">
                        <img src={p.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-foreground">
                            {t(p.name)}
                          </div>
                          <div className="text-xs text-muted-foreground">{p.brand}</div>
                          <div className="mt-0.5 text-sm font-semibold text-foreground">
                            {formatPrice(p.price)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <QtyButton onClick={() => remove(id)}>−</QtyButton>
                          <span className="w-5 text-center font-medium">{q}</span>
                          <QtyButton onClick={() => add(id)}>+</QtyButton>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            {count > 0 && (
              <div className="px-5 pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-muted-foreground">{t('Итого')}</span>
                  <span className="font-serif text-xl text-foreground">{formatPrice(total)}</span>
                </div>
                <button
                  onClick={() => {
                    setCartOpen(false)
                    setCheckout(true)
                  }}
                  className="w-full rounded-2xl bg-primary py-3.5 font-medium text-primary-foreground active:scale-[0.98]"
                >
                  {t('Оформить')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {checkout && (
        <Checkout
          items={Object.entries(cart).map(([id, qty]) => {
            const p = products.find((x) => x.id === id)!
            return { id, name: p.name, brand: p.brand, image: p.image, price: p.price, qty }
          })}
          onClose={() => setCheckout(false)}
          onPaid={() => {
            setCart({})
            setCheckout(false)
          }}
        />
      )}
    </div>
  )
}

function ProductCard({
  product: p,
  qty,
  onAdd,
}: {
  product: Product
  qty: number
  onAdd: () => void
}) {
  const { t } = useT()
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="aspect-square w-full overflow-hidden bg-muted">
        <img src={p.image} alt={t(p.name)} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <div className="text-xs text-muted-foreground">{p.brand}</div>
        <div className="text-sm font-medium leading-snug text-foreground">{t(p.name)}</div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-semibold text-foreground">{formatPrice(p.price)}</span>
          <button
            onClick={onAdd}
            className="flex h-8 items-center gap-1 rounded-full bg-primary px-2.5 text-xs font-medium text-primary-foreground active:scale-95"
          >
            <Icon name="plus" className="h-4 w-4" />
            {qty > 0 && qty}
          </button>
        </div>
      </div>
    </div>
  )
}

function QtyButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-lg font-medium text-foreground active:scale-90"
    >
      {children}
    </button>
  )
}
