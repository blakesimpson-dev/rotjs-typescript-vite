import { Display } from 'rot-js'

export interface Scene {
  enter: () => void
  exit: () => void
  render: (display: Display) => void
  processInputEvent: (eventType: string, event: KeyboardEvent) => void
}

export type SceneCollection = Record<string, Scene>
