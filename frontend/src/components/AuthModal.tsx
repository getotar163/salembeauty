import { useEffect, useState } from 'react'
import { useT } from '../i18n'
import LegalModal from './LegalModal'

export type AuthRole = 'client' | 'business'
export type AuthMode = 'signup' | 'signin'
export type JobSeeker = { specialty: string; experience: string; about: string; resumeName: string }
export type BusinessInfo = { name: string; category: string; tags: string[]; email: string }
export type AuthProfile =
  | { kind: 'client'; name: string; phone: string; photo: string | null; seeker?: JobSeeker }
  | { kind: 'business'; name: string; phone: string; photo: string | null; business: BusinessInfo }

const SPECIALTIES = ['Барбер', 'Парикмахер-стилист', 'Мастер маникюра', 'Косметолог', 'Бровист', 'Визажист', 'Массажист']
const EXPERIENCE = ['Без опыта', 'До 1 года', '1–3 года', 'Более 3 лет']
const ABOUT_MAX = 300

const CATEGORIES = ['Барбершоп', 'Магазин косметики', 'Салон красоты']
const SERVICE_TAGS = ['Стрижки и борода', 'Уход за лицом', 'Ногтевой сервис', 'Продажа уходовой косметики']

const inputCls =
  'w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'

/** Formats raw digits as "700 123 45 67" (the +7 prefix is rendered separately). */
function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 10)
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean).join(' ')
}

export default function AuthModal({
  initialRole = 'client',
  initialMode = 'signup',
  onClose,
  onSuccess,
}: {
  initialRole?: AuthRole
  initialMode?: AuthMode
  onClose: () => void
  onSuccess?: (profile: AuthProfile | undefined) => void
}) {
  const { t } = useT()
  const [role, setRole] = useState<AuthRole>(initialRole)
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [bizName, setBizName] = useState('')
  const [category, setCategory] = useState('')
  const [email, setEmail] = useState('')
  const [tags, setTags] = useState<Set<string>>(new Set())
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)
  const [seeking, setSeeking] = useState(false)
  const [specialty, setSpecialty] = useState('')
  const [experience, setExperience] = useState('')
  const [about, setAbout] = useState('')
  const [resume, setResume] = useState<File | null>(null)
  const [resumeErr, setResumeErr] = useState('')
  const [done, setDone] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [legalOpen, setLegalOpen] = useState<'privacy' | 'terms' | null>(null)
  const succeed = async (social = false) => {
    if (social || !isSignup) {
      if (social) return onSuccess?.(undefined)
      
      // Login flow
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: phone.replace(/\D/g, ''),
            password,
          }),
        })
        if (!res.ok) throw new Error('Invalid credentials')
        const data = await res.json()
        localStorage.setItem('token', data.data.accessToken)
        
        setDone(true)
        const d = phone.replace(/\D/g, '')
        const masked = `+7 ${d.slice(0, 3)} ••• •• ${d.slice(8, 10)}`
        
        // Since login doesn't return full details yet, mock some fields based on role
        if (data.data.user.role === 'business') {
          onSuccess?.({
            kind: 'business',
            name: data.data.user.firstName,
            phone: masked,
            photo: null,
            business: { name: data.data.user.firstName, category: '', tags: [], email: data.data.user.email || '' },
          })
        } else {
          onSuccess?.({
            kind: 'client',
            name: `${data.data.user.firstName} ${data.data.user.lastName}`,
            phone: masked,
            photo: null,
          })
        }
      } catch (err) {
        alert(t('Ошибка входа. Проверьте данные.'))
      }
      return
    }

    // Signup flow
    try {
      const payload = {
        phone: phone.replace(/\D/g, ''),
        password,
        firstName: role === 'business' ? bizName.trim() : firstName.trim(),
        lastName: role === 'business' ? '' : lastName.trim(),
        role: role,
        email: role === 'business' ? email.trim() : undefined,
      }
      
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Ошибка регистрации')
      }
      
      const data = await res.json()
      localStorage.setItem('token', data.data.accessToken)
      
      setDone(true)
      const d = phone.replace(/\D/g, '')
      const masked = `+7 ${d.slice(0, 3)} ••• •• ${d.slice(8, 10)}`
      
      if (role === 'business') {
        onSuccess?.({
          kind: 'business',
          name: bizName.trim(),
          phone: masked,
          photo: null,
          business: { name: bizName.trim(), category, tags: [...tags], email: email.trim() },
        })
      } else {
        onSuccess?.({
          kind: 'client',
          name: `${firstName.trim()} ${lastName.trim()}`,
          phone: masked,
          photo,
          seeker:
            seeking && resume
              ? { specialty, experience, about: about.trim(), resumeName: resume.name }
              : undefined,
        })
      }
    } catch (err: any) {
      alert(err.message)
    }
  }
  const pickResume = (f: File | undefined) => {
    if (!f) return
    if (!/\.(pdf|docx?)$/i.test(f.name)) return setResumeErr(t('Поддерживаются файлы PDF, DOC или DOCX'))
    if (f.size > 10 * 1024 * 1024) return setResumeErr(t('Размер файла — не более 10 МБ'))
    setResumeErr('')
    setResume(f)
  }
  const pickPhoto = (f: File | undefined) => {
    if (!f) return
    const r = new FileReader()
    r.onload = () => setPhoto(String(r.result))
    r.readAsDataURL(f)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const phoneOk = phone.replace(/\D/g, '').length === 10
  const isSignup = mode === 'signup'
  const valid =
    !isSignup
      ? phoneOk && password.length >= 6
      : agreed && (role === 'client'
      ? firstName.trim() !== '' &&
        lastName.trim() !== '' &&
        phoneOk &&
        password.length >= 6 &&
        (!seeking || (specialty !== '' && experience !== '' && resume !== null && about.trim().length >= 20))
      : bizName.trim() !== '' && category !== '' && phoneOk && /\S+@\S+\.\S+/.test(email) && tags.size > 0)

  const toggleTag = (tag: string) =>
    setTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92dvh] w-full max-w-[430px] flex-col gap-4 overflow-y-auto rounded-t-2xl bg-background p-6 pb-[calc(24px+env(safe-area-inset-bottom))] shadow-[0_-12px_60px_rgba(60,40,20,0.18)] sm:max-w-[440px] sm:rounded-2xl sm:pb-6"
      >
        {/* grabber (mobile sheet) */}
        <div className="-mt-2 mx-auto h-1 w-10 shrink-0 rounded-full bg-border sm:hidden" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="auth-title" className="font-serif text-2xl leading-tight text-foreground">
              {isSignup ? t('Создать аккаунт') : t('С возвращением')}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {role === 'client'
                ? t('Записывайтесь к мастерам и копите бонусы.')
                : t('Принимайте записи и находите мастеров в команду.')}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label={t('Закрыть')}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Role selector — same segmented control as the header mode toggle */}
        <div role="tablist" className="flex w-full shrink-0 rounded-[14px] bg-secondary p-1">
          {(
            [
              ['client', 'Клиент'],
              ['business', 'Бизнес'],
            ] as [AuthRole, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={role === id}
              onClick={() => setRole(id)}
              className={`flex-1 whitespace-nowrap rounded-[11px] px-4 py-2 text-sm font-medium transition ${
                role === id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground active:opacity-70'
              }`}
            >
              {t(label)}
            </button>
          ))}
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </div>
            <p className="font-serif text-xl text-foreground">
              {isSignup ? t('Аккаунт создан') : t('Вы вошли')}
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full rounded-2xl bg-primary py-3.5 font-medium text-primary-foreground transition active:scale-[0.98]"
            >
              {t('Продолжить')}
            </button>
          </div>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (valid) succeed()
            }}
          >
            {role === 'client' && isSignup && (
              <>
                <div className="flex items-center gap-4">
                  <label className="relative shrink-0 cursor-pointer" aria-label={t('Добавить фото')}>
                    {photo ? (
                      <img src={photo} alt="" className="h-16 w-16 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-primary/50 bg-secondary text-primary">
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                          <circle cx="12" cy="13" r="3.2" />
                        </svg>
                      </span>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-primary text-sm leading-none text-primary-foreground">+</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => pickPhoto(e.target.files?.[0])} />
                  </label>
                  <div className="text-sm">
                    <div className="font-medium text-foreground">{t('Фото профиля')}</div>
                    <div className="text-muted-foreground">{t('По желанию — можно добавить позже')}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t('Имя')}>
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" placeholder={t('Камила')} className={inputCls} />
                  </Field>
                  <Field label={t('Фамилия')}>
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" placeholder={t('Ахметова')} className={inputCls} />
                  </Field>
                </div>
              </>
            )}

            {role === 'business' && isSignup && (
              <>
                <Field label={t('Название бизнеса')}>
                  <input
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                    placeholder={t('Например, Barber Hall')}
                    className={inputCls}
                  />
                </Field>
                <Field label={t('Категория')}>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`${inputCls} appearance-none pr-10 ${category ? '' : 'text-muted-foreground'}`}
                    >
                      <option value="" disabled>
                        {t('Выберите категорию')}
                      </option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="text-foreground">
                          {t(c)}
                        </option>
                      ))}
                    </select>
                    <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </Field>
              </>
            )}

            <Field label={t('Телефон')}>
              <div className="flex items-center rounded-xl border border-border bg-card transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <span className="border-r border-border py-3 pl-4 pr-3 font-medium text-foreground">+7</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="700 000 00 00"
                  className="w-full bg-transparent px-3 py-3 text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </Field>

            {role === 'business' && isSignup ? (
              <>
                <Field label={t('Рабочий email')}>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@business.kz"
                    className={inputCls}
                  />
                </Field>
                <fieldset>
                  <legend className="mb-1.5 block text-sm font-medium text-secondary-foreground">
                    {t('Услуги')}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_TAGS.map((tag) => {
                      const on = tags.has(tag)
                      return (
                        <button
                          type="button"
                          key={tag}
                          aria-pressed={on}
                          onClick={() => toggleTag(tag)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                            on
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-card text-secondary-foreground hover:border-primary/50 hover:text-foreground'
                          }`}
                        >
                          {on && (
                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12.5l4.5 4.5L19 7.5" />
                            </svg>
                          )}
                          {t(tag)}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              </>
            ) : null}

            <Field label={t('Пароль')}>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('Минимум 6 символов')}
                  className={`${inputCls} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-primary"
                >
                  {showPw ? t('Скрыть') : t('Показать')}
                </button>
              </div>
            </Field>

            {role === 'client' && isSignup && (
              <div className={`rounded-2xl border p-4 transition ${seeking ? 'border-primary/40 bg-primary/5' : 'border-border bg-card'}`}>
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={seeking} onChange={(e) => setSeeking(e.target.checked)} className="peer sr-only" />
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 ${
                      seeking ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'
                    }`}
                  >
                    {seeking && (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    )}
                  </span>
                  <span className="text-sm">
                    <span className="block font-medium text-foreground">{t('Я также ищу работу в бьюти-сфере')}</span>
                    <span className="text-muted-foreground">{t('Салоны и барбершопы увидят ваше резюме и смогут пригласить на собеседование.')}</span>
                  </span>
                </label>

                {seeking && (
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label={t('Специализация')}>
                        <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className={`${inputCls} appearance-none px-3 ${specialty ? '' : 'text-muted-foreground'}`}>
                          <option value="" disabled>{t('Выберите')}</option>
                          {SPECIALTIES.map((s) => (
                            <option key={s} value={s} className="text-foreground">{t(s)}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label={t('Опыт работы')}>
                        <select value={experience} onChange={(e) => setExperience(e.target.value)} className={`${inputCls} appearance-none px-3 ${experience ? '' : 'text-muted-foreground'}`}>
                          <option value="" disabled>{t('Выберите')}</option>
                          {EXPERIENCE.map((s) => (
                            <option key={s} value={s} className="text-foreground">{t(s)}</option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-secondary-foreground">{t('Резюме')}</span>
                      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/50 bg-card px-4 py-3 transition hover:bg-primary/5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h4" />
                          </svg>
                        </span>
                        <span className="min-w-0 flex-1 text-sm">
                          <span className="block break-all font-medium text-foreground">{resume ? resume.name : t('Загрузить файл резюме')}</span>
                          <span className="text-muted-foreground">
                            {resume ? `${(resume.size / 1024).toFixed(0)} КБ · ${t('нажмите, чтобы заменить')}` : t('PDF, DOC или DOCX, до 10 МБ')}
                          </span>
                        </span>
                        <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => pickResume(e.target.files?.[0])} />
                      </label>
                      {resumeErr && <p className="mt-1.5 text-xs text-[#C2362B]">{resumeErr}</p>}
                    </div>

                    <Field label={t('Кратко о себе')}>
                      <textarea
                        value={about}
                        onChange={(e) => setAbout(e.target.value.slice(0, ABOUT_MAX))}
                        rows={3}
                        placeholder={t('Например: барбер с опытом 3 года, делаю классические и современные мужские стрижки, оформляю бороду. Ищу работу в Алматы.')}
                        className={`${inputCls} resize-none`}
                      />
                      <p className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>{t('Минимум 20 символов')}</span>
                        <span>{about.length}/{ABOUT_MAX}</span>
                      </p>
                    </Field>
                  </div>
                )}
              </div>
            )}

            {isSignup && (
              <div className="rounded-2xl border border-border bg-card/60 p-3">
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="peer sr-only" />
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 ${
                      agreed ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'
                    }`}
                  >
                    {agreed && (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    )}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t('Я подтверждаю согласие с')}{' '}
                    <button type="button" onClick={() => setLegalOpen('terms')} className="font-semibold text-primary underline-offset-2 hover:underline">
                      {t('Условиями')}
                    </button>{' '}
                    {t('и')}{' '}
                    <button type="button" onClick={() => setLegalOpen('privacy')} className="font-semibold text-primary underline-offset-2 hover:underline">
                      {t('Политикой конфиденциальности')}
                    </button>
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={!valid}
              className="mt-1 w-full rounded-2xl bg-primary py-3.5 font-medium text-primary-foreground transition active:scale-[0.98] disabled:opacity-40"
            >
              {isSignup ? t('Зарегистрироваться') : t('Войти')}
            </button>

            {role === 'client' && (
              <>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  {t('или')}
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => succeed(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-medium text-background transition active:scale-[0.98]"
                  >
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
                      <path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8C7 7.3 5.6 8.2 4.8 9.6c-1.7 2.9-.4 7.2 1.2 9.5.8 1.1 1.7 2.4 2.9 2.4 1.2-.1 1.6-.8 3-.8s1.8.8 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.6-1-2.6-3.9zM14.1 5.5c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3z" />
                    </svg>
                    Apple ID
                  </button>
                  <button
                    type="button"
                    onClick={() => succeed(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition hover:border-primary/50 active:scale-[0.98]"
                  >
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
                      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 01-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" />
                      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0012 22z" />
                      <path fill="#FBBC05" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 000 9.2L6.4 14z" />
                      <path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 003.1 7.4L6.4 10c.8-2.3 3-4.1 5.6-4.1z" />
                    </svg>
                    Google
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {!done && (
          <p className="text-center text-sm text-muted-foreground">
            {isSignup ? t('Уже есть аккаунт?') : t('Нет аккаунта?')}{' '}
            <button
              onClick={() => setMode(isSignup ? 'signin' : 'signup')}
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              {isSignup ? t('Войти') : t('Зарегистрироваться')}
            </button>
          </p>
        )}
      </div>
      {legalOpen && (
        <LegalModal type={legalOpen} onClose={() => setLegalOpen(null)} />
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-secondary-foreground">{label}</span>
      {children}
    </label>
  )
}
