'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import {
  AppCard,
  Badge,
  Checkbox,
  FAB,
  SectionHeader,
  EmptyState,
  ProgressRing,
  BottomSheet,
  IconButton,
} from './ui-primitives'
import {
  type Task,
  type Priority,
  type TaskCategory,
  PRIORITY_META,
  CATEGORY_META,
  getTurkishDayOfWeek,
  getTurkishDate,
} from '@/lib/mock-data'

/* ─── Task Card ─────────────────────────────────────────────── */
interface TaskCardProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}
function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const pMeta = PRIORITY_META[task.priority]
  const cMeta = CATEGORY_META[task.category]

  return (
    <AppCard
      className={cn(
        'p-4 flex items-start gap-3 transition-opacity duration-300',
        task.completed && 'opacity-60',
      )}
      animate
    >
      <Checkbox
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        label={`"${task.title}" görevini tamamla`}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium text-foreground leading-snug',
          task.completed && 'line-through text-muted-foreground',
        )}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed truncate">
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {task.dueTime && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {task.dueTime}
            </span>
          )}
          <Badge variant={task.priority === 'yüksek' ? 'rose' : task.priority === 'orta' ? 'amber' : 'teal'}>
            {pMeta.label}
          </Badge>
          <Badge variant="muted">{cMeta.label}</Badge>
        </div>
      </div>
      <button
        aria-label={`"${task.title}" görevini sil`}
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
        </svg>
      </button>
    </AppCard>
  )
}

/* ─── Add Task Form (inside BottomSheet) ────────────────────── */
interface AddTaskFormProps {
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void
  onClose: () => void
}
function AddTaskForm({ onAdd, onClose }: AddTaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('orta')
  const [category, setCategory] = useState<TaskCategory>('kişisel')
  const [dueTime, setDueTime] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit() {
    if (!title.trim()) return
    onAdd({ title: title.trim(), description, priority, category, dueTime, completed: false })
    onClose()
  }

  const priorities: Priority[] = ['yüksek', 'orta', 'düşük']
  const categories: TaskCategory[] = ['iş', 'kişisel', 'alışveriş', 'sağlık', 'eğitim']

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="task-title" className="block text-xs font-medium text-muted-foreground mb-1">
          Görev başlığı *
        </label>
        <input
          id="task-title"
          ref={inputRef}
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSubmit()
          }}
          placeholder="Yeni görev ekle..."
          className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="task-desc" className="block text-xs font-medium text-muted-foreground mb-1">
          Açıklama (isteğe bağlı)
        </label>
        <textarea
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Detayları buraya yazın..."
          className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {/* Due time */}
      <div>
        <label htmlFor="task-time" className="block text-xs font-medium text-muted-foreground mb-1">
          Saat
        </label>
        <input
          id="task-time"
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Priority */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Öncelik</p>
        <div className="flex gap-2">
          {priorities.map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={cn(
                'flex-1 py-2 rounded-xl text-xs font-medium transition-all',
                priority === p
                  ? p === 'yüksek'
                    ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-300'
                    : p === 'orta'
                    ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-300'
                    : 'bg-teal-muted text-teal ring-2 ring-teal/40'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {PRIORITY_META[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Kategori</p>
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                category === c
                  ? 'bg-header text-header-foreground'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {CATEGORY_META[c].label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!title.trim()}
        className="w-full py-3.5 rounded-xl bg-header text-header-foreground text-sm font-semibold disabled:opacity-40 transition-opacity active:scale-[0.98]"
      >
        Görevi Ekle
      </button>
    </div>
  )
}

/* ─── Today Screen ─────────────────────────────────────────── */
interface TodayScreenProps {
  tasks: Task[]
  onTasksChange: (tasks: Task[]) => void
}

export function TodayScreen({ tasks, onTasksChange }: TodayScreenProps) {
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState<'tümü' | 'aktif' | 'tamamlanan'>('tümü')

  const completedCount = tasks.filter((t) => t.completed).length
  const totalCount = tasks.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  function handleToggle(id: string) {
    onTasksChange(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  function handleDelete(id: string) {
    onTasksChange(tasks.filter((t) => t.id !== id))
  }

  function handleAdd(task: Omit<Task, 'id' | 'createdAt'>) {
    const newTask: Task = {
      ...task,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    onTasksChange([newTask, ...tasks])
  }

  const filters: { key: typeof filter; label: string }[] = [
    { key: 'tümü', label: 'Tümü' },
    { key: 'aktif', label: 'Aktif' },
    { key: 'tamamlanan', label: 'Tamamlanan' },
  ]

  const filtered = tasks.filter((t) => {
    if (filter === 'aktif') return !t.completed
    if (filter === 'tamamlanan') return t.completed
    return true
  })

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Dark glass header ── */}
      <header
        className="bg-header text-header-foreground px-4 pt-12 pb-5 relative overflow-hidden"
        style={{ borderRadius: '0 0 28px 28px' }}
      >
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(ellipse 60% 80% at 80% 20%, oklch(0.58 0.13 195 / 0.6), transparent)',
          }}
          aria-hidden="true"
        />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-header-foreground/60 uppercase tracking-widest">
              {getTurkishDayOfWeek()}
            </p>
            <h1 className="text-2xl font-bold text-header-foreground mt-0.5 text-balance">
              Bugün
            </h1>
            <p className="text-sm text-header-foreground/60 mt-0.5">{getTurkishDate()}</p>
          </div>

          {/* Progress ring */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative">
              <ProgressRing value={progress} size={56} strokeWidth={4.5} />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-header-foreground">
                {progress}%
              </span>
            </div>
            <p className="text-[10px] text-header-foreground/50">
              {completedCount}/{totalCount}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-header-foreground/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Stats chips */}
        <div className="flex gap-3 mt-3">
          <div className="flex-1 bg-header-foreground/10 rounded-xl px-3 py-2 text-center">
            <p className="text-lg font-bold text-header-foreground">{totalCount - completedCount}</p>
            <p className="text-[10px] text-header-foreground/50">Bekliyor</p>
          </div>
          <div className="flex-1 bg-header-foreground/10 rounded-xl px-3 py-2 text-center">
            <p className="text-lg font-bold text-header-foreground">{completedCount}</p>
            <p className="text-[10px] text-header-foreground/50">Bitti</p>
          </div>
          <div className="flex-1 bg-header-foreground/10 rounded-xl px-3 py-2 text-center">
            <p className="text-lg font-bold text-header-foreground">{totalCount}</p>
            <p className="text-[10px] text-header-foreground/50">Toplam</p>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="flex-1 px-4 pt-5 pb-6">
        {/* Filter tabs */}
        <div className="flex bg-muted rounded-xl p-1 mb-5 gap-1">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                'flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200',
                filter === key
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground',
              )}
              aria-pressed={filter === key}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Task list */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            }
            title={filter === 'tamamlanan' ? 'Henüz tamamlanan yok' : 'Görev yok'}
            description={
              filter === 'tamamlanan'
                ? 'Bir görevi tamamladığında burada görünecek.'
                : 'Bugün için yeni bir görev ekleyin.'
            }
            action={
              filter !== 'tamamlanan' ? (
                <button
                  onClick={() => setShowAdd(true)}
                  className="px-5 py-2.5 rounded-xl bg-header text-header-foreground text-sm font-medium"
                >
                  Görev Ekle
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-3 stagger">
            {filtered.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      {/* ── FAB ── */}
      <FAB onClick={() => setShowAdd(true)} label="Yeni görev ekle">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </FAB>

      {/* ── Add Task Sheet ── */}
      <BottomSheet open={showAdd} onClose={() => setShowAdd(false)} title="Yeni Görev">
        <AddTaskForm onAdd={handleAdd} onClose={() => setShowAdd(false)} />
      </BottomSheet>
    </div>
  )
}
