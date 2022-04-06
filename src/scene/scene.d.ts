import { Display as RotDisplay } from 'rot-js'

import { Map } from '@/Map'

export interface Scene {
  map: Map | null
  enter: () => void
  exit: () => void
  render: (display: RotDisplay) => void
  processInputEvent: (eventType: string, event: KeyboardEvent) => void
}

export type SceneCatalog = Record<string, Scene>
