'use client'

import { cn } from '@/lib/utils'

export type TabKey = 'bugun' | 'notlar' | 'istatistikler' | 'hesap'

interface NavTab {
  key: TabKey
  label: string
  icon: (active: boolean) => React.ReactNode
}

const TABS: NavTab[] = [
  {
    key: 'bugun',
    label: 'Bugün',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={active
          ? 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'
          : 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'} />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    key: 'notlar',
    label: 'Notlar',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
  {
    key: 'istatistikler',
    label: 'İstatistikler',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    key: 'hesap',
    label: 'Hesap',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

interface BottomNavProps {
  active: TabKey
  onChange: (tab: TabKey) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-30',
        'bg-card/90 backdrop-blur-md border-t border-border',
        'flex items-stretch',
        'pb-safe',
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
      aria-label="Alt navigasyon"
    >
      {TABS.map((tab) => {
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[56px]',
              'transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg',
              isActive ? 'text-teal' : 'text-muted-foreground',
            )}
          >
            {tab.icon(isActive)}
            <span className={cn(
              'text-[10px] font-medium leading-none transition-all duration-200',
              isActive ? 'opacity-100' : 'opacity-60',
            )}>
              {tab.label}
            </span>
            {/* Active indicator dot */}
            {isActive && (
              <span
                className="absolute bottom-[6px] w-1 h-1 rounded-full bg-teal animate-scale-in"
                aria-hidden="true"
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
