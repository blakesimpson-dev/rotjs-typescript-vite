export class Glyph {
  private _symbol = ' '
  private _fgColor = 'white'
  private _bgColor = 'black'

  constructor(
    protected symbol?: string,
    protected fgColor?: string,
    protected bgColor?: string
  ) {
    this._symbol = symbol ?? this._symbol
    this._fgColor = fgColor ?? this._fgColor
    this._bgColor = bgColor ?? this._bgColor
  }

  public get Symbol(): string {
    return this._symbol
  }

  public get ForegroundColor(): string {
    return this._fgColor
  }

  public get BackgroundColor(): string {
    return this._bgColor
  }
}
