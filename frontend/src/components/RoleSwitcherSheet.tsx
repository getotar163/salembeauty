import { useEffect, useState } from 'react'

type Role = 'client' | 'business' | 'worker'

export default function RoleSwitcherSheet({
  activeRole,
  hasBusiness = false,
  hasWorker = false,
  onSwitch,
  onRegisterBusiness,
  onClose,
}: {
  activeRole: Role
  hasBusiness?: boolean
  hasWorker?: boolean
  onSwitch: (role: Role) => void
  onRegisterBusiness: () => void
  onClose: () => void
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && handleClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleClose = () => {
    setShow(false)
    setTimeout(onClose, 300)
  }

  const handleSelect = (r: Role) => {
    onSwitch(r)
    handleClose()
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#1c1917]/30 transition-opacity" onClick={handleClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-[430px] rounded-t-2xl bg-card transition-transform duration-300 ease-out ${
          show ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex flex-col gap-4 p-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
          <div className="mx-auto h-1 w-12 rounded-full bg-border" />
          <h2 className="font-serif text-xl leading-tight text-foreground">Сменить рабочее пространство</h2>
          
          <div className="flex flex-col gap-2">
            {/* Option 1: Client */}
            <button
              onClick={() => handleSelect('client')}
              className={`flex w-full items-center gap-3 rounded-2xl p-4 text-left transition hover:bg-secondary/60 active:scale-[0.99] ${
                activeRole === 'client' ? 'border-2 border-[#1A382B] bg-[#1A382B]/5' : 'border border-border bg-card'
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#1A382B]/10 text-[#1A382B]">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M12 12a5 5 0 110-10 5 5 0 010 10zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-foreground">Личный профиль</div>
                <div className="truncate text-xs text-muted-foreground">Бронирования, избранное, косметика, баланс</div>
              </div>
              {activeRole === 'client' && <div className="text-[#1A382B]">✓</div>}
            </button>

            {hasBusiness && (
              <button
                onClick={() => handleSelect('business')}
                className={`flex w-full items-center gap-3 rounded-2xl p-4 text-left transition hover:bg-secondary/60 active:scale-[0.99] ${
                  activeRole === 'business' ? 'border-2 border-[#1A382B] bg-[#1A382B]/5' : 'border border-border bg-card'
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#1A382B] text-white">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9.5L5.5 4h13L20 9.5M4 9.5a2.7 2.7 0 005.3 0 2.7 2.7 0 005.4 0 2.7 2.7 0 005.3 0M4 9.5V20h16V9.5M10 20v-5h4v5"/></svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-foreground">Бизнес: Мой салон</div>
                  <div className="truncate text-xs text-muted-foreground">Управление, прайс-лист, товары, депозиты</div>
                </div>
                {activeRole === 'business' && <div className="text-[#1A382B]">✓</div>}
              </button>
            )}
          </div>

          <div className="mt-2 flex flex-col gap-2">
            <button
              onClick={() => handleSelect('worker')}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#B85834]/50 py-3.5 font-medium text-[#B85834] transition hover:bg-[#B85834]/5 active:scale-[0.99]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>
              Ищу работу (Вакансии)
            </button>
            
            <button
              onClick={() => {
                handleClose()
                setTimeout(onRegisterBusiness, 300)
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#1A382B]/50 py-3.5 font-medium text-[#1A382B] transition hover:bg-[#1A382B]/5 active:scale-[0.99]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Зарегистрировать новый салон или магазин
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
