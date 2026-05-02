import { useEffect } from 'react'
import { DronePanel } from './components/DronePanel'
import { EventFeed } from './components/EventFeed'
import { FieldGrid } from './components/FieldGrid'
import { Header } from './components/Header'
import { OperatorStation } from './components/OperatorStation'
import { UpgradePanel } from './components/UpgradePanel'
import { saveGameState } from './services/saveService'
import { useGameStore } from './store/gameStore'

function App() {
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      useGameStore.getState().runTick()
    }, 1000)

    const flushSave = () => saveGameState(useGameStore.getState())
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flushSave()
    }

    window.addEventListener('beforeunload', flushSave)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('beforeunload', flushSave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      flushSave()
    }
  }, [])

  return (
    <div className="min-h-screen text-slate-100">
      <Header />
      <main className="mx-auto flex w-full max-w-[1800px] flex-col gap-4 p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
          <OperatorStation />
          <FieldGrid />
          <DronePanel />
        </div>

        <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1fr)_420px]">
          <UpgradePanel />
          <EventFeed />
        </div>
      </main>
    </div>
  )
}

export default App
