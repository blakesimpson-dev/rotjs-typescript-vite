import { ColorCode } from '@/common'
import { GlyphProps } from '@/glyph'

export class Glyph {
  static readonly errorSymbol = '!'
  static readonly errorFgColor: ColorCode = 'pink'
  static readonly errorBgColor: ColorCode = 'red'
  static readonly defaultSymbol = ' '
  static readonly defaultFgColor: ColorCode = 'white'
  static readonly defaultBgColor: ColorCode = 'black'

  readonly symbol: string
  readonly fgColor: string
  readonly bgColor: string

  constructor(protected readonly props: GlyphProps) {
    this.symbol = props.symbol ?? Glyph.defaultSymbol
    this.fgColor = props.fgColor ?? Glyph.defaultFgColor
    this.bgColor = props.bgColor ?? Glyph.defaultBgColor
  }
}
