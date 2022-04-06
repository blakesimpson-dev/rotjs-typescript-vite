import { GlyphProps } from '@/glyph'

export class Glyph {
  static readonly errorSymbol = '!'
  static readonly errorFgColor = 'pink'
  static readonly errorBgColor = 'red'
  static readonly defaultSymbol = ' '
  static readonly defaultFgColor = 'white'
  static readonly defaultBgColor = 'black'

  readonly symbol: string
  readonly fgColor: string
  readonly bgColor: string

  constructor(protected readonly props: GlyphProps) {
    this.symbol = props.symbol ?? Glyph.defaultSymbol
    this.fgColor = props.fgColor ?? Glyph.defaultFgColor
    this.bgColor = props.bgColor ?? Glyph.defaultBgColor
  }
}
