import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n'

type Msg = { id: number; from: 'me' | 'system' | 'agent'; text: string; time: string }

export default function StaffSupportModal({ onClose }: { onClose: () => void }) {
  const { t } = useT()
  const [text, setText] = useState('')
  const [file, setFile] = useState<string | null>(null)
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      from: 'system',
      text: 'Здравствуйте, Данияр! Вы обратились в линию поддержки партнеров. Чем помочь по текущей смене?',
      time: '10:00',
    }
  ])
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

  const send = (override?: string) => {
    const body = override || [text.trim(), file && `📎 ${file}`].filter(Boolean).join('\n')
    if (!body) return
    setMessages((m) => [...m, { id: Date.now(), from: 'me', text: body, time: '10:05' }])
    setText('')
    setFile(null)
    setTimeout(
      () =>
        setMessages((m) => [
          ...m,
          { id: Date.now() + 1, from: 'agent', text: 'Принято. Оператор подключится через пару минут.', time: '10:05' },
        ]),
      900,
    )
  }

  const chips = [
    'Клиент не пришел (Списание депозита 1 000 ₸)',
    'Ошибка в календаре / накладка по времени',
    'Вопрос по выплатам и проценту салона',
    'Связаться с куратором платформы SalemBeauty',
  ]

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#1c1917]/30 sm:items-end sm:justify-end sm:p-6" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-[85dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-3xl bg-[#FAF8F5] shadow-2xl sm:w-[400px] sm:rounded-3xl"
      >
        {/* Header */}
        <div className="flex flex-col gap-1 border-b border-border bg-card p-4 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl leading-tight text-foreground">Поддержка и безопасность</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition hover:bg-secondary/80 active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#1A382B]" />
            <span className="text-xs font-medium text-muted-foreground">Сотрудник / Мастер Данияр • Chop-Chop Studio</span>
          </div>
          <div className="mt-1 flex w-fit items-center gap-1.5 rounded-full bg-[#B85834]/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#B85834]">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Партнерская линия • Ответ до 3 мин
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-1 flex-col overflow-y-auto p-4 bg-[#FAF8F5]">
          <div className="flex flex-col gap-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex max-w-[85%] flex-col gap-1 ${
                  m.from === 'me' ? 'self-end' : 'self-start'
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 text-[15px] leading-snug shadow-sm ${
                    m.from === 'me'
                      ? 'rounded-tr-sm bg-[#B85834] text-white'
                      : m.from === 'system'
                      ? 'rounded-tl-sm bg-[#1A382B] text-white'
                      : 'rounded-tl-sm border border-border bg-card text-foreground'
                  }`}
                >
                  {m.text}
                </div>
                <span className={`text-[10px] text-muted-foreground ${m.from === 'me' ? 'text-right' : 'text-left'}`}>
                  {m.time}
                </span>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Quick Action Chips */}
          {messages.length === 1 && (
            <div className="mt-6 flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Быстрые действия</span>
              {chips.map((c) => (
                <button
                  key={c}
                  onClick={() => send(c)}
                  className="w-fit rounded-xl border border-border bg-card px-3 py-2 text-left text-sm text-[#1A382B] shadow-sm transition hover:bg-secondary active:scale-[0.98]"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input Row */}
        <div className="border-t border-border bg-card p-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
          {file && (
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
              📎 {file}
              <button onClick={() => setFile(null)} className="ml-1 text-muted-foreground">×</button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <input ref={fileRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)} />
            
            <div className="flex flex-1 items-center rounded-2xl border border-border bg-background px-4">
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
                placeholder="Сообщение..."
                className="max-h-24 flex-1 resize-none bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>
              </button>
            </div>

            <button
              onClick={() => send()}
              disabled={!text.trim() && !file}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#B85834] text-white transition active:scale-95 disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 ml-1" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
