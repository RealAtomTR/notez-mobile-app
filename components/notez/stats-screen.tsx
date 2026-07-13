'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AppCard, SectionHeader, Badge, ProgressRing } from './ui-primitives'
import { type Task, type DayStat, PRIORITY_META, CATEGORY_META } from '@/lib/mock-data'

/* ─── Bar chart for weekly stats ───────────────────────────── */
interface WeeklyBarProps {
  stats: DayStat[]
}
function WeeklyBar({ stats }: WeeklyBarProps) {
  const maxVal = Math.max(...stats.map((s) => s.total), 1)
  const [hovered, setHovered] = useState<number | null>(null)

  const BAR_MAX_H = 80 // px

  return (
    <div className="flex items-end gap-1.5" role="img" aria-label="Haftalık görev çubuğu grafiği"
      style={{ height: BAR_MAX_H + 36 }}>
      {stats.map((s, i) => {
        const totalPx = Math.max((s.total / maxVal) * BAR_MAX_H, 6)
        const compPx = s.total > 0 ? (s.completed / s.total) * totalPx : 0
        const pct = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0
        const isToday = i === (new Date().getDay() + 6) % 7
        return (
          <button
            key={s.day}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            aria-label={`${s.day}: ${s.completed} / ${s.total} tamamlandı`}
            className="flex-1 flex flex-col items-center gap-1.5 focus:outline-none"
          >
            {/* tooltip */}
            {hovered === i ? (
              <span className="text-[10px] font-bold text-foreground bg-card shadow rounded-md px-1.5 py-0.5 animate-scale-in whitespace-nowrap">
                {pct}%
              </span>
            ) : (
              <span className="h-5 block" />
            )}

            {/* bar wrapper — aligns bars to bottom */}
            <div className="relative flex items-end justify-center w-full"
              style={{ height: BAR_MAX_H }}>
              {/* total bar (background) */}
              <div
                className="absolute bottom-0 w-full rounded-lg bg-muted"
                style={{ height: totalPx }}
              />
              {/* completed bar (foreground) */}
              <div
                className="absolute bottom-0 w-full rounded-lg bg-teal transition-all duration-500"
                style={{ height: compPx }}
              />
            </div>

            <span className={cn(
              'text-[10px] font-medium transition-colors',
              isToday ? 'text-teal font-bold' : 'text-muted-foreground',
            )}>
              {s.day}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ─── Stat card ─────────────────────────────────────────────── */
interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  highlight?: boolean
  icon: React.ReactNode
}
function StatCard({ label, value, sub, highlight, icon }: StatCardProps) {
  return (
    <AppCard
      className={cn(
        'p-4 flex items-start justify-between',
        highlight && 'bg-header text-header-foreground',
      )}
      animate
    >
      <div>
        <p className={cn('text-xs font-medium', highlight ? 'text-header-foreground/60' : 'text-muted-foreground')}>
          {label}
        </p>
        <p className={cn('text-3xl font-bold mt-1', highlight ? 'text-header-foreground' : 'text-foreground')}>
          {value}
        </p>
        {sub && (
          <p className={cn('text-xs mt-0.5', highlight ? 'text-header-foreground/50' : 'text-muted-foreground')}>
            {sub}
          </p>
        )}
      </div>
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center',
        highlight ? 'bg-header-foreground/10' : 'bg-muted',
      )}>
        {icon}
      </div>
    </AppCard>
  )
}

/* ─── Category breakdown ────────────────────────────────────── */
interface CategoryBreakdownProps {
  tasks: Task[]
}
function CategoryBreakdown({ tasks }: CategoryBreakdownProps) {
  if (tasks.length === 0) return null
  const counts = tasks.reduce<Record<string, { total: number; completed: number }>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = { total: 0, completed: 0 }
    acc[t.category].total++
    if (t.completed) acc[t.category].completed++
    return acc
  }, {})

  const sorted = Object.entries(counts).sort((a, b) => b[1].total - a[1].total)

  return (
    <div className="space-y-3">
      {sorted.map(([cat, data]) => {
        const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
        const meta = CATEGORY_META[cat as keyof typeof CATEGORY_META]
        return (
          <div key={cat} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-sm flex-shrink-0">
              {meta?.icon ?? '•'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground">{meta?.label ?? cat}</span>
                <span className="text-xs text-muted-foreground">{data.completed}/{data.total}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <span className="text-xs font-semibold text-teal w-8 text-right">{pct}%</span>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Priority ring chart ───────────────────────────────────── */
interface PriorityBreakdownProps {
  tasks: Task[]
}
function PriorityBreakdown({ tasks }: PriorityBreakdownProps) {
  const total = tasks.length
  const priorities = ['yüksek', 'orta', 'düşük'] as const
  const colors = ['#f43f5e', '#f59e0b', '#14b8a6']

  return (
    <div className="flex items-center gap-4">
      {/* Donut chart – pure CSS/SVG */}
      <div className="relative flex-shrink-0">
        <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90" aria-hidden="true">
          {(() => {
            let offset = 0
            const r = 30
            const circ = 2 * Math.PI * r
            return priorities.map((p, i) => {
              const count = tasks.filter((t) => t.priority === p).length
              const frac = total > 0 ? count / total : 0
              const dash = frac * circ
              const element = (
                <circle
                  key={p}
                  cx="40" cy="40" r={r}
                  fill="none"
                  stroke={colors[i]}
                  strokeWidth="10"
                  strokeDasharray={`${dash} ${circ - dash}`}
                  strokeDashoffset={-offset * circ}
                  strokeLinecap="butt"
                />
              )
              offset += frac
              return element
            })
          })()}
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground rotate-0">
          {total}
        </span>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-2">
        {priorities.map((p, i) => {
          const count = tasks.filter((t) => t.priority === p).length
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          const meta = PRIORITY_META[p]
          return (
            <div key={p} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i] }} />
              <span className="text-xs text-muted-foreground flex-1">{meta.label}</span>
              <span className="text-xs font-semibold text-foreground">{count}</span>
              <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Stats Screen ──────────────────────────────────────────── */
interface StatsScreenProps {
  tasks: Task[]
  weeklyStats: DayStat[]
}

export function StatsScreen({ tasks, weeklyStats }: StatsScreenProps) {
  const completed = tasks.filter((t) => t.completed).length
  const total = tasks.length
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0

  const weeklyCompleted = weeklyStats.reduce((s, d) => s + d.completed, 0)
  const weeklyTotal = weeklyStats.reduce((s, d) => s + d.total, 0)
  const weeklyRate = weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0
  const bestDay = weeklyStats.reduce(
    (best, d) => {
      const rate = d.total > 0 ? d.completed / d.total : 0
      const bestRate = best.total > 0 ? best.completed / best.total : 0
      return rate > bestRate ? d : best
    },
    weeklyStats[0],
  )

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
            background: 'radial-gradient(ellipse 70% 80% at 50% 10%, oklch(0.58 0.13 195 / 0.5), transparent)',
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <h1 className="text-2xl font-bold text-header-foreground">İstatistikler</h1>
          <p className="text-sm text-header-foreground/60 mt-0.5">Bu haftanın özeti</p>

          {/* Big metric */}
          <div className="mt-5 flex items-center gap-4">
            <div className="relative">
              <ProgressRing value={weeklyRate} size={72} strokeWidth={6} />
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-header-foreground">
                {weeklyRate}%
              </span>
            </div>
            <div>
              <p className="text-4xl font-bold text-header-foreground leading-none">{weeklyCompleted}</p>
              <p className="text-sm text-header-foreground/60 mt-1">/ {weeklyTotal} görev tamamlandı</p>
              <Badge className="mt-2 bg-header-foreground/15 text-header-foreground border-none text-xs">
                En iyi gün: {bestDay.day}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="flex-1 px-4 pt-5 pb-6 space-y-6">
        {/* Quick stats grid */}
        <section>
          <SectionHeader title="Özet" />
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Tamamlanan"
              value={completed}
              sub="bugün"
              highlight
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-header-foreground" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4 12 14.01l-3-3" />
                </svg>
              }
            />
            <StatCard
              label="Bekleyen"
              value={total - completed}
              sub="görev"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-muted-foreground" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              }
            />
            <StatCard
              label="Oran"
              value={`${progress}%`}
              sub="bugün"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-muted-foreground" aria-hidden="true">
                  <path d="M18 20V10M12 20V4M6 20v-6" />
                </svg>
              }
            />
            <StatCard
              label="Haftalık"
              value={`${weeklyRate}%`}
              sub="tamamlanma"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-muted-foreground" aria-hidden="true">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Weekly bar chart */}
        <section>
          <AppCard className="p-4">
            <SectionHeader title="Haftalık Aktivite" className="mb-4" />
            <WeeklyBar stats={weeklyStats} />
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-teal" aria-hidden="true" />
                <span className="text-xs text-muted-foreground">Tamamlanan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-muted border border-border" aria-hidden="true" />
                <span className="text-xs text-muted-foreground">Toplam</span>
              </div>
              <span className="ml-auto text-xs font-semibold text-teal">{weeklyCompleted}/{weeklyTotal}</span>
            </div>
          </AppCard>
        </section>

        {/* Priority breakdown */}
        {tasks.length > 0 && (
          <section>
            <AppCard className="p-4">
              <SectionHeader title="Öncelik Dağılımı" className="mb-4" />
              <PriorityBreakdown tasks={tasks} />
            </AppCard>
          </section>
        )}

        {/* Category breakdown */}
        {tasks.length > 0 && (
          <section>
            <AppCard className="p-4">
              <SectionHeader title="Kategorilere Göre" className="mb-4" />
              <CategoryBreakdown tasks={tasks} />
            </AppCard>
          </section>
        )}

        {/* Motivational footer */}
        <AppCard
          className="p-4 text-center"
          style={{ background: 'linear-gradient(135deg, oklch(0.20 0.025 250), oklch(0.28 0.04 220))' } as React.CSSProperties}
        >
          <p className="text-sm font-semibold text-header-foreground">
            {weeklyRate >= 80
              ? 'Harika gidiyorsun! Devam et.'
              : weeklyRate >= 50
              ? 'İyi bir ilerleme kaydediyorsun.'
              : 'Her küçük adım önemlidir.'}
          </p>
          <p className="text-xs text-header-foreground/50 mt-1">
            Bu hafta {weeklyCompleted} görev tamamladın
          </p>
        </AppCard>
      </main>
    </div>
  )
}
