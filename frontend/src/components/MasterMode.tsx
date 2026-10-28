import { useMemo, useState } from 'react'
import {
  districts,
  employmentLabel,
  paymentLabel,
  specialties,
  vacancies,
} from '../data'
import type { Employment, Payment, Vacancy } from '../data'
import { Chip, Icon, VenueBadge } from './ui'
import { useT } from '../i18n'

type WorkerTab = 'vacancies' | 'applications' | 'chat' | 'profile'

export default function MasterMode({ tab }: { tab: WorkerTab }) {
  const { t } = useT()
  const [selected, setSelected] = useState<Vacancy | null>(null)
  const [applied, setApplied] = useState<Set<string>>(new Set())

  const apply = (id: string) => setApplied((prev) => new Set(prev).add(id))

  if (tab === 'applications') {
    return <ApplicationsTab applied={applied} onOpen={setSelected} selected={selected} onBack={() => setSelected(null)} apply={apply} />
  }
  if (tab === 'chat') return <PlaceholderTab title={t('Чат с салонами')} hint={t('Здесь появятся переписки с заведениями, куда вы откликнулись.')} icon="chat" />
  if (tab === 'profile') return <ProfileTab />

  if (selected) {
    return (
      <VacancyDetail
        vacancy={selected}
        applied={applied.has(selected.id)}
        onApply={() => apply(selected.id)}
        onBack={() => setSelected(null)}
      />
    )
  }

  return <VacancyFeed onOpen={setSelected} applied={applied} onApply={apply} />
}

function VacancyFeed({
  onOpen,
  applied,
  onApply,
}: {
  onOpen: (v: Vacancy) => void
  applied: Set<string>
  onApply: (id: string) => void
}) {
  const { t } = useT()
  const [query, setQuery] = useState('')
  const [spec, setSpec] = useState<string | null>(null)
  const [district, setDistrict] = useState(districts[0])
  const [employment, setEmployment] = useState<Employment | ''>('')
  const [payment, setPayment] = useState<Payment | ''>('')
  const [showFilters, setShowFilters] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return vacancies.filter((v) => {
      if (spec && v.specialty !== spec) return false
      if (district !== districts[0] && v.district !== district) return false
      if (employment && v.employment !== employment) return false
      if (payment && v.payment !== payment) return false
      if (!q) return true
      return (
        v.salon.toLowerCase().includes(q) ||
        t(v.salon).toLowerCase().includes(q) ||
        v.specialty.toLowerCase().includes(q) ||
        t(v.specialty).toLowerCase().includes(q) ||
        v.district.toLowerCase().includes(q) ||
        t(v.district).toLowerCase().includes(q)
      )
    })
  }, [query, spec, district, employment, payment, t])

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-28 pt-6">
      <div className="relative">
        <Icon
          name="search"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('Найди вакансию — специализация, салон или район')}
          className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-4 text-base shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Specialty chips */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        <Chip active={spec === null} onClick={() => setSpec(null)}>
          {t('Все')}
        </Chip>
        {specialties.map((s) => (
          <Chip key={s} active={spec === s} onClick={() => setSpec(spec === s ? null : s)}>
            {t(s)}
          </Chip>
        ))}
      </div>

      {/* Filter toggle */}
      <button
        onClick={() => setShowFilters((s) => !s)}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-secondary-foreground hover:text-foreground"
      >
        <Icon name="sliders" className="h-4 w-4" /> {t('Фильтры')}
      </button>

      {showFilters && (
        <div className="mt-3 grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-3">
          <Field label={t('Район')}>
            <Select value={district} onChange={setDistrict} options={districts} render={(v) => t(v)} />
          </Field>
          <Field label={t('Тип занятости')}>
            <Select
              value={employment}
              onChange={(v) => setEmployment(v as Employment | '')}
              options={['', ...Object.keys(employmentLabel)]}
              render={(v) => (v ? t(employmentLabel[v as Employment]) : t('Любая'))}
            />
          </Field>
          <Field label={t('Формат оплаты')}>
            <Select
              value={payment}
              onChange={(v) => setPayment(v as Payment | '')}
              options={['', ...Object.keys(paymentLabel)]}
              render={(v) => (v ? t(paymentLabel[v as Payment]) : t('Любой'))}
            />
          </Field>
        </div>
      )}

      <h2 className="mb-4 mt-8 font-serif text-2xl text-foreground">
        {t('Вакансии')}
        <span className="ml-2 align-middle text-sm font-sans text-muted-foreground">
          {results.length}
        </span>
      </h2>

      {results.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground">
          {t('Вакансий не найдено. Попробуйте смягчить фильтры.')}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {results.map((v) => (
            <VacancyCard
              key={v.id}
              vacancy={v}
              applied={applied.has(v.id)}
              onOpen={() => onOpen(v)}
              onApply={() => onApply(v.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function VacancyCard({
  vacancy: v,
  applied,
  onOpen,
  onApply,
}: {
  vacancy: Vacancy
  applied: boolean
  onOpen: () => void
  onApply: () => void
}) {
  const { t } = useT()
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:shadow-md">
      <button onClick={onOpen} className="flex items-start gap-3 text-left">
        <img
          src={v.logo}
          alt={v.salon}
          className="h-12 w-12 flex-shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="font-semibold leading-snug text-foreground">{t(v.salon)}</h3>
            <VenueBadge type={v.venueType} />
          </div>
          <p className="mt-0.5 font-medium text-primary">{t(v.specialty)}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{t('{n} дн. назад', { n: v.postedDaysAgo })}</p>
        </div>
      </button>

      <dl className="flex flex-col gap-2 rounded-xl bg-secondary/50 p-3 text-sm">
        <Detail icon="wallet" text={t(v.payDetail)} />
        <Detail icon="briefcase" text={t(employmentLabel[v.employment])} />
        <Detail icon="calendar" text={t(v.schedule)} />
        <Detail icon="pin" text={t(v.district)} />
      </dl>

      <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpen}
            className="rounded-full border border-border px-3 py-2.5 text-sm font-medium text-secondary-foreground transition hover:border-primary/50 hover:text-foreground"
          >
            {t('Подробнее')}
          </button>
          <button
            onClick={onApply}
            disabled={applied}
            className={`rounded-full px-3 py-2.5 text-sm font-medium transition ${
              applied
                ? 'bg-accent/10 text-accent'
                : 'bg-primary text-primary-foreground hover:brightness-95'
            }`}
          >
            {applied ? (
              <span className="inline-flex items-center gap-1">
                <Icon name="check" className="h-4 w-4" /> {t('Отклик отправлен')}
              </span>
            ) : (
              t('Откликнуться')
            )}
          </button>
      </div>
    </div>
  )
}

function Detail({ icon, text }: { icon: 'wallet' | 'briefcase' | 'calendar' | 'pin'; text: string }) {
  return (
    <div className="flex items-start gap-2 text-muted-foreground">
      <Icon name={icon} className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
      <span className="leading-snug text-foreground">{text}</span>
    </div>
  )
}

function VacancyDetail({
  vacancy: v,
  applied,
  onApply,
  onBack,
}: {
  vacancy: Vacancy
  applied: boolean
  onApply: () => void
  onBack: () => void
}) {
  const { t } = useT()
  return (
    <div className="w-full px-5 pb-40 pt-4">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <Icon name="arrow-left" className="h-4 w-4" /> {t('К вакансиям')}
      </button>

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-muted">
          <img src={v.cover} alt={v.salon} className="h-full w-full object-cover" />
        </div>
        <div className="p-6">
          <div className="flex items-start gap-3">
            <img src={v.logo} alt={v.salon} className="h-14 w-14 rounded-2xl object-cover" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl text-foreground">{t(v.salon)}</h1>
                <VenueBadge type={v.venueType} />
              </div>
              <p className="mt-0.5 font-medium text-primary">{t(v.specialty)}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t(v.district)}, {t(v.city)}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Fact icon="wallet" label={t('Оплата')} value={t(v.payDetail)} />
            <Fact icon="briefcase" label={t('Занятость')} value={t(employmentLabel[v.employment])} />
            <Fact icon="calendar" label={t('График')} value={t(v.schedule)} />
          </div>

          <h2 className="mt-8 font-serif text-xl text-foreground">{t('Описание')}</h2>
          <p className="mt-2 leading-relaxed text-secondary-foreground">{t(v.description)}</p>

          <h2 className="mt-6 font-serif text-xl text-foreground">{t('Требования')}</h2>
          <ul className="mt-2 space-y-2">
            {v.requirements.map((r) => (
              <li key={r} className="flex items-start gap-2 text-secondary-foreground">
                <Icon name="check" className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                {t(r)}
              </li>
            ))}
          </ul>

          <h2 className="mt-6 font-serif text-xl text-foreground">
            {t('Отзывы мастеров о салоне')}
          </h2>
          {v.reviews.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {t('Пока нет отзывов от других мастеров.')}
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {v.reviews.map((r, i) => (
                <div key={i} className="rounded-2xl border border-border bg-background/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{t(r.author)}</span>
                    <span className="inline-flex items-center gap-1 text-sm">
                      <Icon name="star" className="h-3.5 w-3.5 fill-primary text-primary" />
                      {r.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-secondary-foreground">{t(r.text)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-[calc(60px+env(safe-area-inset-bottom))] left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <button className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary-foreground hover:text-foreground">
            <Icon name="chat" className="h-4 w-4" /> {t('Написать салону')}
          </button>
          <button
            onClick={onApply}
            disabled={applied}
            className={`rounded-full px-6 py-2.5 font-medium transition active:scale-95 ${
              applied
                ? 'bg-accent/10 text-accent'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {applied ? t('Отклик отправлен ✓') : t('Откликнуться')}
          </button>
        </div>
      </div>
    </div>
  )
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: 'wallet' | 'briefcase' | 'calendar'
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon name={icon} className="h-4 w-4" /> {label}
      </div>
      <div className="mt-1 font-semibold text-foreground">{value}</div>
    </div>
  )
}

function ApplicationsTab({
  applied,
  onOpen,
  selected,
  onBack,
  apply,
}: {
  applied: Set<string>
  onOpen: (v: Vacancy) => void
  selected: Vacancy | null
  onBack: () => void
  apply: (id: string) => void
}) {
  const { t } = useT()
  if (selected) {
    return (
      <VacancyDetail
        vacancy={selected}
        applied={applied.has(selected.id)}
        onApply={() => apply(selected.id)}
        onBack={onBack}
      />
    )
  }
  const list = vacancies.filter((v) => applied.has(v.id))
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-28 pt-6">
      <h2 className="mb-4 font-serif text-2xl text-foreground">{t('Мои отклики')}</h2>
      {list.length === 0 ? (
        <PlaceholderBody
          icon="inbox"
          hint={t('Вы ещё никуда не откликнулись. Найдите вакансию на вкладке «Вакансии».')}
        />
      ) : (
        <div className="space-y-3">
          {list.map((v) => (
            <button
              key={v.id}
              onClick={() => onOpen(v)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition hover:shadow-md"
            >
              <img src={v.logo} alt="" className="h-12 w-12 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold text-foreground">{t(v.salon)}</span>
                  <VenueBadge type={v.venueType} />
                </div>
                <p className="text-sm text-primary">{t(v.specialty)}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                <Icon name="check" className="h-3.5 w-3.5" /> {t('Отправлен')}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ProfileTab({ hasResume }: { hasResume?: boolean }) {
  const { t } = useT()

  if (!hasResume) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-5 pb-28 pt-20 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[32px] bg-secondary text-muted-foreground shadow-inner">
          <Icon name="user" className="h-10 w-10" />
        </div>
        <h2 className="font-serif text-2xl text-foreground">Анкета специалиста</h2>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Заполните профиль, укажите специализацию и опыт работы, чтобы откликаться на вакансии салонов.
        </p>
        <button className="mt-8 rounded-2xl bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-sm transition active:scale-95">
          Создать резюме
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-28 pt-6">
      <div className="flex items-center gap-4">
        <img
          src="https://images.unsplash.com/photo-1607503873903-c5e95f80d7b9?w=200&h=200&fit=crop&auto=format"
          alt=""
          className="h-20 w-20 rounded-2xl object-cover"
        />
        <div>
          <h1 className="font-serif text-2xl text-foreground">{t('Айнур Сериковна')}</h1>
          <p className="text-muted-foreground">{t('Мастер маникюра · Алматы')}</p>
        </div>
      </div>

      <h2 className="mt-8 font-serif text-xl text-foreground">{t('Портфолио')}</h2>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          'photo-1604654894610-df63bc536371',
          'photo-1519014816548-bf5fe059798b',
          'photo-1607779097040-26e80aa78e66',
        ].map((id) => (
          <div key={id} className="aspect-square overflow-hidden rounded-xl bg-muted">
            <img
              src={`https://images.unsplash.com/${id}?w=400&h=400&fit=crop&auto=format`}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <h2 className="mt-8 font-serif text-xl text-foreground">{t('Расписание')}</h2>
      <div className="mt-3 space-y-2">
        {[
          ['Пн–Пт', '10:00 – 20:00'],
          ['Сб', '11:00 – 18:00'],
          ['Вс', 'Выходной'],
        ].map(([d, time]) => (
          <div
            key={d}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
          >
            <span className="font-medium text-foreground">{t(d)}</span>
            <span className="text-muted-foreground">{t(time)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlaceholderTab({
  title,
  hint,
  icon,
}: {
  title: string
  hint: string
  icon: 'chat' | 'inbox'
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-28 pt-6">
      <h2 className="mb-4 font-serif text-2xl text-foreground">{title}</h2>
      <PlaceholderBody icon={icon} hint={hint} />
    </div>
  )
}

function PlaceholderBody({ icon, hint }: { icon: 'chat' | 'inbox'; hint: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <Icon name={icon} className="h-7 w-7" />
      </div>
      <p className="max-w-xs text-muted-foreground">{hint}</p>
    </div>
  )
}

// ---- small form primitives ----

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

function Select({
  value,
  onChange,
  options,
  render,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  render?: (v: string) => string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {render ? render(o) : o}
        </option>
      ))}
    </select>
  )
}
