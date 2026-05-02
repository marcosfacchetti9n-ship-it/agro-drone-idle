export type SoundName = 'click' | 'action' | 'upgrade' | 'success' | 'warning' | 'ai' | 'reset'

const SOUND_KEY = 'agro-drone-idle-sound'

let audioContext: AudioContext | null = null

const soundPatterns: Record<SoundName, Array<[number, number, OscillatorType]>> = {
  click: [
    [620, 0.045, 'triangle'],
  ],
  action: [
    [520, 0.055, 'sine'],
    [760, 0.07, 'triangle'],
  ],
  upgrade: [
    [440, 0.06, 'triangle'],
    [660, 0.07, 'triangle'],
    [880, 0.08, 'sine'],
  ],
  success: [
    [660, 0.06, 'sine'],
    [920, 0.09, 'triangle'],
  ],
  warning: [
    [180, 0.08, 'sawtooth'],
    [145, 0.08, 'sawtooth'],
  ],
  ai: [
    [760, 0.045, 'sine'],
    [1020, 0.06, 'sine'],
    [1280, 0.045, 'triangle'],
  ],
  reset: [
    [260, 0.08, 'triangle'],
    [180, 0.1, 'sine'],
  ],
}

function canUseAudio(): boolean {
  return typeof window !== 'undefined' && typeof window.AudioContext !== 'undefined'
}

function getAudioContext(): AudioContext | null {
  if (!canUseAudio()) return null
  audioContext ??= new window.AudioContext()
  return audioContext
}

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(SOUND_KEY) !== 'off'
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SOUND_KEY, enabled ? 'on' : 'off')
}

export function playSound(name: SoundName): void {
  if (!isSoundEnabled()) return

  const context = getAudioContext()
  if (!context) return

  if (context.state === 'suspended') {
    void context.resume()
  }

  const now = context.currentTime
  let offset = 0

  soundPatterns[name].forEach(([frequency, duration, type]) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const start = now + offset
    const end = start + duration

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, start)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.035, start + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, end)

    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(start)
    oscillator.stop(end + 0.01)

    offset += duration + 0.025
  })
}
