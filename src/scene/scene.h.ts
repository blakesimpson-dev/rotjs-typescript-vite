import { Display } from 'rot-js'

export abstract class Scene {
  constructor(public name: string) {}

  public enter = (): void => {
    console.log(`Entered Scene: ${this.name}`)
  }

  public exit = (): void => {
    console.log(`Exited Scene: ${this.name}`)
  }

  public abstract render(display: Display): void

  public abstract processInputEvent(eventType: string, event: Event): void
}
