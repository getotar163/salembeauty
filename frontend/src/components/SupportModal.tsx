import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n'

type Msg = { id: number; from: 'me' | 'agent'; text: string }

const PHONE = '+7 727 300 00 00'

/** Floating support dialog: quick channels + a lightweight chat. */
export default function SupportModal({ onClose }: { onClose: () => void }) {
  const { t } = useT()
  const [text, setText] = useState('')
  const [file, setFile] = useState<string | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    const body = [text.trim(), file && `📎 ${file}`].filter(Boolean).join('\n')
    if (!body) return
    setMessages((m) => [...m, { id: Date.now(), from: 'me', text: body }])
    setText('')
    setFile(null)
    setTimeout(
      () =>
        setMessages((m) => [
          ...m,
          { id: Date.now() + 1, from: 'agent', text: t('Спасибо! Оператор уже смотрит ваш вопрос и скоро ответит.') },
        ]),
      900,
    )
  }

  const channels = [
    {
      href: 'https://wa.me/77273000000',
      title: t('Написать в WhatsApp'),
      hint: t('Ответим в мессенджере'),
      icon: (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366] text-white">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 001.8-1.2 2.2 2.2 0 00.1-1.2c0-.1-.2-.2-.5-.3z" />
          </svg>
        </span>
      ),
    },
    {
      href: `tel:${PHONE.replace(/\s/g, '')}`,
      title: t('Позвонить в колл-центр'),
      hint: `${PHONE} · ${t('ежедневно 8:00–23:00')}`,
      icon: (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
          </svg>
        </span>
      ),
    },
    {
      href: '#faq',
      title: t('База знаний и частые вопросы (FAQ)'),
      hint: t('Запись, оплата, бонусы, возвраты'),
      icon: (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5zM4 19a2 2 0 012-2h13" />
          </svg>
        </span>
      ),
    },
  ]

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/30 sm:items-end sm:justify-end sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[88dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-2xl border border-border bg-background shadow-[0_18px_60px_-12px_rgba(60,40,20,0.35)] sm:w-[400px] sm:rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-border p-4">
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="font-serif text-lg leading-none">S</span>
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-[#2EAD5B]" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="support-title" className="font-serif text-xl leading-tight text-foreground">
              {t('Служба поддержки')}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              <span className="font-semibold text-[#2EAD5B]">{t('В сети')}</span> · {t('Обычно отвечает за 5 минут')}
            </p>
          </div>
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

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          {/* Fast channels */}
          <div className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {channels.map((c) => (
              <a
                key={c.title}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="flex items-center gap-3 px-3 py-3 transition active:bg-secondary/60"
              >
                {c.icon}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground">{c.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{c.hint}</div>
                </div>
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-muted-foreground" fill="currentColor" aria-hidden="true">
                  <path d="M9 6l6 6-6 6-1.4-1.4L12.2 12 7.6 7.4z" />
                </svg>
              </a>
            ))}
          </div>

          {/* Chat */}
          <div className="flex min-h-[140px] flex-col gap-2 rounded-2xl bg-secondary/50 p-3">
            <div className="max-w-[85%] self-start rounded-2xl rounded-tl-md bg-card px-3 py-2 text-sm text-foreground shadow-sm">
              {t('Здравствуйте! Чем можем помочь?')}
            </div>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  m.from === 'me'
                    ? 'self-end rounded-tr-md bg-primary text-primary-foreground'
                    : 'self-start rounded-tl-md bg-card text-foreground'
                }`}
              >
                {m.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border bg-card p-3 pb-[calc(12px+env(safe-area-inset-bottom))] sm:pb-3">
          {file && (
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
              📎 {file}
              <button onClick={() => setFile(null)} aria-label={t('Удалить')} className="ml-1 text-muted-foreground">
                ×
              </button>
            </div>
          )}
          <div className="flex items-end gap-2">
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
            <textarea
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder={t('Опишите вашу проблему или вопрос по заказу/записи...')}
              className="max-h-28 min-h-[44px] flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={send}
              disabled={!text.trim() && !file}
              aria-label={t('Отправить')}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition active:scale-95 disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M3.4 20.4l17.5-7.5a1 1 0 000-1.8L3.4 3.6a.9.9 0 00-1.3 1L4 11l9 1-9 1-1.9 6.4a.9.9 0 001.3 1z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
