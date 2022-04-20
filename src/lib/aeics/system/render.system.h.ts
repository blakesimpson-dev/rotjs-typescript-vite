import { Consoles } from '@/lib/console'

export class RenderSystem {
  private static _instance: RenderSystem

  readonly viewConsole: Consoles.ViewConsole
  readonly menuConsole: Consoles.MenuConsole
  readonly attributesConsole: Consoles.AttributesConsole
  readonly messageConsole: Consoles.MessageConsole
  readonly surroundsConsole: Consoles.SurroundsConsole
  readonly statusConsole: Consoles.StatusConsole

  constructor() {
    this.viewConsole = new Consoles.ViewConsole()
    this.menuConsole = new Consoles.MenuConsole()
    this.attributesConsole = new Consoles.AttributesConsole()
    this.messageConsole = new Consoles.MessageConsole()
    this.surroundsConsole = new Consoles.SurroundsConsole()
    this.statusConsole = new Consoles.StatusConsole()
  }

  clearConsoles() {
    this.viewConsole.display.clear()
    this.menuConsole.display.clear()
    this.attributesConsole.display.clear()
    this.messageConsole.display.clear()
    this.surroundsConsole.display.clear()
    this.statusConsole.display.clear()
  }

  render() {
    this.clearConsoles()
    const menuContainer = this.menuConsole.container
    const viewContainer = this.viewConsole.container
    if (menuContainer && viewContainer) {
      if (this.menuConsole.mode) {
        menuContainer.hidden = false
        viewContainer.hidden = true
        this.menuConsole.render()
      } else {
        menuContainer.hidden = true
        viewContainer.hidden = false
        this.viewConsole.render()
      }
    }
    this.attributesConsole.render()
    this.messageConsole.render()
    this.surroundsConsole.render()
    this.statusConsole.render()
  }

  static get instance(): RenderSystem {
    if (!RenderSystem._instance) {
      RenderSystem._instance = new RenderSystem()
    }

    return RenderSystem._instance
  }
}
