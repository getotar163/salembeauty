import { useEffect, useState } from 'react'
import { useT } from '../i18n'

type Phase = 'enter' | 'idle'

export default function WelcomeScreen({
  onSignIn,
  onSignUp,
}: {
  onSignIn: () => void
  onSignUp: () => void
}) {
  const { t } = useT()
  const [phase, setPhase] = useState<Phase>('enter')

  useEffect(() => {
    const timer = setTimeout(() => setPhase('idle'), 100)
    return () => clearTimeout(timer)
  }, [])

  const visible = phase === 'idle'

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-background">
      {/* Subtle radial glow */}
      <div
        className={`absolute inset-0 transition-opacity duration-[1200ms] ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background:
            'radial-gradient(ellipse at 50% 35%, rgba(184,88,52,0.10) 0%, rgba(250,248,245,0) 55%)',
        }}
      />

      {/* Main content — centered */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8">
        {/* Logo mark */}
        <div
          className={`flex h-[88px] w-[88px] items-center justify-center rounded-[26px] bg-primary text-primary-foreground shadow-xl transition-all duration-700 ease-out ${
            visible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}
        >
          <span className="font-serif text-[44px] leading-none">S</span>
        </div>

        {/* Brand name */}
        <h1
          className={`mt-5 font-serif text-[28px] leading-tight text-foreground transition-all duration-700 delay-150 ease-out ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          Salem<span className="text-primary">Beauty</span>
        </h1>

        {/* Tagline */}
        <p
          className={`mt-3 max-w-[280px] text-center text-base leading-relaxed text-muted-foreground transition-all duration-700 delay-300 ease-out ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {t('Добро пожаловать!')}
        </p>
        <p
          className={`mt-1 max-w-[280px] text-center text-sm text-muted-foreground transition-all duration-700 delay-[400ms] ease-out ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {t('Красота, запись и стиль — в один клик')}
        </p>

        {/* Feature highlights */}
        <div
          className={`mt-8 flex flex-col gap-3 transition-all duration-700 delay-500 ease-out ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          {[
            ['💇', t('Лучшие мастера и салоны рядом')],
            ['📅', t('Запись в пару касаний')],
            ['👑', t('Бонусы за каждую запись')],
          ].map(([emoji, text]) => (
            <div
              key={text}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 shadow-sm"
            >
              <span className="text-lg">{emoji}</span>
              <span className="text-sm font-medium text-foreground">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA area */}
      <div
        className={`relative z-10 px-6 pb-[calc(32px+env(safe-area-inset-bottom))] transition-all duration-700 delay-[600ms] ease-out ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <button
          onClick={onSignUp}
          className="w-full rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-md transition active:scale-[0.98]"
        >
          {t('Начать')}
        </button>
        <button
          onClick={onSignIn}
          className="mt-3 w-full rounded-2xl border border-border bg-card py-3.5 text-base font-medium text-foreground transition hover:bg-secondary active:scale-[0.98]"
        >
          {t('У меня есть аккаунт')}
        </button>
      </div>
    </div>
  )
}
