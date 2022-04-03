import { Display } from 'rot-js'

export abstract class Scene {
  public abstract enter(): void
  public abstract exit(): void
  public abstract render(display: Display): void
  public abstract processInputEvent(eventType: string, event: Event): void
}
