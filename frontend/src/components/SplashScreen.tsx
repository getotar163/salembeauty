import { useEffect, useState } from 'react'

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [state, setState] = useState<'initial' | 'resolved'>('initial')

  useEffect(() => {
    // Frame 1 -> Frame 2 via After delay: 600ms
    const timer1 = setTimeout(() => setState('resolved'), 600)
    // Navigate to Home after 500ms ease-out + 1000ms looking at it
    const timer2 = setTimeout(onComplete, 2100)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAF8F5]">
      {/* Subtle radial glow when resolved */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          state === 'resolved' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle at center, rgba(184,88,52,0.15) 0%, rgba(250,248,245,0) 50%)',
        }}
      />
      
      {/* Centered minimal screen */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6">
        {/* SalemBeauty brand symbol in terracotta */}
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#B85834] text-white shadow-xl transition-all duration-700 ease-out ${
            state === 'initial' ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          <span className="font-serif text-[40px] leading-none">S</span>
        </div>
        
        {/* Clean tagline below */}
        <div
          className={`font-serif text-[22px] tracking-wide text-[#1c1917] transition-all duration-700 delay-200 ease-out ${
            state === 'initial' ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          Красота, запись и стиль в один клик
        </div>
      </div>

      {/* Bottom subtle loading progress bar */}
      <div className="absolute bottom-12 w-48 overflow-hidden rounded-full bg-[#e5ded6] h-1.5">
        <div
          className={`h-full bg-[#B85834] transition-all duration-[1200ms] ease-out ${
            state === 'initial' ? 'w-0' : 'w-full'
          }`}
        />
      </div>
    </div>
  )
}
