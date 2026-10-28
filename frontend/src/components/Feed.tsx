import { useState } from 'react'
import { feedPosts } from '../data'
import { useT } from '../i18n'
import { Icon } from './ui'

const TABS = ['Рекомендации', 'Волосы', 'Ногти', 'Брови', 'Барбер'] as const

export default function Feed() {
  const { t, lang } = useT()
  const loc = lang === 'KZ' ? 'kk-KZ' : lang === 'EN' ? 'en-US' : 'ru-RU'
  const [tab, setTab] = useState<(typeof TABS)[number]>('Рекомендации')
  const [liked, setLiked] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setLiked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const visible =
    tab === 'Рекомендации'
      ? feedPosts
      : feedPosts.filter((p) =>
          p.tag.toLowerCase().includes(tab.toLowerCase().slice(0, 4)),
        )
  const list = visible.length ? visible : feedPosts

  return (
    <div className="px-5 pb-6 pt-6">
      <h2 className="font-serif text-2xl text-foreground">Beauty Feed</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t('Вдохновение и идеи от мастеров')}</p>

      {/* category tabs */}
      <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar">
        {TABS.map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === tb
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-secondary-foreground active:scale-95'
            }`}
          >
            {t(tb)}
          </button>
        ))}
      </div>

      {/* masonry-ish 2-col grid, more columns on wide screens */}
      <div className="mt-5 columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
        {list.map((p) => {
          const isLiked = liked.has(p.id)
          return (
            <div
              key={p.id}
              className="break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="relative">
                <img src={p.image} alt={t(p.caption)} className="w-full object-cover" />
                <button
                  onClick={() => toggle(p.id)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur active:scale-90"
                >
                  <Icon
                    name="heart"
                    className={`h-4 w-4 ${isLiked ? 'fill-primary text-primary' : ''}`}
                  />
                </button>
              </div>
              <div className="p-3">
                <div className="text-sm font-medium leading-snug text-foreground break-words [word-break:break-word] hyphens-auto">
                  {t(p.caption)}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <img src={p.authorPhoto} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
                  <span className="min-w-0 truncate text-xs text-muted-foreground">{t(p.author)}</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon
                    name="heart"
                    className={`h-3.5 w-3.5 ${isLiked ? 'fill-primary text-primary' : ''}`}
                  />
                  {(p.likes + (isLiked ? 1 : 0)).toLocaleString(loc)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
