import { Glyph } from '@/glyph'

export class Tile {
  constructor(private _glyph: Glyph) {}

  public get glyph(): Glyph {
    return this._glyph
  }
}
