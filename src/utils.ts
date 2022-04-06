import { Display as RotDisplay } from 'rot-js'

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
