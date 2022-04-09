import { Display as RotDisplay } from 'rot-js'

import { ColorCode, Rect } from './common'

export function calcPercentChanceSuccess(chance: number): boolean {
  let success = false
  const outcome = Math.floor(Math.random() * 100) + 1
  if (outcome <= chance) {
    success = true
  }
  return success
}

export function drawRect(
  display: RotDisplay,
  rect: Rect,
  title?: string,
  fgColor?: ColorCode,
  bgColor?: ColorCode
): void {
  fgColor = fgColor ?? 'white'
  bgColor = bgColor ?? 'black'
  for (let x = rect.offsetX; x < rect.width; x++) {
    for (let y = rect.offsetY; y < rect.height; y++) {
      if (y === rect.offsetY) {
        if (x === rect.offsetX) {
          display.draw(x, y, '┌', fgColor, bgColor)
        } else if (x === rect.width - 1) {
          display.draw(x, y, '┐', fgColor, bgColor)
        } else {
          display.draw(x, y, '──', fgColor, bgColor)
        }
      } else if (y === rect.height - 1) {
        if (x === rect.offsetX) {
          display.draw(x, y, '└', fgColor, bgColor)
        } else if (x === rect.width - 1) {
          display.draw(x, y, '┘', fgColor, bgColor)
        } else {
          display.draw(x, y, '──', fgColor, bgColor)
        }
      } else if (x === rect.offsetX || x === rect.width - 1) {
        display.draw(x, y, '│', fgColor, bgColor)
      }
    }
  }
  if (title) {
    display.draw(rect.offsetX + 2, rect.offsetY, '┤', fgColor, bgColor)
    display.drawText(rect.offsetX + 3, rect.offsetY, title)
    display.draw(
      rect.offsetX + title.length + 3,
      rect.offsetY,
      '├',
      fgColor,
      bgColor
    )
  }
}

export async function fetchAsset(url: string): Promise<string> {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.text()
  })
}

export function removeRotColorNotation(text: string): string {
  const regex = /%c(.*?\})/g
  return text.replace(regex, '')
}

export function renderAsciiAsset(
  display: RotDisplay,
  text: string,
  fgColor: string,
  bgColor: string,
  offsetX: number,
  offsetY: number
) {
  const lines = text.split(/\r?\n/)
  lines.forEach((line, index) => {
    for (let x = 0; x < line.length; x++) {
      const char = line[x]
      display.draw(x + offsetX, index + offsetY, char, fgColor, bgColor)
    }
  })
}
