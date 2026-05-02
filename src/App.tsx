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
    <div className="h-dvh overflow-hidden text-slate-900">
      <Header />
      <main className="mx-auto grid h-[calc(100dvh-76px)] w-full max-w-[1780px] grid-cols-1 grid-rows-none gap-3 overflow-y-auto p-3 xl:grid-cols-[280px_minmax(0,1fr)_330px] xl:grid-rows-[minmax(0,1fr)_176px] xl:overflow-hidden">
        <OperatorStation />
        <FieldGrid />
        <DronePanel />
        <UpgradePanel />
        <EventFeed />
      </main>
    </div>
  )
}

export default App
