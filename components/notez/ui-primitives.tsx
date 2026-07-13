'use client'

import { cn } from '@/lib/utils'
import { type ReactNode, forwardRef } from 'react'

/* ─── AppCard ──────────────────────────────────────────────── */
interface AppCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  animate?: boolean
}
export function AppCard({ children, className, onClick, animate = false }: AppCardProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      onClick={onClick}
      className={cn(
        'bg-card rounded-2xl shadow-sm border border-border',
        onClick && 'cursor-pointer active:scale-[0.98] transition-transform duration-150',
        animate && 'animate-scale-in',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ─── Badge ────────────────────────────────────────────────── */
interface BadgeProps {
  children: ReactNode
  className?: string
  variant?: 'teal' | 'rose' | 'amber' | 'muted' | 'outline'
}
export function Badge({ children, className, variant = 'muted' }: BadgeProps) {
  const variants: Record<string, string> = {
    teal:    'bg-teal-muted text-teal-foreground',
    rose:    'bg-rose-50 text-rose-600',
    amber:   'bg-amber-50 text-amber-600',
    muted:   'bg-muted text-muted-foreground',
    outline: 'border border-border text-muted-foreground bg-transparent',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium leading-none',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ─── IconButton ───────────────────────────────────────────── */
interface IconButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  label: string
  variant?: 'ghost' | 'filled' | 'teal'
}
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, onClick, className, label, variant = 'ghost' }, ref) => {
    const variants: Record<string, string> = {
      ghost:  'bg-transparent hover:bg-muted text-foreground',
      filled: 'bg-secondary hover:bg-muted text-foreground',
      teal:   'bg-teal text-teal-foreground hover:opacity-90',
    }
    return (
      <button
        ref={ref}
        onClick={onClick}
        aria-label={label}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-150',
          'active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          variants[variant],
          className,
        )}
      >
        {children}
      </button>
    )
  },
)
IconButton.displayName = 'IconButton'

/* ─── FAB (Floating Action Button) ────────────────────────── */
interface FABProps {
  onClick: () => void
  label: string
  children: ReactNode
}
export function FAB({ onClick, label, children }: FABProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        'fixed bottom-24 right-4 z-40',
        'w-14 h-14 rounded-2xl',
        'bg-header text-header-foreground',
        'shadow-lg shadow-black/20',
        'flex items-center justify-center',
        'active:scale-90 transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
    >
      {children}
    </button>
  )
}

/* ─── SectionHeader ────────────────────────────────────────── */
interface SectionHeaderProps {
  title: string
  action?: ReactNode
  className?: string
}
export function SectionHeader({ title, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)}>
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {title}
      </h2>
      {action}
    </div>
  )
}

/* ─── EmptyState ───────────────────────────────────────────── */
interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 text-2xl">
        {icon}
      </div>
      <p className="font-semibold text-foreground mb-1">{title}</p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
      {action}
    </div>
  )
}

/* ─── ProgressRing ─────────────────────────────────────────── */
interface ProgressRingProps {
  value: number   // 0-100
  size?: number
  strokeWidth?: number
  className?: string
}
export function ProgressRing({ value, size = 52, strokeWidth = 4, className }: ProgressRingProps) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  return (
    <svg width={size} height={size} className={cn('-rotate-90', className)} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="currentColor" strokeWidth={strokeWidth} className="text-border" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="currentColor" strokeWidth={strokeWidth}
        className="text-teal transition-all duration-500"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round" />
    </svg>
  )
}

/* ─── Checkbox ─────────────────────────────────────────────── */
interface CheckboxProps {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  className?: string
}
export function Checkbox({ checked, onChange, label, className }: CheckboxProps) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0',
        'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        checked
          ? 'bg-teal border-teal'
          : 'bg-transparent border-border hover:border-teal/60',
        className,
      )}
    >
      {checked && (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true"
          className="animate-check">
          <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

/* ─── BottomSheet (simple modal overlay) ──────────────────── */
interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}
export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  if (!open) return null
  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-2xl max-h-[90dvh] overflow-y-auto animate-slide-up"
      >
        {/* handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>
        <div className="px-4 pb-2 flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <IconButton onClick={onClose} label="Kapat" variant="ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </IconButton>
        </div>
        <div className="px-4 pb-8">{children}</div>
      </div>
    </>
  )
}
