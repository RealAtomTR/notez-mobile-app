'use client'

import { AppCard } from './ui-primitives'

export function AccountScreen() {
  return (
    <div className="flex flex-col min-h-full">
      {/* ── Dark glass header ── */}
      <header
        className="bg-header text-header-foreground px-4 pt-12 pb-6 relative overflow-hidden"
        style={{ borderRadius: '0 0 28px 28px' }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background:
              'radial-gradient(ellipse 60% 90% at 20% 60%, oklch(0.58 0.13 195 / 0.5), transparent)',
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <h1 className="text-2xl font-bold text-header-foreground">Hesap</h1>
          <p className="text-sm text-header-foreground/60 mt-0.5">Kişisel profiliniz</p>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-10 -mt-2">
        {/* Avatar placeholder */}
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, oklch(0.28 0.04 250), oklch(0.38 0.07 210))',
          }}
          aria-hidden="true"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        {/* Coming soon card */}
        <AppCard className="w-full max-w-sm p-6 text-center">
          <div
            className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{
              background: 'oklch(0.90 0.04 195)',
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-teal"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          <h2 className="text-lg font-bold text-foreground mb-2 text-balance">Yakında</h2>
          <p className="text-sm text-muted-foreground leading-relaxed text-balance">
            Hesap yönetimi, profil düzenleme ve bulut senkronizasyonu özellikler yakında geliyor.
          </p>
        </AppCard>

        {/* Feature previews */}
        <div className="w-full max-w-sm mt-5 space-y-3">
          {[
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              ),
              label: 'Profil yönetimi',
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              ),
              label: 'Bulut senkronizasyonu',
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              ),
              label: 'Gizlilik ve güvenlik',
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 20V10M12 20V4M6 20v-6" />
                </svg>
              ),
              label: 'Detaylı istatistikler',
            },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/60"
            >
              <div className="w-8 h-8 rounded-xl bg-card flex items-center justify-center text-muted-foreground shadow-sm flex-shrink-0">
                {icon}
              </div>
              <span className="text-sm text-muted-foreground flex-1">{label}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-border flex-shrink-0"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-8 text-center">
          NoteZ v1.0.0 &middot; Türkçe
        </p>
      </main>
    </div>
  )
}
