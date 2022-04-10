import { GlyphProps } from '@/lib/glyph'

export class Glyph {
  static readonly errorSymbol = '!'
  static readonly errorFgColor: string = 'yellow'
  static readonly errorBgColor: string = 'red'
  static readonly defaultSymbol = ' '
  static readonly defaultFgColor: string = 'white'
  static readonly defaultBgColor: string = 'black'
  symbol: string
  fgColor: string
  bgColor: string

  constructor(protected readonly props: GlyphProps) {
    this.symbol = props.symbol ?? Glyph.defaultSymbol
    this.fgColor = props.fgColor ?? Glyph.defaultFgColor
    this.bgColor = props.bgColor ?? Glyph.defaultBgColor
  }
}
