import { GlyphProps } from '@/glyph'

export class Glyph {
  readonly symbol: string
  readonly fgColor: string
  readonly bgColor: string

  constructor(protected readonly props: GlyphProps) {
    this.symbol = props.symbol ?? ' '
    this.fgColor = props.fgColor ?? 'white'
    this.bgColor = props.bgColor ?? 'black'
  }
}
