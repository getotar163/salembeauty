import type { VenueType } from '../data'
import { venueTypeLabel } from '../data'
import { useT } from '../i18n'

export const formatPrice = (n: number) => n.toLocaleString('ru-RU') + ' ₸'

export function VenueBadge({ type }: { type: VenueType }) {
  const styles: Record<VenueType, string> = {
    salon: 'bg-accent/10 text-accent',
    barbershop: 'bg-foreground/8 text-foreground',
    private: 'bg-primary/10 text-primary',
  }
  const { t } = useT()
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[type]}`}
    >
      {t(venueTypeLabel[type])}
    </span>
  )
}

export function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <Icon name="star" className="h-3.5 w-3.5 fill-primary text-primary" />
      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
      {reviews !== undefined && (
        <span className="text-muted-foreground">({reviews})</span>
      )}
    </span>
  )
}

type IconName =
  | 'star'
  | 'pin'
  | 'search'
  | 'clock'
  | 'wallet'
  | 'calendar'
  | 'arrow-left'
  | 'check'
  | 'home'
  | 'heart'
  | 'chat'
  | 'user'
  | 'briefcase'
  | 'inbox'
  | 'sliders'
  | 'chevron'
  | 'bag'
  | 'grid'
  | 'plus'

const paths: Record<IconName, string> = {
  star: 'M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 17.8 5.9 20.5l1.4-6.8L2.2 9l6.9-.7L12 2z',
  pin: 'M12 21s-7-6.3-7-11a7 7 0 1114 0c0 4.7-7 11-7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  search: 'M11 4a7 7 0 105.29 12.29l4.2 4.2 1.42-1.42-4.2-4.2A7 7 0 0011 4zm0 2a5 5 0 110 10 5 5 0 010-10z',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zm1 4h-2v6l5 3 1-1.7-4-2.4V7z',
  wallet: 'M3 6a2 2 0 012-2h12v2H5v12h14v-3h2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V6zm14 4h4v4h-4a2 2 0 010-4z',
  calendar: 'M7 2v2H5a2 2 0 00-2 2v13a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7zM5 9h14v10H5V9z',
  'arrow-left': 'M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2z',
  check: 'M9 16.2l-3.5-3.5L4 14.2 9 19l11-11-1.5-1.5z',
  home: 'M12 3l9 8h-3v9h-4v-6h-4v6H6v-9H3l9-8z',
  heart: 'M12 21s-7.5-4.9-10-9.2C.5 8.6 2 5 5.5 5c2 0 3.4 1.2 4.5 2.5C11.1 6.2 12.5 5 14.5 5 18 5 19.5 8.6 22 11.8 19.5 16.1 12 21 12 21z',
  chat: 'M4 4h16a1 1 0 011 1v11a1 1 0 01-1 1H8l-4 4V5a1 1 0 011-1z',
  user: 'M12 12a5 5 0 100-10 5 5 0 000 10zm-8 9a8 8 0 0116 0v1H4v-1z',
  briefcase: 'M9 4h6a2 2 0 012 2v2h4a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V9a1 1 0 011-1h4V6a2 2 0 012-2zm0 4h6V6H9v2z',
  inbox: 'M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zm1 2v8h4a3 3 0 006 0h4V6H5z',
  sliders: 'M4 6h10v2H4V6zm12 0h4v2h-4V6zM4 11h4v2H4v-2zm6 0h10v2H10v-2zM4 16h10v2H4v-2zm12 0h4v2h-4v-2z',
  chevron: 'M9 6l6 6-6 6-1.4-1.4L12.2 12 7.6 7.4z',
  bag: 'M6 8V7a6 6 0 1112 0v1h3v12a1 1 0 01-1 1H4a1 1 0 01-1-1V8h3zm2 0h8V7a4 4 0 10-8 0v1z',
  grid: 'M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z',
  plus: 'M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z',
}

export function Icon({
  name,
  className = 'h-5 w-5',
}: {
  name: IconName
  className?: string
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  )
}

export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-secondary-foreground hover:border-primary/50 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  )
}
