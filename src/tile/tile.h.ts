import { Glyph } from '@/glyph'

export class Tile {
  private _glyph: Glyph | null = null

  constructor(protected glyph: Glyph) {
    this._glyph = glyph
  }

  public get Glyph(): Glyph | null {
    return this._glyph
  }
}
