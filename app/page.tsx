'use client'

import { useState } from 'react'
import { BottomNav, type TabKey } from '@/components/notez/bottom-nav'
import { TodayScreen } from '@/components/notez/today-screen'
import { NotesScreen } from '@/components/notez/notes-screen'
import { StatsScreen } from '@/components/notez/stats-screen'
import { AccountScreen } from '@/components/notez/account-screen'
import { INITIAL_TASKS, INITIAL_NOTES, WEEKLY_STATS, type Task, type Note } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function NoteZApp() {
  const [activeTab, setActiveTab] = useState<TabKey>('bugun')
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES)

  return (
    /*
     * Mobile shell: centered, max-width 430px, full viewport height.
     * On larger screens the phone frame is shown; on real mobile it fills the screen.
     */
    <div className="min-h-dvh flex items-center justify-center bg-background p-0 md:p-6">
      <div
        className={cn(
          'relative w-full bg-background overflow-hidden',
          'md:max-w-[430px] md:rounded-[40px] md:shadow-2xl md:shadow-black/20 md:border md:border-border',
          'h-dvh md:h-[860px]',
        )}
        style={{ minHeight: '100dvh' }}
      >
        {/* Screen viewport */}
        <div className="h-full overflow-y-auto pb-20" id="screen-viewport">
          {activeTab === 'bugun' && (
            <TodayScreen tasks={tasks} onTasksChange={setTasks} />
          )}
          {activeTab === 'notlar' && (
            <NotesScreen notes={notes} onNotesChange={setNotes} />
          )}
          {activeTab === 'istatistikler' && (
            <StatsScreen tasks={tasks} weeklyStats={WEEKLY_STATS} />
          )}
          {activeTab === 'hesap' && (
            <AccountScreen />
          )}
        </div>

        {/* Bottom navigation — sits on top, sticky */}
        <BottomNav active={activeTab} onChange={(tab) => {
          setActiveTab(tab)
          // Scroll to top on tab change
          document.getElementById('screen-viewport')?.scrollTo({ top: 0, behavior: 'smooth' })
        }} />
      </div>
    </div>
  )
}
