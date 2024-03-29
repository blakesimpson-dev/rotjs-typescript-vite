import { Display as RotDisplay } from 'rot-js'

export interface Console {
  display: RotDisplay
  container: HTMLElement | null
  render: (args?: Record<string, unknown>) => void
}
