import { GlyphOptions } from './'

export class Glyph {
  private _symbol: string
  private _fgColor: string
  private _bgColor: string

  constructor(protected options: GlyphOptions) {
    this._symbol = options.symbol ?? ' '
    this._fgColor = options.fgColor ?? 'white'
    this._bgColor = options.bgColor ?? 'black'
  }

  public get symbol(): string {
    return this._symbol
  }

  public get fgColor(): string {
    return this._fgColor
  }

  public get bgColor(): string {
    return this._bgColor
  }
}
