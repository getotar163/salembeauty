import { useEffect, useState } from 'react'
import ClientMode from './components/ClientMode'
import MasterMode from './components/MasterMode'
import Feed from './components/Feed'
import Shop from './components/Shop'
import { Wallet, BookingsScreen } from './components/Wallet'
import { Icon } from './components/ui'
import { BonusContext } from './bonus'
import {
  ProfileScreen,
  FavoritesScreen,
  PaymentMethodsScreen,
  SupportChat,
  type User,
} from './components/Account'
import BusinessProfile from './components/BusinessProfile'
import BusinessAdmin from './components/BusinessAdmin'
import SplashScreen from './components/SplashScreen'
import WelcomeScreen from './components/WelcomeScreen'
import RoleSwitcherSheet from './components/RoleSwitcherSheet'
import StaffSupportModal from './components/StaffSupportModal'
import Chats from './components/Chats'
import AuthModal, { type AuthMode, type AuthProfile, type AuthRole } from './components/AuthModal'
import SocialContactBlock, { type SocialLinks } from './components/SocialContactBlock'
import { LangProvider, translate, useT, type Lang } from './i18n'
import {
  initialBonusBalance,
  initialBonusHistory,
  type BonusEntry,
  type Booking,
} from './data'

type Mode = 'client' | 'worker'
type Account = AuthProfile

const DEMO_ACCOUNT: Account = {
  kind: 'client',
  name: 'Камила',
  photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  phone: '+7 700 ••• •• 42',
}
type ClientTab =
  | 'search'
  | 'feed'
  | 'shop'
  | 'bookings'
  | 'favorites'
  | 'chats'
  | 'wallet'
  | 'profile'
type WorkerTab = 'vacancies' | 'applications' | 'chat' | 'profile'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('authed') || localStorage.getItem('authed') !== '1')
  const [mode, setMode] = useState<Mode>('client')
  const [clientTab, setClientTab] = useState<ClientTab>('search')
  const [workerTab, setWorkerTab] = useState<WorkerTab>('vacancies')

  // shared client state: bonuses + bookings
  const [balance, setBalance] = useState(initialBonusBalance)
  const [history, setHistory] = useState<BonusEntry[]>(initialBonusHistory)
  const [bookings, setBookings] = useState<Booking[]>([])

  const addBooking = (b: Booking) => {
    setBookings((prev) => [b, ...prev])
    setBalance((prev) => prev + b.bonusEarned)
    setHistory((prev) => [
      { id: b.id, label: `За запись · ${b.masterName}`, amount: b.bonusEarned },
      ...prev,
    ])
  }

  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem('lang') as Lang | null) ?? 'RU',
  )
  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang === 'KZ' ? 'kk' : lang.toLowerCase()
  }, [lang])
  const [supportOpen, setSupportOpen] = useState(false)
  const [auth, setAuth] = useState<{ role: AuthRole; mode: AuthMode } | null>(null)
  const [isAuthed, setIsAuthed] = useState(() => localStorage.getItem('authed') === '1')
  useEffect(() => {
    localStorage.setItem('authed', isAuthed ? '1' : '0')
  }, [isAuthed])
  const [account, setAccount] = useState<Account>(() => {
    try {
      const saved = localStorage.getItem('account')
      if (saved) return JSON.parse(saved) as Account
    } catch {
      /* ignore corrupted storage */
    }
    return DEMO_ACCOUNT
  })
  useEffect(() => {
    try {
      localStorage.setItem('account', JSON.stringify(account))
    } catch {
      // Large photos can exceed the quota — keep everything except the photo
      localStorage.setItem('account', JSON.stringify({ ...account, photo: null }))
    }
  }, [account])
  const user: User = account
  const setUser = (u: User) => setAccount((a) => ({ ...a, ...u }))
  const isBusiness = account.kind === 'business'
  const [bizPageOpen, setBizPageOpen] = useState(false)
  const [profileRoleSheet, setProfileRoleSheet] = useState(false)
  const [profileRole, setProfileRole] = useState<'client' | 'business' | 'worker'>(() => (account.kind === 'business' ? 'business' : 'client'))
  const bizName = account.kind === 'business' ? account.business.name : 'Gentlemen Lab'
  const bizCategory = account.kind === 'business' ? account.business.category : 'Барбершоп'
  const [profileView, setProfileView] = useState<'main' | 'favorites' | 'payments'>('main')
  const tr = (ru: string) => translate(lang, ru)
  const t = {
    business: tr('Для бизнеса'),
    signIn: tr('Вход'),
    join: tr('Регистрация'),
    help: tr('Поддержка'),
    city: tr('Алматы'),
  }

  // Demo social links — in a real app these come from the business profile API
  const [socialLinks] = useState<SocialLinks>({
    whatsapp: '+77001234567',
    instagram: 'salembeauty.kz',
  })

  const spendBonus = (amount: number, label: string) => {
    if (amount <= 0) return
    setBalance((prev) => prev - amount)
    setHistory((prev) => [{ id: `spend-${Date.now()}`, label, amount: -amount }, ...prev])
  }

  const onHome = mode === 'client' ? clientTab === 'search' : workerTab === 'vacancies'

  return (
    <LangProvider lang={lang}>
    <BonusContext.Provider value={{ balance, spend: spendBonus }}>
    {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
    {!showSplash && showWelcome && !isAuthed && (
      <WelcomeScreen
        onSignIn={() => {
          setAuth({ role: 'client', mode: 'signin' })
          setShowWelcome(false)
        }}
        onSignUp={() => {
          setAuth({ role: 'client', mode: 'signup' })
          setShowWelcome(false)
        }}
      />
    )}
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-background shadow-[0_0_80px_rgba(60,40,20,0.12)]">
      {/* Status-bar spacer (respects the notch safe area) */}
      <div className="h-[env(safe-area-inset-top)] bg-background" />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-xl">
        {/* Main navbar: logo left, language + help grouped right */}
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-primary text-primary-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/25">
              <span className="font-serif text-lg leading-none">S</span>
            </div>
            <span className="truncate font-serif text-xl">
              Salem<span className="text-primary">Beauty</span>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-card p-0.5 shadow-sm">
            <div role="radiogroup" aria-label="Language" className="flex">
              {(['KZ', 'RU', 'EN'] as const).map((l) => (
                <button
                  key={l}
                  role="radio"
                  aria-checked={lang === l}
                  onClick={() => setLang(l)}
                  className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold tracking-wide transition ${
                    lang === l
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <span className="h-5 w-px bg-border" aria-hidden="true" />
            <button
              onClick={() => setSupportOpen(true)}
              aria-label={t.help}
              title={t.help}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M9.6 9.3a2.5 2.5 0 014.8.9c0 1.7-2.4 2.2-2.4 3.6" />
                <circle cx="12" cy="17" r="0.6" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>

        {/* Action bar — two states: guest vs signed-in (city · bonuses · profile) */}
        <div className="flex items-center gap-2 border-y border-border bg-card/60 px-4 py-2.5">
          {isAuthed ? (
            <>
              <button className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground transition active:scale-95">
                <Icon name="pin" className="h-4 w-4 text-primary" /> {t.city}
              </button>
              <button
                onClick={() => {
                  setMode('client')
                  setClientTab('wallet')
                }}
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-1.5 text-sm font-semibold text-accent transition active:scale-95"
              >
                👑 {balance.toLocaleString(lang === 'EN' ? 'en-US' : 'ru-RU')}
                <span className="font-medium">{tr('бонусов')}</span>
              </button>
              <button
                onClick={() => {
                  setMode('client')
                  setClientTab('profile')
                  setProfileView('main')
                }}
                aria-label={tr('Профиль')}
                className="ml-auto shrink-0 rounded-full ring-2 ring-primary/30 transition active:scale-95"
              >
                {user.photo ? (
                  <img src={user.photo} alt="" className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-serif text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </button>
            </>
          ) : (
            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              <button
                onClick={() => setAuth({ role: 'client', mode: 'signin' })}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-secondary active:scale-95"
              >
                {t.signIn}
              </button>
              <button
                onClick={() => setAuth({ role: 'client', mode: 'signup' })}
                className="rounded-full bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-95"
              >
                {t.join}
              </button>
            </div>
          )}
        </div>

      </header>

      {/* Large title (home screens only) */}
      {onHome && (
        <div className="px-5 pt-4">
          <h1 className="font-serif text-[2rem] leading-tight text-foreground">
            {mode === 'client' ? (
              <>
                {tr('Найди своего')} <span className="text-primary">{tr('мастера')}</span>
              </>
            ) : (
              <>
                {tr('Найди')} <span className="text-primary">{tr('работу')}</span> {tr('в бьюти')}
              </>
            )}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === 'client'
              ? tr('Салоны, барбершопы и частные мастера — запись в пару касаний.')
              : tr('Вакансии в салонах и студиях. Отклик в один тап.')}
          </p>
          {/* Social links block — hidden if no data */}
          <div className="mt-4">
            <SocialContactBlock links={socialLinks} />
          </div>
        </div>
      )}

      {/* Body */}
      <main className="flex-1">
        {mode === 'client' ? (
          clientTab === 'search' ? (
            <ClientMode onConfirmBooking={addBooking} />
          ) : clientTab === 'feed' ? (
            <Feed />
          ) : clientTab === 'shop' ? (
            <Shop />
          ) : clientTab === 'bookings' ? (
            <BookingsScreen bookings={bookings} />
          ) : clientTab === 'chats' ? (
            <Chats />
          ) : clientTab === 'favorites' ? (
            <FavoritesScreen onBack={() => setClientTab('search')} onBook={() => setClientTab('search')} />
          ) : clientTab === 'wallet' ? (
            <Wallet balance={balance} history={history} />
          ) : !isAuthed ? (
            <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name="user" className="h-8 w-8" />
              </span>
              <h2 className="font-serif text-2xl text-foreground">{tr('Войдите, чтобы открыть профиль')}</h2>
              <p className="text-sm text-muted-foreground">{tr('Бонусы, избранное, способы оплаты и история записей — в одном месте.')}</p>
              <div className="grid w-full grid-cols-2 gap-2 pt-2">
                <button onClick={() => setAuth({ role: 'client', mode: 'signin' })} className="rounded-2xl border border-border bg-card py-3.5 font-medium text-foreground">
                  {t.signIn}
                </button>
                <button onClick={() => setAuth({ role: 'client', mode: 'signup' })} className="rounded-2xl bg-primary py-3.5 font-medium text-primary-foreground">
                  {t.join}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Dual-role switcher: pill button */}
              <div className="px-4 pt-4">
                <button
                  onClick={() => setProfileRoleSheet(true)}
                  className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 shadow-sm transition hover:bg-secondary/50 active:scale-[0.99]"
                >
                  <span className="text-sm font-semibold text-foreground">
                    {profileRole === 'business' ? `Бизнес (${bizName})` : profileRole === 'worker' ? 'Сотрудник' : `Личный профиль (${account.name})`}
                  </span>
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m8 6H4m0 0l4 4m-4-4l4-4"/></svg>
                </button>
              </div>
              {profileRole === 'business' ? (
                <div className="flex flex-col gap-4 px-4 pb-8 pt-4">
                  <BusinessAdmin name={bizName} category={bizCategory} onOpenPage={() => setBizPageOpen(true)} />
                  <button
                    onClick={() => {
                      setIsAuthed(false)
                      setShowWelcome(true)
                      setAccount(DEMO_ACCOUNT)
                    }}
                    className="w-full rounded-2xl border border-border bg-card py-3.5 font-medium text-[#C2362B]"
                  >
                    {tr('Выйти')}
                  </button>
                </div>
              ) : profileView === 'favorites' ? (
            <FavoritesScreen onBack={() => setProfileView('main')} onBook={() => setClientTab('search')} />
          ) : profileView === 'payments' ? (
            <PaymentMethodsScreen onBack={() => setProfileView('main')} balance={balance} />
          ) : (
            <ProfileScreen
              user={{ ...user, name: user.name === 'Камила' ? tr('Камила') : user.name }}
              balance={balance}
              onUpdate={setUser}
              onLogout={() => {
                setIsAuthed(false)
                setShowWelcome(true)
                setAccount(DEMO_ACCOUNT)
              }}
              seeker={account.kind === 'client' ? account.seeker : undefined}
              onOpenJobs={() => setMode('worker')}
              onOpen={(v) => {
                if (v === 'favorites' || v === 'payments') setProfileView(v)
                else if (v === 'history') setClientTab('bookings')
                else if (v === 'wallet') setClientTab('wallet')
                else setSupportOpen(true)
              }}
            />
              )}
            </div>
          )
        ) : (
          <MasterMode tab={workerTab} />
        )}
      </main>

      {/* Bottom tab bar — persistent, safe-area aware */}
      <nav className="sticky bottom-0 z-30 border-t border-border bg-card/92 backdrop-blur-xl">
        <div
          className={`grid pb-[env(safe-area-inset-bottom)] ${
            mode === 'client' ? 'grid-cols-6' : 'grid-cols-4'
          }`}
        >
          {mode === 'client'
            ? (
                [
                  ['search', 'Поиск', 'search'],
                  ['feed', 'Лента', 'grid'],
                  ['shop', 'Магазин', 'bag'],
                  ['bookings', 'Записи', 'calendar'],
                  ['chats', 'Чаты', 'chat'],
                  ['profile', 'Профиль', 'user'],
                ] as [ClientTab, string, TabIcon][]
              ).map(([id, label, icon]) => (
                <TabButton
                  key={id}
                  icon={icon}
                  label={tr(label)}
                  active={clientTab === id}
                  onClick={() => {
                    setClientTab(id)
                    setProfileView('main')
                  }}
                />
              ))
            : (
                [
                  ['vacancies', 'Вакансии', 'briefcase'],
                  ['applications', 'Отклики', 'inbox'],
                  ['chat', 'Чат', 'chat'],
                  ['profile', 'Профиль', 'user'],
                ] as [WorkerTab, string, TabIcon][]
              ).map(([id, label, icon]) => (
                <TabButton
                  key={id}
                  icon={icon}
                  label={tr(label)}
                  active={workerTab === id}
                  onClick={() => setWorkerTab(id)}
                />
              ))}
        </div>
      </nav>
      {bizPageOpen && (
        <div className="fixed inset-0 z-50 mx-auto w-full max-w-[430px] overflow-y-auto bg-background">
          <BusinessProfile
            onBack={() => setBizPageOpen(false)}
            onConfirmBooking={addBooking}
            overrides={{ name: bizName, tagline: bizCategory }}
          />
        </div>
      )}
      {profileRoleSheet && (
        <RoleSwitcherSheet
          activeRole={profileRole}
          onSwitch={(r) => {
            setProfileRole(r)
            if (r === 'worker') {
              setMode('worker')
              setWorkerTab('profile')
            } else {
              setMode('client')
              setClientTab('profile')
            }
          }}
          onRegisterBusiness={() => setAuth({ role: 'business', mode: 'signup' })}
          onClose={() => setProfileRoleSheet(false)}
        />
      )}
      {supportOpen && (
        mode === 'worker' ? <StaffSupportModal onClose={() => setSupportOpen(false)} /> : <SupportChat onBack={() => setSupportOpen(false)} />
      )}
      {auth && (
        <AuthModal
          key={`${auth.role}-${auth.mode}`}
          initialRole={auth.role}
          initialMode={auth.mode}
          onClose={() => setAuth(null)}
          onSuccess={(p) => {
            setIsAuthed(true)
            setShowWelcome(false)
            if (p) setAccount(p)
            setProfileRole(p?.kind === 'business' ? 'business' : 'client')
          }}
        />
      )}
    </div>
    </BonusContext.Provider>
    </LangProvider>
  )
}

type TabIcon =
  | 'search'
  | 'heart'
  | 'calendar'
  | 'wallet'
  | 'user'
  | 'briefcase'
  | 'inbox'
  | 'chat'
  | 'grid'
  | 'bag'

function ModePill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 whitespace-nowrap rounded-[11px] px-4 py-2 text-sm font-medium transition ${
        active
          ? 'bg-card text-foreground shadow-sm'
          : 'text-muted-foreground active:opacity-70'
      }`}
    >
      {children}
    </button>
  )
}

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: TabIcon
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 pb-2 pt-2.5 text-[10px] font-medium transition active:scale-95 ${
        active ? 'text-primary' : 'text-muted-foreground'
      }`}
    >
      <Icon name={icon} className="h-6 w-6" />
      {label}
    </button>
  )
}

function EmptyScreen({
  title,
  icon,
  hint,
}: {
  title: string
  icon: 'heart' | 'calendar'
  hint: string
}) {
  return (
    <div className="px-5 pb-6 pt-6">
      <h2 className="mb-6 font-serif text-2xl text-foreground">{title}</h2>
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <Icon name={icon} className="h-7 w-7" />
        </div>
        <p className="max-w-[16rem] text-sm text-muted-foreground">{hint}</p>
      </div>
    </div>
  )
}

