import { useMemo, useState } from 'react'
import type { Booking, Master, Service } from '../data'
import { Icon, VenueBadge, formatPrice } from './ui'
import DepositModal, { DEPOSIT_AMOUNT } from './DepositModal'
import { useT, type Lang } from '../i18n'

type Step = 'time' | 'details' | 'confirm' | 'done'

const TIME_SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

const LOCALES: Record<Lang, string> = { KZ: 'kk-KZ', RU: 'ru-RU', EN: 'en-US' }

function buildDays(lang: Lang, t: (ru: string) => string) {
  const locale = LOCALES[lang]
  const today = new Date()
  return Array.from({ length: 10 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const label =
      i === 0 ? 'сегодня' : i === 1 ? 'завтра' : `${d.getDate()} ${MONTHS[d.getMonth()]}`
    const shortLocal =
      i === 0
        ? t('сегодня')
        : i === 1
          ? t('завтра')
          : d.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
    return {
      key: d.toISOString().slice(0, 10),
      dayNum: d.getDate(),
      weekday: WEEKDAYS[d.getDay()],
      full: `${d.getDate()} ${MONTHS[d.getMonth()]}, ${label}`,
      weekdayLocal: d.toLocaleDateString(locale, { weekday: 'short' }),
      fullLocal: `${d.toLocaleDateString(locale, { day: 'numeric', month: 'short' })}, ${shortLocal}`,
      short: shortLocal,
    }
  })
}

const BONUS_PER_BOOKING = 150

export default function BookingFlow({
  master,
  service,
  onClose,
  onConfirm,
}: {
  master: Master
  service: Service | null
  onClose: () => void
  onConfirm: (b: Booking) => void
}) {
  const { t, lang } = useT()
  const days = useMemo(() => buildDays(lang, t), [lang, t])
  const [step, setStep] = useState<Step>('time')
  const [depositOpen, setDepositOpen] = useState(false)
  const [dayKey, setDayKey] = useState(days[0].key)
  const [time, setTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+7 ')
  const [comment, setComment] = useState('')

  const chosen = service ?? master.services[0]
  const day = days.find((d) => d.key === dayKey)!
  const phoneValid = phone.replace(/\D/g, '').length >= 11
  const nameValid = name.trim().length >= 2

  const finish = () => {
    onConfirm({
      id: 'bk' + Date.now(),
      masterId: master.id,
      masterName: master.name,
      venueType: master.venueType,
      photo: master.photo,
      serviceName: chosen.name,
      price: chosen.price,
      date: day.full,
      dateISO: day.key,
      time: time!,
      name: name.trim(),
      phone,
      comment: comment.trim(),
      bonusEarned: BONUS_PER_BOOKING,
    })
    setStep('done')
  }

  return (
    <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-[430px] flex-col bg-background">
      {/* header */}
      <div className="h-[env(safe-area-inset-top)] bg-background" />
      <div className="flex items-center gap-3 px-4 pb-3 pt-3">
        {step !== 'done' && (
          <button
            onClick={() => {
              if (step === 'time') onClose()
              else if (step === 'details') setStep('time')
              else setStep('details')
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground active:scale-95"
          >
            <Icon name="arrow-left" className="h-5 w-5" />
          </button>
        )}
        <div className="flex-1">
          <div className="font-serif text-lg text-foreground">
            {step === 'time' && t('Выбери время')}
            {step === 'details' && t('Ваши данные')}
            {step === 'confirm' && t('Подтверди запись')}
            {step === 'done' && t('Готово!')}
          </div>
          {step !== 'done' && (
            <div className="text-xs text-muted-foreground">
              {t('Шаг {n} из 3', { n: step === 'time' ? 1 : step === 'details' ? 2 : 3 })}
            </div>
          )}
        </div>
        {step !== 'done' && (
          <button
            onClick={onClose}
            className="text-sm font-medium text-muted-foreground active:opacity-60"
          >
            {t('Отмена')}
          </button>
        )}
      </div>

      {/* progress */}
      {step !== 'done' && (
        <div className="flex gap-1.5 px-4 pb-3">
          {(['time', 'details', 'confirm'] as Step[]).map((s, i) => {
            const idx = ['time', 'details', 'confirm'].indexOf(step)
            return (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition ${
                  i <= idx ? 'bg-primary' : 'bg-border'
                }`}
              />
            )
          })}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-32">
        {/* master mini-card (steps 1-3) */}
        {step !== 'done' && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <img src={master.photo} alt="" className="h-12 w-12 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-semibold text-foreground">{t(master.name)}</span>
                <VenueBadge type={master.venueType} />
              </div>
              <span className="text-sm text-muted-foreground">{t(chosen.name)}</span>
            </div>
            <span className="font-semibold text-foreground">{formatPrice(chosen.price)}</span>
          </div>
        )}

        {step === 'time' && (
          <>
            {/* date strip */}
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
              {days.map((d) => {
                const active = d.key === dayKey
                return (
                  <button
                    key={d.key}
                    onClick={() => setDayKey(d.key)}
                    className={`flex min-w-[56px] flex-col items-center rounded-2xl border px-3 py-2 transition ${
                      active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground active:scale-95'
                    }`}
                  >
                    <span
                      className={`text-[11px] ${active ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}
                    >
                      {d.weekdayLocal}
                    </span>
                    <span className="text-lg font-semibold leading-tight">{d.dayNum}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-5 mb-2 text-sm font-medium text-secondary-foreground">
              {t('Свободное время')} · {day.short}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => {
                const active = slot === time
                return (
                  <button
                    key={slot}
                    onClick={() => setTime(slot)}
                    className={`rounded-xl border py-3 text-sm font-medium transition ${
                      active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground active:scale-95'
                    }`}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {step === 'details' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-secondary/60 px-4 py-3 text-sm text-secondary-foreground">
              {t('Первая запись? Оставьте контакты — мы создадим ваш профиль автоматически.')}
            </div>
            <FormField label={t('Имя')}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('Как к вам обращаться')}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </FormField>
            <FormField label={t('Телефон')}>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                placeholder="+7 700 000 00 00"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </FormField>
            <FormField label={t('Комментарий мастеру')}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder={t('Пожелания по услуге')}
                className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </FormField>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-3">
            <SummaryRow icon="user" label={t('Клиент')} value={`${name}, ${phone}`} />
            <SummaryRow icon="calendar" label={t('Дата')} value={day.fullLocal} />
            <SummaryRow icon="clock" label={t('Время')} value={`${time} · ${t('{n} мин', { n: chosen.duration })}`} />
            <SummaryRow icon="wallet" label={t('Стоимость')} value={formatPrice(chosen.price)} />
            {comment && <SummaryRow icon="chat" label={t('Комментарий')} value={comment} />}
            <div className="flex items-center gap-2 rounded-2xl bg-accent/10 px-4 py-3 text-sm text-accent">
              <Icon name="star" className="h-4 w-4 fill-accent" />
              {t('+{n} бонусов за эту запись', { n: BONUS_PER_BOOKING })}
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="flex flex-col items-center pt-10 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/12 text-accent">
              <Icon name="check" className="h-10 w-10" />
            </div>
            <h2 className="mt-5 font-serif text-2xl text-foreground">{t('Вы записаны!')}</h2>
            <p className="mt-1 text-muted-foreground">
              {t('{date} в {time}', { date: day.fullLocal, time: time ?? '' })}
            </p>
            <div className="mt-6 w-full rounded-2xl border border-border bg-card p-4 text-left">
              <div className="flex items-center gap-3">
                <img src={master.photo} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <div>
                  <div className="font-semibold text-foreground">{t(master.name)}</div>
                  <div className="text-sm text-muted-foreground">{t(chosen.name)}</div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent/10 py-3 text-sm font-medium text-accent">
              <Icon name="star" className="h-4 w-4 fill-accent" /> {t('Начислено +{n} бонусов', { n: BONUS_PER_BOOKING })}
            </div>
            <div className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary/10 py-3 text-sm font-medium text-primary">
              <Icon name="check" className="h-4 w-4" />
              {t('Предоплата {n} внесена', { n: formatPrice(Math.min(DEPOSIT_AMOUNT, chosen.price)) })}
            </div>
          </div>
        )}
      </div>

      {/* footer action */}
      <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-card/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        {step === 'time' && (
          <PrimaryButton disabled={!time} onClick={() => setStep('details')}>
            {t('Продолжить')}
          </PrimaryButton>
        )}
        {step === 'details' && (
          <PrimaryButton disabled={!nameValid || !phoneValid} onClick={() => setStep('confirm')}>
            {t('Продолжить')}
          </PrimaryButton>
        )}
        {step === 'confirm' && (
          <PrimaryButton onClick={() => setDepositOpen(true)}>{t('Подтвердить запись')}</PrimaryButton>
        )}
        {step === 'done' && <PrimaryButton onClick={onClose}>{t('Отлично')}</PrimaryButton>}
      </div>
      {depositOpen && (
        <DepositModal
          serviceName={chosen.name}
          masterName={master.name}
          masterPhoto={master.photo}
          dateLabel={day.fullLocal}
          time={time ?? ''}
          price={chosen.price}
          onClose={() => setDepositOpen(false)}
          onPaid={() => {
            setDepositOpen(false)
            finish()
          }}
        />
      )}
    </div>
  )
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-2xl bg-primary py-3.5 font-medium text-primary-foreground transition active:scale-[0.98] disabled:opacity-40"
    >
      {children}
    </button>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-secondary-foreground">{label}</span>
      {children}
    </label>
  )
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: 'user' | 'calendar' | 'clock' | 'wallet' | 'chat'
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3">
      <Icon name={icon} className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium text-foreground">{value}</div>
      </div>
    </div>
  )
}
