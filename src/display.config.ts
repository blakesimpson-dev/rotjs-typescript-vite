import { DisplayOptions } from 'rot-js/lib/display/types'

export const BaseDispOpt: Partial<DisplayOptions> = {
  width: 128,
  height: 64,
  fontSize: 16,
  forceSquareRatio: true,
  fontFamily: 'unscii-8',
}

export const ViewConsoleDispOpt: Partial<DisplayOptions> = {
  ...BaseDispOpt,
  fontSize: 32,
  width: 48,
  height: 20,
}

export const MenuConsoleDispOpt: Partial<DisplayOptions> = {
  ...BaseDispOpt,
  width: 96,
  height: 40,
}

export const AttributesConsoleDispOpt: Partial<DisplayOptions> = {
  ...BaseDispOpt,
  width: 96,
  height: 8,
}

export const MessageConsoleDispOpt: Partial<DisplayOptions> = {
  ...BaseDispOpt,
  width: 96,
  height: 16,
}

export const SurroundsConsoleDispOpt: Partial<DisplayOptions> = {
  ...BaseDispOpt,
  width: 32,
  height: 40,
}

export const StatusConsoleDispOpt: Partial<DisplayOptions> = {
  ...BaseDispOpt,
  width: 32,
  height: 24,
}
