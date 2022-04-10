import { Tile } from '@/lib/tile'

export interface TileMapBuilderProps {
  width: number
  height: number
  depth: number
}

export interface TileMapProps {
  tiles: Tile[][]
}
