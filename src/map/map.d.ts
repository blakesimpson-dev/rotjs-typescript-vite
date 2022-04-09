import { Tile } from '@/tile'

export type MapTile = {
  tile: Tile
  pos: Position
}

export interface MapProps {
  mapTiles: MapTile[][]
}
