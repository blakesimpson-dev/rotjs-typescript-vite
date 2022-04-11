import { Display as RotDisplay } from 'rot-js'

import { Dungeon } from '@/lib/dungeon'

export interface Scene {
  dungeon: Dungeon | null
  enter: () => void
  exit: () => void
  render: (display: RotDisplay) => void
  processInputEvent: (eventType: string, event: KeyboardEvent) => void
}

export type SceneCatalog = Record<string, Scene>
