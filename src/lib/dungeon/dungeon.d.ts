import { Tile } from '@/lib/tile'

export interface DungeonBuilderProps {
  width: number
  height: number
  depth: number
}

export interface DungeonProps {
  tiles: Tile[][][]
}
