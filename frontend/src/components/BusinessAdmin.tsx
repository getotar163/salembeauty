import { useState } from 'react'
import { useT } from '../i18n'
import { Icon, formatPrice } from './ui'
import { DEPOSIT_AMOUNT } from './DepositModal'

/* ---------- Seed data for the owner dashboard ---------- */

type AdminService = { id: string; name: string; duration: number; price: number }
type Staff = { id: string; name: string; specialty: string; rating: number; phone: string; schedule: string; photo: string | null }
type Product = { id: string; name: string; brand: string; price: number; stock: number; cashback: number; photo: string | null }
type Slot = { id: string; time: string; client: string; service: string; master: string; deposit: boolean }

const SEED_SERVICES: AdminService[] = [
  { id: 's1', name: 'Мужская стрижка', duration: 45, price: 7000 },
  { id: 's2', name: 'Стрижка + борода', duration: 75, price: 10000 },
  { id: 's3', name: 'Оформление бороды', duration: 30, price: 4500 },
  { id: 's4', name: 'Королевское бритьё', duration: 40, price: 6000 },
]

const SEED_STAFF: Staff[] = [
  { id: 'm1', name: 'Арман Сейткали', specialty: 'Барбер', rating: 4.9, phone: '+7 701 ••• •• 18', schedule: 'Пн–Пт, 10:00–20:00', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop' },
  { id: 'm2', name: 'Даниял Ержанов', specialty: 'Барбер', rating: 4.8, phone: '+7 705 ••• •• 63', schedule: 'Ср–Вс, 12:00–22:00', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
  { id: 'm3', name: 'Алия Нурланова', specialty: 'Косметолог', rating: 5.0, phone: '+7 777 ••• •• 04', schedule: 'Вт–Сб, 10:00–19:00', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop' },
]

const SEED_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Масло для бороды', brand: 'Proraso', price: 6900, stock: 14, cashback: 5, photo: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=200&h=200&fit=crop' },
  { id: 'p2', name: 'Шампунь для волос и бороды', brand: 'American Crew', price: 7200, stock: 3, cashback: 5, photo: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=200&h=200&fit=crop' },
  { id: 'p3', name: 'Сыворотка для лица', brand: 'Lab Series', price: 14500, stock: 8, cashback: 7, photo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop' },
]

const SEED_SLOTS: Slot[] = [
  { id: 'b1', time: '10:00', client: 'Ерлан К.', service: 'Мужская стрижка', master: 'Арман Сейткали', deposit: true },
  { id: 'b2', time: '11:30', client: 'Тимур А.', service: 'Стрижка + борода', master: 'Даниял Ержанов', deposit: true },
  { id: 'b3', time: '13:00', client: 'Мадина С.', service: 'Чистка лица', master: 'Алия Нурланова', deposit: true },
  { id: 'b4', time: '15:00', client: 'Руслан Б.', service: 'Королевское бритьё', master: 'Арман Сейткали', deposit: false },
  { id: 'b5', time: '17:30', client: 'Нурсултан Ж.', service: 'Оформление бороды', master: 'Даниял Ержанов', deposit: true },
]

const SCHEDULES = ['Пн–Пт, 10:00–20:00', 'Ср–Вс, 12:00–22:00', 'Вт–Сб, 10:00–19:00', 'Ежедневно 10:00 – 22:00']

const inputCls =
  'w-full min-w-0 rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
const digits = (s: string) => s.replace(/\D/g, '')

/* ---------- Building blocks ---------- */

function Section({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <section className="flex w-full flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <header className="flex items-center gap-2">
        <h3 className="flex-1 font-serif text-xl leading-tight text-foreground">{title}</h3>
        {count !== undefined && (
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-sm font-semibold text-secondary-foreground">{count}</span>
        )}
      </header>
      {children}
    </section>
  )
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/50 py-3 font-medium text-primary transition hover:bg-primary/5 active:scale-[0.99]"
    >
      <Icon name="plus" className="h-5 w-5 shrink-0" />
      {children}
    </button>
  )
}

function FormActions({ onCancel, onSave, disabled, saveLabel }: { onCancel: () => void; onSave: () => void; disabled: boolean; saveLabel: string }) {
  const { t } = useT()
  return (
    <div className="grid grid-cols-2 gap-2">
      <button onClick={onCancel} className="rounded-2xl border border-border bg-card py-3 font-medium text-foreground active:scale-[0.98]">
        {t('Отмена')}
      </button>
      <button onClick={onSave} disabled={disabled} className="rounded-2xl bg-primary py-3 font-medium text-primary-foreground transition active:scale-[0.98] disabled:opacity-40">
        {saveLabel}
      </button>
    </div>
  )
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-secondary-foreground">{text}</span>
      {children}
    </label>
  )
}

function Pencil() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" />
    </svg>
  )
}

function Avatar({ src, name, rounded = 'rounded-full', size = 'h-12 w-12' }: { src: string | null; name: string; rounded?: string; size?: string }) {
  return src ? (
    <img src={src} alt="" className={`${size} shrink-0 ${rounded} bg-muted object-cover`} />
  ) : (
    <span className={`flex ${size} shrink-0 items-center justify-center ${rounded} bg-primary/10 font-serif text-lg text-primary`}>
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

const readPhoto = (f: File | undefined, set: (v: string) => void) => {
  if (!f) return
  const r = new FileReader()
  r.onload = () => set(String(r.result))
  r.readAsDataURL(f)
}

/* ---------- Dashboard ---------- */

export default function BusinessAdmin({
  name,
  category,
  onOpenPage,
}: {
  name: string
  category: string
  onOpenPage: () => void
}) {
  const { t, lang } = useT()
  const fmt = (n: number) => n.toLocaleString(lang === 'EN' ? 'en-US' : 'ru-RU')

  const [services, setServices] = useState(SEED_SERVICES)
  const [editingService, setEditingService] = useState<AdminService | null>(null)
  const [depositRequired, setDepositRequired] = useState(true)
  const [staff, setStaff] = useState(SEED_STAFF)
  const [staffForm, setStaffForm] = useState<{ name: string; phone: string; schedule: string } | null>(null)
  const [products, setProducts] = useState(SEED_PRODUCTS)
  const [productForm, setProductForm] = useState<{ name: string; price: string; stock: string; photo: string | null } | null>(null)
  const [slots] = useState(SEED_SLOTS)

  const saveService = () => {
    if (!editingService) return
    setServices((list) =>
      list.some((s) => s.id === editingService.id)
        ? list.map((s) => (s.id === editingService.id ? editingService : s))
        : [...list, editingService],
    )
    setEditingService(null)
  }
  const serviceValid = !!editingService && editingService.name.trim() !== '' && editingService.price > 0 && editingService.duration > 0

  const staffValid = !!staffForm && staffForm.name.trim() !== '' && digits(staffForm.phone).length === 10
  const saveStaff = () => {
    if (!staffForm) return
    const d = digits(staffForm.phone)
    setStaff((s) => [
      ...s,
      { id: 'm' + Date.now(), name: staffForm.name.trim(), specialty: 'Барбер', rating: 5, phone: `+7 ${d.slice(0, 3)} ••• •• ${d.slice(8)}`, schedule: staffForm.schedule, photo: null },
    ])
    setStaffForm(null)
  }

  const productValid = !!productForm && productForm.name.trim() !== '' && Number(productForm.price) > 0 && productForm.stock !== ''
  const saveProduct = () => {
    if (!productForm) return
    setProducts((p) => [
      ...p,
      { id: 'p' + Date.now(), name: productForm.name.trim(), brand: name, price: Number(productForm.price), stock: Number(productForm.stock), cashback: 5, photo: productForm.photo },
    ])
    setProductForm(null)
  }

  const todayCount = slots.length
  const monthIncome = 1_842_000

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Salon overview */}
      <section className="flex w-full flex-col gap-4 rounded-2xl bg-accent p-4 text-accent-foreground shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-foreground/12 font-serif text-2xl">
            {name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h2 className="break-words font-serif text-2xl leading-tight">{name}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-foreground/15 px-2 py-0.5 text-xs font-semibold">
                <Icon name="check" className="h-3.5 w-3.5" /> {t('Проверено')}
              </span>
            </div>
            <p className="text-sm text-accent-foreground/75">{t(category)}</p>
            <p className="mt-1 flex items-start gap-1 text-sm text-accent-foreground/85">
              <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0" />
              {t('пр. Абая, 52, Алматы')}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-foreground px-3 py-1 text-sm font-semibold text-accent">
            <span className="h-2 w-2 rounded-full bg-[#2EAD5B]" /> {t('Открыто')}
          </span>
          <span className="text-sm text-accent-foreground/75">{t('до 22:00')}</span>
          <button onClick={onOpenPage} className="ml-auto inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline">
            {t('Страница для клиентов')} <Icon name="chevron" className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Quick metrics */}
      <div className="grid w-full grid-cols-2 gap-2">
        {(
          [
            [fmt(monthIncome) + ' ₸', 'Доход за месяц (₸)'],
            [String(todayCount), 'Записи на сегодня'],
            [String(staff.length), 'Активные мастера'],
          ] as const
        ).map(([v, l], i) => (
          <div key={l} className={`flex flex-col gap-1 rounded-2xl border border-border bg-card p-3 shadow-sm ${i === 0 ? 'col-span-2' : ''}`}>
            <span className="break-words font-serif text-2xl leading-tight text-foreground">{v}</span>
            <span className="text-xs leading-tight text-muted-foreground">{t(l)}</span>
          </div>
        ))}
      </div>

      {/* Booking journal */}
      <Section title={t('Журнал записей')} count={slots.length}>
        <p className="-mt-1 text-sm text-muted-foreground">{t('Сегодня')}</p>
        <ol className="flex flex-col gap-2">
          {slots.map((s) => (
            <li key={s.id} className="flex gap-3 rounded-xl bg-secondary/50 p-3">
              <span className="w-12 shrink-0 font-serif text-lg leading-tight text-primary">{s.time}</span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-semibold text-foreground">{t(s.client)}</span>
                <span className="text-sm text-muted-foreground">
                  {t(s.service)} · {t(s.master)}
                </span>
                {s.deposit ? (
                  <span className="inline-flex w-fit items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                    <Icon name="check" className="h-3.5 w-3.5" />
                    {t('Предоплата {n} внесена', { n: formatPrice(DEPOSIT_AMOUNT) })}
                  </span>
                ) : (
                  <span className="inline-flex w-fit rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {t('Без предоплаты')}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Services & price list */}
      <Section title={t('Услуги и прайс-лист')} count={services.length}>
        <ul className="flex flex-col divide-y divide-border">
          {services.map((s) =>
            editingService?.id === s.id ? null : (
              <li key={s.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-foreground">{t(s.name)}</div>
                  <div className="text-sm text-muted-foreground">{t('{n} мин', { n: s.duration })}</div>
                </div>
                <span className="shrink-0 font-semibold text-foreground">{formatPrice(s.price)}</span>
                <button
                  onClick={() => setEditingService({ ...s, name: t(s.name) })}
                  aria-label={t('Редактировать')}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition hover:text-primary active:scale-95"
                >
                  <Pencil />
                </button>
              </li>
            ),
          )}
        </ul>

        {editingService ? (
          <div className="flex flex-col gap-3 rounded-xl border border-primary/40 bg-primary/5 p-3">
            <Label text={t('Название услуги')}>
              <input value={editingService.name} onChange={(e) => setEditingService({ ...editingService, name: e.target.value })} className={inputCls} />
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Label text={t('Длительность, мин')}>
                <input inputMode="numeric" value={editingService.duration || ''} onChange={(e) => setEditingService({ ...editingService, duration: Number(digits(e.target.value).slice(0, 3)) })} className={inputCls} />
              </Label>
              <Label text={t('Цена, ₸')}>
                <input inputMode="numeric" value={editingService.price || ''} onChange={(e) => setEditingService({ ...editingService, price: Number(digits(e.target.value).slice(0, 7)) })} className={inputCls} />
              </Label>
            </div>
            <FormActions onCancel={() => setEditingService(null)} onSave={saveService} disabled={!serviceValid} saveLabel={t('Сохранить')} />
          </div>
        ) : (
          <AddButton onClick={() => setEditingService({ id: 's' + Date.now(), name: '', duration: 30, price: 0 })}>{t('Добавить услугу')}</AddButton>
        )}

        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-secondary/50 p-3">
          <span className="min-w-0 flex-1 text-sm">
            <span className="block font-medium text-foreground">{t('Обязательная предоплата: {n}', { n: formatPrice(DEPOSIT_AMOUNT) })}</span>
            <span className="text-muted-foreground">{t('Защита от срыва брони')}</span>
          </span>
          <input type="checkbox" role="switch" checked={depositRequired} onChange={(e) => setDepositRequired(e.target.checked)} className="peer sr-only" />
          <span
            aria-hidden="true"
            className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 ${depositRequired ? 'bg-accent' : 'bg-border'}`}
          >
            <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-card shadow transition-all ${depositRequired ? 'left-[22px]' : 'left-0.5'}`} />
          </span>
        </label>
      </Section>

      {/* Team */}
      <Section title={t('Команда')} count={staff.length}>
        <ul className="flex flex-col gap-2">
          {staff.map((m) => (
            <li key={m.id} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
              <Avatar src={m.photo} name={m.name} />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-foreground">{t(m.name)}</div>
                <div className="text-sm text-muted-foreground">{t(m.specialty)} · {t(m.schedule)}</div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-foreground">
                <Icon name="star" className="h-4 w-4 text-primary" /> {m.rating.toFixed(1)}
              </span>
            </li>
          ))}
        </ul>
        {staffForm ? (
          <div className="flex flex-col gap-3 rounded-xl border border-primary/40 bg-primary/5 p-3">
            <Label text={t('Имя мастера')}>
              <input value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} className={inputCls} />
            </Label>
            <Label text={t('Телефон')}>
              <div className="flex items-center rounded-xl border border-border bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <span className="border-r border-border py-3 pl-4 pr-3 font-medium text-foreground">+7</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({ ...staffForm, phone: digits(e.target.value).slice(0, 10) })}
                  placeholder="700 000 00 00"
                  className="w-full min-w-0 bg-transparent px-3 py-3 text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </Label>
            <Label text={t('График работы')}>
              <select value={staffForm.schedule} onChange={(e) => setStaffForm({ ...staffForm, schedule: e.target.value })} className={`${inputCls} appearance-none`}>
                {SCHEDULES.map((s) => (
                  <option key={s} value={s}>{t(s)}</option>
                ))}
              </select>
            </Label>
            <FormActions onCancel={() => setStaffForm(null)} onSave={saveStaff} disabled={!staffValid} saveLabel={t('Добавить')} />
          </div>
        ) : (
          <button
            onClick={() => setStaffForm({ name: '', phone: '', schedule: SCHEDULES[0] })}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-medium text-primary-foreground transition active:scale-[0.98]"
          >
            <Icon name="plus" className="h-5 w-5 shrink-0" /> {t('Добавить мастера')}
          </button>
        )}
      </Section>

      {/* Retail inventory */}
      <Section title={t('Магазин и склад')} count={products.length}>
        <ul className="flex flex-col gap-2">
          {products.map((p) => (
            <li key={p.id} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
              <Avatar src={p.photo} name={p.name} rounded="rounded-xl" size="h-14 w-14" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-xs text-muted-foreground">{p.brand}</span>
                <span className="font-semibold leading-snug text-foreground">{t(p.name)}</span>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                  <span className={`rounded-full px-2 py-0.5 ${p.stock <= 3 ? 'bg-primary/10 text-primary' : 'bg-card text-secondary-foreground'}`}>
                    {p.stock <= 3 ? t('Мало: {n} шт.', { n: p.stock }) : t('На складе: {n} шт.', { n: p.stock })}
                  </span>
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-accent">👑 {t('Кешбэк {n}%', { n: p.cashback })}</span>
                </div>
              </div>
              <span className="shrink-0 font-semibold text-foreground">{formatPrice(p.price)}</span>
            </li>
          ))}
        </ul>
        {productForm ? (
          <div className="flex flex-col gap-3 rounded-xl border border-primary/40 bg-primary/5 p-3">
            <label className="flex cursor-pointer items-center gap-3">
              {productForm.photo ? (
                <img src={productForm.photo} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-primary/50 bg-card text-primary">
                  <Icon name="plus" className="h-6 w-6" />
                </span>
              )}
              <span className="text-sm">
                <span className="block font-medium text-foreground">{t('Фото товара')}</span>
                <span className="text-muted-foreground">{t('JPG или PNG')}</span>
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => readPhoto(e.target.files?.[0], (photo) => setProductForm((f) => f && { ...f, photo }))} />
            </label>
            <Label text={t('Название товара')}>
              <input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className={inputCls} />
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Label text={t('Цена, ₸')}>
                <input inputMode="numeric" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: digits(e.target.value).slice(0, 7) })} className={inputCls} />
              </Label>
              <Label text={t('Остаток, шт.')}>
                <input inputMode="numeric" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: digits(e.target.value).slice(0, 4) })} className={inputCls} />
              </Label>
            </div>
            <FormActions onCancel={() => setProductForm(null)} onSave={saveProduct} disabled={!productValid} saveLabel={t('Добавить')} />
          </div>
        ) : (
          <AddButton onClick={() => setProductForm({ name: '', price: '', stock: '', photo: null })}>{t('Добавить товар в магазин')}</AddButton>
        )}
      </Section>
    </div>
  )
}
