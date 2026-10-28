import { createContext, useCallback, useContext, type ReactNode } from 'react'
import app from './app'
import client from './client'
import master from './master'
import booking from './booking'
import misc from './misc'
import data from './data'
import auth from './auth'
import business from './business'
import checkout from './checkout'
import support from './support'
import account from './account'
import admin from './admin'
import chats from './chats'

export type Lang = 'KZ' | 'RU' | 'EN'
/** Russian source string → Kazakh / English translations */
export type Dict = Record<string, { kz: string; en: string }>

const dict: Dict = { ...data, ...app, ...client, ...master, ...booking, ...misc, ...auth, ...business, ...checkout, ...support, ...account, ...admin, ...chats }

const LangContext = createContext<Lang>('RU')

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>
}

export function translate(lang: Lang, ru: string, vars?: Record<string, string | number>) {
  let s = lang === 'RU' ? ru : (dict[ru]?.[lang === 'KZ' ? 'kz' : 'en'] ?? ru)
  if (vars) for (const k in vars) s = s.split(`{${k}}`).join(String(vars[k]))
  return s
}

/** `t('Русский текст', { n: 3 })` — Russian is the source key; `{name}` placeholders are interpolated. */
export function useT() {
  const lang = useContext(LangContext)
  const t = useCallback(
    (ru: string, vars?: Record<string, string | number>) => translate(lang, ru, vars),
    [lang],
  )
  return { t, lang }
}
