import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import type { Master } from '../data'
import { useT } from '../i18n'
import { Stars, VenueBadge, formatPrice, Icon } from './ui'
import SocialContactBlock from './SocialContactBlock'

// Custom pin HTML generator
function createPinIcon(master: Master, isSelected: boolean) {
  const emoji =
    master.venueType === 'barbershop'
      ? '💈'
      : master.categoryId === 'nails'
      ? '💅'
      : master.categoryId === 'massage'
      ? '💆'
      : '💇'

  const bg = isSelected ? '#1A382B' : '#B85834'
  const scale = isSelected ? 'scale(1.15)' : 'scale(1)'

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="transform: translate(-50%, -100%) ${scale}; transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer;">
        <div style="
          background-color: ${bg};
          color: white;
          padding: 6px 10px;
          border-radius: 20px;
          font-family: inherit;
          font-weight: 600;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.22);
          border: 2px solid #FAF8F5;
          white-space: nowrap;
        ">
          <span>${emoji}</span>
          <span style="max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${master.name.replace(/^(Салон|BOSS|SPA|Клиника|Studio)\s*/, '')}
          </span>
        </div>
        <div style="
          width: 0; 
          height: 0; 
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid ${bg};
          margin: -1px auto 0;
        "></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

/** Full interactive map view for the search screen */
export function FullMapView({
  masters,
  onSelectMaster,
  onBookMaster,
}: {
  masters: Master[]
  onSelectMaster: (m: Master) => void
  onBookMaster: (m: Master) => void
}) {
  const { t } = useT()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const [selected, setSelected] = useState<Master | null>(masters[0] || null)

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return

    // Almaty center default
    const map = L.map(mapContainerRef.current, {
      center: [43.2389, 76.9152],
      zoom: 12,
      zoomControl: false,
    })

    // Clean, aesthetic warm tiles (CartoDB Voyager)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
    }).addTo(map)

    // Add zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Update markers when masters change or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Clear previous markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current.clear()

    const bounds = L.latLngBounds([])

    masters.forEach((m) => {
      if (!m.coordinates) return
      const isSelected = selected?.id === m.id
      const marker = L.marker([m.coordinates.lat, m.coordinates.lng], {
        icon: createPinIcon(m, isSelected),
        zIndexOffset: isSelected ? 1000 : 100,
      }).addTo(map)

      marker.on('click', () => {
        setSelected(m)
        map.panTo([m.coordinates!.lat, m.coordinates!.lng], { animate: true, duration: 0.5 })
      })

      markersRef.current.set(m.id, marker)
      bounds.extend([m.coordinates.lat, m.coordinates.lng])
    })

    // Update icons for selection
    markersRef.current.forEach((marker, id) => {
      const m = masters.find((item) => item.id === id)
      if (m) {
        marker.setIcon(createPinIcon(m, selected?.id === id))
        marker.setZIndexOffset(selected?.id === id ? 1000 : 100)
      }
    })
  }, [masters, selected])

  return (
    <div className="relative h-[calc(100dvh-220px)] w-full overflow-hidden rounded-3xl border border-border shadow-inner">
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Recenter Almaty button */}
      <button
        onClick={() => {
          mapInstanceRef.current?.setView([43.2389, 76.9152], 12, { animate: true })
        }}
        className="absolute right-3 top-20 z-[400] flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card/95 text-foreground shadow-md backdrop-blur-md transition active:scale-95"
        title={t('Алматы')}
      >
        <Icon name="pin" className="h-5 w-5 text-primary" />
      </button>

      {/* Floating Bottom Card for Selected Salon / Master */}
      {selected && (
        <div className="absolute inset-x-3 bottom-3 z-[400] animate-fade-in-up">
          <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <img
                src={selected.cover}
                alt={selected.name}
                className="h-16 w-16 shrink-0 rounded-2xl object-cover shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3
                    onClick={() => onSelectMaster(selected)}
                    className="cursor-pointer truncate font-semibold text-foreground hover:text-primary"
                  >
                    {t(selected.name)}
                  </h3>
                  <VenueBadge type={selected.venueType} />
                </div>
                <p className="truncate text-xs text-muted-foreground">{t(selected.specialty)}</p>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <Stars rating={selected.rating} reviews={selected.reviews} />
                  <span className="text-muted-foreground">·</span>
                  <span className="truncate text-muted-foreground">{t(selected.district)}</span>
                </div>
              </div>
            </div>

            {/* Address with 2GIS link */}
            {selected.address && (
              <div className="flex items-center justify-between gap-2 border-t border-border pt-2 text-xs text-muted-foreground">
                <span className="truncate">📍 {t(selected.address)}</span>
                <a
                  href={`https://2gis.kz/almaty/search/${encodeURIComponent(selected.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 font-medium text-primary hover:underline"
                >
                  2ГИС ↗
                </a>
              </div>
            )}

            {/* Individual Social Contacts for this salon (dynamic hide if empty) */}
            {(selected.whatsapp || selected.instagram) && (
              <div className="flex gap-2">
                {selected.whatsapp && (
                  <a
                    href={`https://wa.me/${selected.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#25D366]/10 py-2 text-xs font-semibold text-[#25D366] transition hover:bg-[#25D366]/20 active:scale-95"
                  >
                    <span>💬 WhatsApp</span>
                  </a>
                )}
                {selected.instagram && (
                  <a
                    href={`https://instagram.com/${selected.instagram.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#E4405F]/10 py-2 text-xs font-semibold text-[#E4405F] transition hover:bg-[#E4405F]/20 active:scale-95"
                  >
                    <span>📷 Instagram</span>
                  </a>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 border-t border-border pt-2">
              <span className="text-xs text-muted-foreground">
                {t('от')}{' '}
                <span className="font-semibold text-foreground">
                  {formatPrice(selected.priceFrom)}
                </span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectMaster(selected)}
                  className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition active:scale-95"
                >
                  {t('Подробнее')}
                </button>
                <button
                  onClick={() => onBookMaster(selected)}
                  className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition active:scale-95"
                >
                  {t('Записаться')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/** Mini-map for individual business or master profile */
export function SingleLocationMap({
  name,
  address,
  coordinates,
  venueType = 'salon',
}: {
  name: string
  address?: string
  coordinates?: { lat: number; lng: number }
  venueType?: Master['venueType']
}) {
  const { t } = useT()
  const mapRef = useRef<HTMLDivElement>(null)

  const coords = coordinates || { lat: 43.2389, lng: 76.9152 }

  useEffect(() => {
    if (!mapRef.current) return

    const map = L.map(mapRef.current, {
      center: [coords.lat, coords.lng],
      zoom: 14,
      zoomControl: false,
      dragging: !L.Browser.mobile,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map)

    const emoji = venueType === 'barbershop' ? '💈' : '💇'

    const pin = L.divIcon({
      className: 'custom-single-pin',
      html: `
        <div style="transform: translate(-50%, -100%);">
          <div style="
            background-color: #B85834;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-family: inherit;
            font-weight: 600;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.25);
            border: 2px solid #FAF8F5;
            white-space: nowrap;
          ">
            <span>${emoji}</span>
            <span>${name}</span>
          </div>
          <div style="
            width: 0; 
            height: 0; 
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid #B85834;
            margin: -1px auto 0;
          "></div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    })

    L.marker([coords.lat, coords.lng], { icon: pin }).addTo(map)

    return () => {
      map.remove()
    }
  }, [coords.lat, coords.lng, name, venueType])

  const mapQuery = encodeURIComponent(address || name)

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2 px-1">
        <span className="text-sm font-semibold text-foreground">{t('Расположение')}</span>
        <div className="flex items-center gap-2">
          <a
            href={`https://2gis.kz/almaty/search/${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366]/10 px-2.5 py-1 text-xs font-medium text-[#1A382B] transition hover:bg-[#25D366]/20 active:scale-95"
          >
            2ГИС ↗
          </a>
          <a
            href={`https://yandex.kz/maps/?text=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground transition hover:bg-muted active:scale-95"
          >
            Яндекс ↗
          </a>
        </div>
      </div>

      <div ref={mapRef} className="h-44 w-full overflow-hidden rounded-xl border border-border/80" />

      {address && (
        <div className="flex items-center gap-1.5 px-1 pt-1 text-xs text-muted-foreground">
          <Icon name="pin" className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate">{t(address)}</span>
        </div>
      )}
    </div>
  )
}
