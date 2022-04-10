import { Display as RotDisplay } from 'rot-js'

import { TileMap } from '@/lib/tilemap'

export interface Scene {
  tileMap: TileMap | null
  enter: () => void
  exit: () => void
  render: (display: RotDisplay) => void
  processInputEvent: (eventType: string, event: KeyboardEvent) => void
}

export type SceneCatalog = Record<string, Scene>
