export type Priority = 'yüksek' | 'orta' | 'düşük'
export type TaskCategory = 'iş' | 'kişisel' | 'alışveriş' | 'sağlık' | 'eğitim'

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: Priority
  category: TaskCategory
  dueTime?: string
  createdAt: string
}

export interface Note {
  id: string
  title: string
  content: string
  color: string
  pinned: boolean
  createdAt: string
  updatedAt: string
  tags: string[]
}

export interface DayStat {
  day: string          // 'Pzt' | 'Sal' ...
  completed: number
  total: number
}

// ---------- Initial Tasks ----------
export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Proje raporunu tamamla',
    description: 'Q3 raporunu hazırla ve ekibe gönder',
    completed: false,
    priority: 'yüksek',
    category: 'iş',
    dueTime: '10:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't2',
    title: 'Sabah koşusu',
    description: '5 km parkur',
    completed: true,
    priority: 'orta',
    category: 'sağlık',
    dueTime: '07:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't3',
    title: 'Alışveriş listesini hazırla',
    completed: false,
    priority: 'düşük',
    category: 'alışveriş',
    dueTime: '14:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't4',
    title: 'Online kurs videosu izle',
    description: 'TypeScript modülü - Bölüm 4',
    completed: false,
    priority: 'orta',
    category: 'eğitim',
    dueTime: '20:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't5',
    title: 'Doktor randevusunu onayla',
    completed: true,
    priority: 'yüksek',
    category: 'sağlık',
    dueTime: '09:30',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't6',
    title: 'Aile toplantısı planla',
    completed: false,
    priority: 'orta',
    category: 'kişisel',
    dueTime: '18:00',
    createdAt: new Date().toISOString(),
  },
]

// ---------- Initial Notes ----------
export const INITIAL_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'Haftalık hedefler',
    content:
      'Bu hafta odaklanmak istediğim 3 temel alan:\n1. Proje teslimi\n2. Düzenli egzersiz\n3. Kitap okuma',
    color: '#e8f4fd',
    pinned: true,
    createdAt: '2025-07-10T08:00:00Z',
    updatedAt: '2025-07-12T10:30:00Z',
    tags: ['hedef', 'haftalık'],
  },
  {
    id: 'n2',
    title: 'Fikir listesi',
    content:
      'Yeni uygulama fikirleri:\n- Türkçe podcast rehberi\n- Yerel etkinlik haritası\n- Meditasyon takipçisi',
    color: '#f0fdf4',
    pinned: true,
    createdAt: '2025-07-08T14:00:00Z',
    updatedAt: '2025-07-11T16:00:00Z',
    tags: ['fikir', 'proje'],
  },
  {
    id: 'n3',
    title: 'Kitap notları — Derin İş',
    content:
      '"Derin Çalışma" kavramı: kesintisiz odaklanma dönemlerinde yoğun bilişsel çabayı gerektiren mesleki faaliyetler.',
    color: '#fdf4ff',
    pinned: false,
    createdAt: '2025-07-07T20:00:00Z',
    updatedAt: '2025-07-07T20:45:00Z',
    tags: ['kitap', 'öğrenme'],
  },
  {
    id: 'n4',
    title: 'Alışveriş listesi',
    content: '- Ekmek\n- Süt\n- Kahve\n- Zeytinyağı\n- Domates\n- Peynir',
    color: '#fffbeb',
    pinned: false,
    createdAt: '2025-07-13T07:00:00Z',
    updatedAt: '2025-07-13T07:00:00Z',
    tags: ['alışveriş'],
  },
  {
    id: 'n5',
    title: 'Toplantı notları',
    content:
      'Sprint planlama:\n- Yeni özellikler: bildirim sistemi\n- Bug fix: login sayfası\n- Refactor: API katmanı',
    color: '#fff7f7',
    pinned: false,
    createdAt: '2025-07-12T11:00:00Z',
    updatedAt: '2025-07-12T12:30:00Z',
    tags: ['iş', 'toplantı'],
  },
]

// ---------- Weekly Stats ----------
export const WEEKLY_STATS: DayStat[] = [
  { day: 'Pzt', completed: 5, total: 6 },
  { day: 'Sal', completed: 3, total: 5 },
  { day: 'Çar', completed: 7, total: 8 },
  { day: 'Per', completed: 4, total: 7 },
  { day: 'Cum', completed: 6, total: 6 },
  { day: 'Cmt', completed: 2, total: 4 },
  { day: 'Paz', completed: 1, total: 3 },
]

// ---------- Helpers ----------
export const PRIORITY_META: Record<Priority, { label: string; color: string; bg: string }> = {
  yüksek: { label: 'Yüksek', color: 'text-rose-600',    bg: 'bg-rose-50' },
  orta:   { label: 'Orta',   color: 'text-amber-600',   bg: 'bg-amber-50' },
  düşük:  { label: 'Düşük',  color: 'text-teal-600',    bg: 'bg-teal-50' },
}

export const CATEGORY_META: Record<TaskCategory, { label: string; icon: string }> = {
  iş:         { label: 'İş',        icon: '💼' },
  kişisel:    { label: 'Kişisel',   icon: '🏠' },
  alışveriş:  { label: 'Alışveriş',icon: '🛒' },
  sağlık:     { label: 'Sağlık',   icon: '❤️' },
  eğitim:     { label: 'Eğitim',   icon: '📚' },
}

export function getTurkishDayOfWeek(): string {
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
  return days[new Date().getDay()]
}

export function getTurkishDate(): string {
  const months = [
    'Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
    'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık',
  ]
  const now = new Date()
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
}
