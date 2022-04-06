import { Glyph } from '@/glyph'
import { TileProps } from '@/tile'

export class Tile {
  readonly glyph: Glyph
  readonly isCollider: boolean
  readonly isDestructable: boolean

  constructor(protected readonly props: TileProps) {
    this.glyph = props.glyph
    this.isCollider = props.isCollider
    this.isDestructable = props.isDestructable
  }
}
