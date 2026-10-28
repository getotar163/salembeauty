import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n'
import { Icon } from './ui'

/* ---------- Data ---------- */

type Category = 'all' | 'bookings' | 'shop'
type Msg =
  | { id: number; from: 'me' | 'them'; kind: 'text'; text: string; time: string; read?: boolean }
  | { id: number; from: 'me'; kind: 'image'; src: string; time: string; read?: boolean }
  | { id: number; from: 'me'; kind: 'voice'; seconds: number; time: string; read?: boolean }
  | { id: number; from: 'them'; kind: 'confirm'; address: string; time: string }

type Thread = {
  id: string
  category: Exclude<Category, 'all'>
  name: string
  title: string
  avatar: string
  roundedAvatar: boolean
  verified?: boolean
  online?: boolean
  context: string
  time: string
  unread: number
  pinned?: { service: string; when: string; thumb: string }
  replies: string[]
  messages: Msg[]
}

const THREADS: Thread[] = [
  {
    id: 'daniyar',
    category: 'bookings',
    name: 'Chop-Chop Barbershop (Мастер Данияр)',
    title: 'Барбер Данияр • Brutal Barber',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    roundedAvatar: true,
    verified: true,
    online: true,
    context: 'Запись на 15:00 • Депозит 1 000 ₸',
    time: '14:15',
    unread: 2,
    pinned: {
      service: 'Мужская стрижка Fade + Моделирование бороды',
      when: 'Сегодня, 18:30',
      thumb: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=200&h=200&fit=crop',
    },
    replies: ['Опаздываю на 10 мин', 'Как добраться?', 'Отправить фото прически'],
    messages: [
      { id: 1, from: 'them', kind: 'text', text: 'Салам! Ваше кресло готово. Будете пить кофе или чай перед стрижкой?', time: '14:02' },
      { id: 2, from: 'them', kind: 'confirm', address: 'ул. Панфилова, 98, Алматы', time: '14:03' },
      { id: 3, from: 'me', kind: 'text', text: 'Отлично, буду ровно к 18:30, спасибо!', time: '14:05', read: true },
      { id: 4, from: 'them', kind: 'text', text: 'Ждем вас сегодня! Инструменты подготовлены.', time: '14:15' },
    ],
  },
  {
    id: 'beard',
    category: 'shop',
    name: 'Beard & Care Cosmetics Store',
    title: 'Beard & Care Cosmetics Store',
    avatar: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=200&h=200&fit=crop',
    roundedAvatar: false,
    verified: true,
    context: 'Заказ #3412 • Доставка',
    time: 'Вчера',
    unread: 0,
    replies: ['Где мой заказ?', 'Можно сменить адрес?', 'Спасибо!'],
    messages: [
      { id: 1, from: 'me', kind: 'text', text: 'Здравствуйте! Когда отправите заказ #3412?', time: '11:40', read: true },
      { id: 2, from: 'them', kind: 'text', text: 'Масло для бороды и воск отправили курьером.', time: '12:10' },
    ],
  },
  {
    id: 'kamila',
    category: 'bookings',
    name: 'Камила (Уход за лицом)',
    title: 'Камила • Уход за лицом',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    roundedAvatar: true,
    context: 'Консультация',
    time: '12 окт',
    unread: 0,
    replies: ['Спасибо, изучу!', 'Можно записаться?', 'Какой крем посоветуете?'],
    messages: [
      { id: 1, from: 'me', kind: 'text', text: 'Камила, подскажите, как ухаживать за кожей после чистки?', time: '18:20', read: true },
      { id: 2, from: 'them', kind: 'text', text: 'Прикрепила рекомендации по домашнему уходу.', time: '18:45' },
    ],
  },
]

const AUTO_REPLY: Record<string, string> = {
  'Опаздываю на 10 мин': 'Без проблем, подождём! Аккуратно на дороге 🙏',
  'Как добраться?': 'Мы на ул. Панфилова, 98 — вход со двора, рядом есть парковка.',
  'Где мой заказ?': 'Курьер уже в пути, доставит сегодня до 18:00.',
}

const now = () => new Date().toTimeString().slice(0, 5)

/* ---------- Small icons ---------- */

const Svg = ({ d, className = 'h-5 w-5', fill = false }: { d: string; className?: string; fill?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className} fill={fill ? 'currentColor' : 'none'} stroke={fill ? 'none' : 'currentColor'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)
const ICON = {
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  info: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v5M12 8h.01',
  mic: 'M12 15a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3zM19 11a7 7 0 01-14 0M12 18v3',
  send: 'M3.4 20.4l17.5-7.5a1 1 0 000-1.8L3.4 3.6a.9.9 0 00-1.3 1L4 11l9 1-9 1-1.9 6.4a.9.9 0 001.3 1z',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4',
}

function Ticks({ read, className = '' }: { read?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 20 12" className={`h-3 w-5 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label={read ? 'read' : 'sent'}>
      <path d="M1 6.5l3.5 3.5L11 2" />
      {read && <path d="M8 9.5l.5.5L15 2" />}
    </svg>
  )
}

function Verified() {
  return (
    <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground">
      <Icon name="check" className="h-3 w-3" />
    </span>
  )
}

/* ---------- Inbox ---------- */

export default function Chats() {
  const { t } = useT()
  const [threads, setThreads] = useState(THREADS)
  const [cat, setCat] = useState<Category>('all')
  const [q, setQ] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  const unreadTotal = threads.reduce((s, th) => s + th.unread, 0)
  const query = q.trim().toLowerCase()
  const visible = threads.filter(
    (th) => (cat === 'all' || th.category === cat) && (!query || t(th.name).toLowerCase().includes(query) || t(th.context).toLowerCase().includes(query)),
  )
  const open = threads.find((th) => th.id === openId)

  const update = (id: string, fn: (th: Thread) => Thread) => setThreads((list) => list.map((th) => (th.id === id ? fn(th) : th)))

  return (
    <div className="flex flex-col gap-4 px-4 pb-8 pt-5">
      <header className="flex items-center gap-2">
        <h1 className="font-serif text-[2rem] leading-tight text-foreground">{t('Сообщения')}</h1>
        {unreadTotal > 0 && (
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-sm font-semibold text-primary-foreground">{unreadTotal}</span>
        )}
      </header>

      <label className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <Svg d={ICON.search} className="h-5 w-5 shrink-0 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('Поиск по мастерам, барбершопам и магазинам...')}
          className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div role="tablist" className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
        {(
          [
            ['all', 'Все'],
            ['bookings', 'Записи к мастерам'],
            ['shop', 'Покупки и товары'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={cat === id}
            onClick={() => setCat(id)}
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition active:scale-95 ${
              cat === id ? 'bg-primary text-primary-foreground shadow-sm' : 'border border-border bg-card text-secondary-foreground'
            }`}
          >
            {t(label)}
          </button>
        ))}
      </div>

      <ul className="flex flex-col gap-3">
        {visible.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">{t('Ничего не найдено')}</li>
        )}
        {visible.map((th) => {
          const last = th.messages[th.messages.length - 1]
          const preview =
            last.kind === 'text' ? t(last.text) : last.kind === 'image' ? '📷 ' + t('Фото') : last.kind === 'voice' ? '🎙 ' + t('Голосовое сообщение') : t('Карточка записи подтверждена')
          return (
            <li key={th.id}>
              <button
                onClick={() => {
                  setOpenId(th.id)
                  update(th.id, (x) => ({ ...x, unread: 0 }))
                }}
                className="flex w-full items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition active:scale-[0.99]"
              >
                <span className="relative shrink-0">
                  <img src={th.avatar} alt="" className={`h-14 w-14 bg-muted object-cover ${th.roundedAvatar ? 'rounded-full' : 'rounded-2xl'}`} />
                  {th.verified && <Verified />}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex items-start gap-2">
                    <span className={`flex-1 leading-snug text-foreground ${th.unread ? 'font-semibold' : 'font-medium'}`}>{t(th.name)}</span>
                    <span className={`shrink-0 text-xs ${th.unread ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>{t(th.time)}</span>
                  </span>
                  <span className="w-fit rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{t(th.context)}</span>
                  <span className="flex items-start gap-2">
                    {last.from === 'me' && <Ticks read={'read' in last && last.read} className="mt-1 shrink-0 text-primary" />}
                    <span className={`flex-1 text-sm leading-snug ${th.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{preview}</span>
                    {th.unread > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">{th.unread}</span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {open && (
        <Conversation
          thread={open}
          onBack={() => setOpenId(null)}
          onSend={(m) => update(open.id, (x) => ({ ...x, messages: [...x.messages, m], time: m.time }))}
        />
      )}
    </div>
  )
}

/* ---------- Conversation ---------- */

function Conversation({ thread, onBack, onSend }: { thread: Thread; onBack: () => void; onSend: (m: Msg) => void }) {
  const { t } = useT()
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const [recording, setRecording] = useState<number | null>(null)
  const [details, setDetails] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread.messages.length, typing])

  useEffect(() => {
    if (recording === null) return
    const id = setInterval(() => setRecording((s) => (s === null ? s : s + 1)), 1000)
    return () => clearInterval(id)
  }, [recording !== null]) // eslint-disable-line react-hooks/exhaustive-deps

  const reply = (key?: string) => {
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      onSend({ id: Date.now() + 1, from: 'them', kind: 'text', text: (key && AUTO_REPLY[key]) || 'Принято, спасибо! 🙌', time: now() })
    }, 1300)
  }

  const sendText = (body: string, key?: string) => {
    const v = body.trim()
    if (!v) return
    onSend({ id: Date.now(), from: 'me', kind: 'text', text: v, time: now(), read: true })
    setText('')
    reply(key)
  }

  const sendPhoto = (f: File | undefined) => {
    if (!f) return
    const r = new FileReader()
    r.onload = () => {
      onSend({ id: Date.now(), from: 'me', kind: 'image', src: String(r.result), time: now(), read: true })
      reply()
    }
    r.readAsDataURL(f)
  }

  const toggleMic = () => {
    if (recording === null) return setRecording(0)
    onSend({ id: Date.now(), from: 'me', kind: 'voice', seconds: Math.max(1, recording), time: now(), read: true })
    setRecording(null)
    reply()
  }

  return (
    <div className="fixed inset-0 z-50 mx-auto flex h-dvh w-full max-w-[430px] flex-col bg-background">
      <div className="h-[env(safe-area-inset-top)]" />

      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-3 py-2.5">
        <button onClick={onBack} aria-label={t('Назад')} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground transition hover:bg-secondary active:scale-95">
          <Icon name="arrow-left" className="h-5 w-5" />
        </button>
        <span className="relative shrink-0">
          <img src={thread.avatar} alt="" className={`h-10 w-10 bg-muted object-cover ${thread.roundedAvatar ? 'rounded-full' : 'rounded-xl'}`} />
          {thread.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-[#2EAD5B]" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-semibold leading-tight text-foreground">{t(thread.title)}</div>
          <div className="text-xs text-muted-foreground">
            {typing ? <span className="text-primary">{t('Печатает…')}</span> : thread.online ? t('В сети • Отвечает в течение 5 мин') : t('Был(а) недавно')}
          </div>
        </div>
        <a href="tel:+77273000000" aria-label={t('Позвонить')} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground transition hover:bg-secondary active:scale-95">
          <Svg d={ICON.phone} />
        </a>
        <button onClick={() => setDetails((v) => !v)} aria-label={t('Детали')} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground transition hover:bg-secondary active:scale-95">
          <Svg d={ICON.info} />
        </button>
      </div>

      {/* Pinned context */}
      {thread.pinned && (
        <div className="border-b border-border bg-background/95 px-3 py-2.5 backdrop-blur">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5 shadow-sm">
            <img src={thread.pinned.thumb} alt="" className="h-12 w-12 shrink-0 rounded-xl bg-muted object-cover" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-sm font-semibold leading-snug text-foreground">{t(thread.pinned.service)}</span>
              <span className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">{t(thread.pinned.when)}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 font-semibold text-accent">
                  <Icon name="check" className="h-3 w-3" /> {t('Предоплата 1 000 ₸ оплачена')}
                </span>
              </span>
            </div>
            <button
              onClick={() => setDetails((v) => !v)}
              className="shrink-0 rounded-full border border-primary/50 px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/5 active:scale-95"
            >
              {t('Детали записи')}
            </button>
          </div>
          {details && (
            <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-2xl bg-secondary/60 p-3 text-xs">
              <dt className="text-muted-foreground">{t('Мастер')}</dt>
              <dd className="font-medium text-foreground">{t('Барбер Данияр • Brutal Barber')}</dd>
              <dt className="text-muted-foreground">{t('Адрес')}</dt>
              <dd className="font-medium text-foreground">{t('ул. Панфилова, 98, Алматы')}</dd>
              <dt className="text-muted-foreground">{t('Стоимость')}</dt>
              <dd className="font-medium text-foreground">12 000 ₸ · {t('к оплате в салоне')} 11 000 ₸</dd>
            </dl>
          )}
        </div>
      )}

      {/* Feed */}
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-4">
        <div className="self-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">{t('Сегодня')}</div>
        {thread.messages.map((m) => {
          if (m.kind === 'confirm')
            return (
              <div key={m.id} className="flex w-[85%] flex-col gap-2 self-start rounded-2xl rounded-tl-md border border-accent/25 bg-card p-3.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <span className="font-semibold leading-tight text-foreground">{t('Карточка записи подтверждена')}</span>
                </div>
                <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                  <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {t(m.address)}
                </p>
                <span className="self-end text-[11px] text-muted-foreground">{m.time}</span>
              </div>
            )
          const mine = m.from === 'me'
          return (
            <div
              key={m.id}
              className={`flex max-w-[80%] flex-col gap-1 rounded-2xl shadow-sm ${
                mine ? 'self-end rounded-tr-md bg-primary text-primary-foreground' : 'self-start rounded-tl-md border border-border bg-card text-foreground'
              } ${m.kind === 'image' ? 'p-1.5' : 'px-3.5 py-2.5'}`}
            >
              {m.kind === 'text' && <span className="text-[15px] leading-snug">{t(m.text)}</span>}
              {m.kind === 'image' && <img src={m.src} alt="" className="max-h-60 rounded-xl object-cover" />}
              {m.kind === 'voice' && (
                <span className="flex items-center gap-2 text-sm">
                  <Svg d={ICON.mic} className="h-4 w-4" />
                  <span className="flex h-4 items-end gap-0.5" aria-hidden="true">
                    {[6, 12, 8, 14, 10, 16, 7, 12, 9, 13, 6].map((h, i) => (
                      <span key={i} className="w-0.5 rounded-full bg-current opacity-80" style={{ height: h }} />
                    ))}
                  </span>
                  0:{String(m.seconds).padStart(2, '0')}
                </span>
              )}
              <span className={`flex items-center justify-end gap-1 text-[11px] ${mine ? 'text-primary-foreground/80' : 'text-muted-foreground'} ${m.kind === 'image' ? 'px-2 pb-1' : ''}`}>
                {m.time}
                {mine && <Ticks read={m.read} />}
              </span>
            </div>
          )
        })}
        {typing && (
          <div className="flex items-center gap-1.5 self-start rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 shadow-sm">
            {[0, 150, 300].map((d) => (
              <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${d}ms` }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick replies + composer */}
      <div className="border-t border-border bg-card pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5">
        <div className="flex gap-2 overflow-x-auto px-3 pb-2.5 [scrollbar-width:none]">
          {thread.replies.map((r) => (
            <button
              key={r}
              onClick={() => (r === 'Отправить фото прически' ? fileRef.current?.click() : sendText(t(r), r))}
              className="shrink-0 whitespace-nowrap rounded-full border border-primary/40 bg-background px-3.5 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/5 active:scale-95"
            >
              {t(r)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3">
          <button
            onClick={() => fileRef.current?.click()}
            aria-label={t('Прикрепить фото')}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition active:scale-95"
          >
            <Icon name="plus" className="h-5 w-5" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => sendPhoto(e.target.files?.[0])} />
          {recording !== null ? (
            <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full bg-primary/10 px-4 text-sm font-medium text-primary">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
              {t('Запись')} 0:{String(recording).padStart(2, '0')}
              <button onClick={() => setRecording(null)} className="ml-auto text-xs font-semibold text-muted-foreground">{t('Отмена')}</button>
            </div>
          ) : (
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  sendText(text)
                }
              }}
              placeholder={t('Сообщение мастеру или магазину...')}
              className="h-11 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          )}
          {!text.trim() && (
            <button
              onClick={toggleMic}
              aria-label={t('Голосовое сообщение')}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition active:scale-95 ${recording !== null ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
            >
              <Svg d={ICON.mic} />
            </button>
          )}
          <button
            onClick={() => (recording !== null ? toggleMic() : sendText(text))}
            disabled={!text.trim() && recording === null}
            aria-label={t('Отправить')}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition active:scale-95 disabled:opacity-50"
          >
            <Svg d={ICON.send} fill />
          </button>
        </div>
      </div>
    </div>
  )
}
