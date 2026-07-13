'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AppCard, Badge, FAB, SectionHeader, EmptyState, BottomSheet, IconButton } from './ui-primitives'
import { type Note, INITIAL_NOTES } from '@/lib/mock-data'

/* ─── helpers ───────────────────────────────────────────────── */
function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Bugün'
  if (diffDays === 1) return 'Dün'
  if (diffDays < 7) return `${diffDays} gün önce`
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

const NOTE_COLORS = [
  { value: '#e8f4fd', label: 'Mavi' },
  { value: '#f0fdf4', label: 'Yeşil' },
  { value: '#fdf4ff', label: 'Mor' },
  { value: '#fffbeb', label: 'Sarı' },
  { value: '#fff7f7', label: 'Pembe' },
  { value: '#f0f9ff', label: 'Cyan' },
]

/* ─── NoteCard ──────────────────────────────────────────────── */
interface NoteCardProps {
  note: Note
  onClick: () => void
  onPin: () => void
  onDelete: () => void
}
function NoteCard({ note, onClick, onPin, onDelete }: NoteCardProps) {
  return (
    <AppCard
      onClick={onClick}
      animate
      className="p-4 relative overflow-hidden"
      style={{ backgroundColor: note.color } as React.CSSProperties}
    >
      {/* Pin indicator */}
      {note.pinned && (
        <div className="absolute top-3 right-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
            className="text-amber-500" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          </svg>
        </div>
      )}

      <h3 className="text-sm font-semibold text-foreground leading-snug pr-5 text-balance line-clamp-2">
        {note.title}
      </h3>
      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-3">
        {note.content}
      </p>

      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px] border-black/10">
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-black/5">
        <span className="text-[10px] text-muted-foreground">{formatRelativeDate(note.updatedAt)}</span>
        <div className="flex gap-1">
          <button
            aria-label={note.pinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
            onClick={(e) => { e.stopPropagation(); onPin() }}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              note.pinned ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500',
            )}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill={note.pinned ? 'currentColor' : 'none'}
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            </svg>
          </button>
          <button
            aria-label="Notu sil"
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            </svg>
          </button>
        </div>
      </div>
    </AppCard>
  )
}

/* ─── Note Editor (BottomSheet) ─────────────────────────────── */
interface NoteEditorProps {
  note?: Note
  onSave: (note: Note) => void
  onClose: () => void
}
function NoteEditor({ note, onSave, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title ?? '')
  const [content, setContent] = useState(note?.content ?? '')
  const [color, setColor] = useState(note?.color ?? NOTE_COLORS[0].value)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(note?.tags ?? [])

  function handleSave() {
    if (!title.trim() && !content.trim()) return
    const now = new Date().toISOString()
    onSave({
      id: note?.id ?? `n${Date.now()}`,
      title: title.trim() || 'Başlıksız not',
      content: content.trim(),
      color,
      pinned: note?.pinned ?? false,
      createdAt: note?.createdAt ?? now,
      updatedAt: now,
      tags,
    })
    onClose()
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput('')
  }

  return (
    <div className="space-y-4">
      {/* Color picker */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Renk</p>
        <div className="flex gap-2">
          {NOTE_COLORS.map((c) => (
            <button
              key={c.value}
              aria-label={c.label}
              onClick={() => setColor(c.value)}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-transform active:scale-90',
                color === c.value ? 'border-foreground scale-110' : 'border-transparent',
              )}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="note-title" className="block text-xs font-medium text-muted-foreground mb-1">
          Başlık
        </label>
        <input
          id="note-title"
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Not başlığı..."
          className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="note-content" className="block text-xs font-medium text-muted-foreground mb-1">
          İçerik
        </label>
        <textarea
          id="note-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          placeholder="Notunuzu buraya yazın..."
          className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none leading-relaxed"
        />
      </div>

      {/* Tags */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Etiketler</p>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) addTag()
            }}
            placeholder="etiket ekle..."
            className="flex-1 px-3 py-2 rounded-xl bg-muted border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={addTag}
            className="px-4 py-2 rounded-xl bg-secondary text-xs font-medium text-secondary-foreground"
          >
            Ekle
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTags(tags.filter((x) => x !== t))}
                className="px-2 py-0.5 bg-muted rounded-full text-xs text-muted-foreground flex items-center gap-1"
              >
                #{t}
                <span aria-hidden="true" className="text-muted-foreground/60">×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={!title.trim() && !content.trim()}
        className="w-full py-3.5 rounded-xl bg-header text-header-foreground text-sm font-semibold disabled:opacity-40 transition-opacity active:scale-[0.98]"
      >
        {note ? 'Güncelle' : 'Kaydet'}
      </button>
    </div>
  )
}

/* ─── Notes Screen ──────────────────────────────────────────── */
interface NotesScreenProps {
  notes: Note[]
  onNotesChange: (notes: Note[]) => void
}

export function NotesScreen({ notes, onNotesChange }: NotesScreenProps) {
  const [search, setSearch] = useState('')
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined)
  const [showEditor, setShowEditor] = useState(false)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const pinnedNotes = notes.filter((n) => n.pinned)
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)))

  const filtered = notes.filter((n) => {
    const matchSearch =
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
    const matchTag = !activeTag || n.tags.includes(activeTag)
    return matchSearch && matchTag
  })

  const unpinnedFiltered = filtered.filter((n) => !n.pinned)
  const pinnedFiltered = filtered.filter((n) => n.pinned)

  function handleSave(note: Note) {
    const exists = notes.find((n) => n.id === note.id)
    if (exists) {
      onNotesChange(notes.map((n) => (n.id === note.id ? note : n)))
    } else {
      onNotesChange([note, ...notes])
    }
  }

  function handleDelete(id: string) {
    onNotesChange(notes.filter((n) => n.id !== id))
  }

  function handlePin(id: string) {
    onNotesChange(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)))
  }

  function openNew() {
    setEditingNote(undefined)
    setShowEditor(true)
  }

  function openEdit(note: Note) {
    setEditingNote(note)
    setShowEditor(true)
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Dark glass header ── */}
      <header
        className="bg-header text-header-foreground px-4 pt-12 pb-5 relative overflow-hidden"
        style={{ borderRadius: '0 0 28px 28px' }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(ellipse 50% 70% at 30% 30%, oklch(0.58 0.13 195 / 0.6), transparent)',
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <h1 className="text-2xl font-bold text-header-foreground">Notlar</h1>
          <p className="text-sm text-header-foreground/60 mt-0.5">{notes.length} not</p>

          {/* Search */}
          <div className="mt-4 relative">
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-header-foreground/40"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Not ara..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-header-foreground/10 text-sm text-header-foreground placeholder:text-header-foreground/40 focus:outline-none focus:ring-2 focus:ring-header-foreground/20 border border-header-foreground/10"
            />
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="flex-1 px-4 pt-5 pb-6">
        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
            <button
              onClick={() => setActiveTag(null)}
              className={cn(
                'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                !activeTag ? 'bg-header text-header-foreground' : 'bg-muted text-muted-foreground',
              )}
            >
              Tümü
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={cn(
                  'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  activeTag === tag ? 'bg-header text-header-foreground' : 'bg-muted text-muted-foreground',
                )}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
            }
            title={search ? 'Sonuç bulunamadı' : 'Henüz not yok'}
            description={
              search
                ? `"${search}" aramasıyla eşleşen not bulunamadı.`
                : 'İlk notunuzu oluşturun.'
            }
            action={
              !search ? (
                <button
                  onClick={openNew}
                  className="px-5 py-2.5 rounded-xl bg-header text-header-foreground text-sm font-medium"
                >
                  Not Ekle
                </button>
              ) : undefined
            }
          />
        ) : (
          <>
            {/* Pinned */}
            {pinnedFiltered.length > 0 && (
              <section className="mb-5">
                <SectionHeader title="Sabitlenmiş" />
                <div className="grid grid-cols-2 gap-3 stagger">
                  {pinnedFiltered.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onClick={() => openEdit(note)}
                      onPin={() => handlePin(note.id)}
                      onDelete={() => handleDelete(note.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* All / Unpinned */}
            {unpinnedFiltered.length > 0 && (
              <section>
                <SectionHeader title={pinnedFiltered.length > 0 ? 'Diğer Notlar' : 'Tüm Notlar'} />
                <div className="grid grid-cols-2 gap-3 stagger">
                  {unpinnedFiltered.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onClick={() => openEdit(note)}
                      onPin={() => handlePin(note.id)}
                      onDelete={() => handleDelete(note.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* ── FAB ── */}
      <FAB onClick={openNew} label="Yeni not ekle">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </FAB>

      {/* ── Note Editor ── */}
      <BottomSheet
        open={showEditor}
        onClose={() => setShowEditor(false)}
        title={editingNote ? 'Notu Düzenle' : 'Yeni Not'}
      >
        <NoteEditor
          key={editingNote?.id ?? 'new'}
          note={editingNote}
          onSave={handleSave}
          onClose={() => setShowEditor(false)}
        />
      </BottomSheet>
    </div>
  )
}
