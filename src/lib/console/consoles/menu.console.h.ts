import { Display as RotDisplay, KEYS as RotKeys } from 'rot-js'

import { MenuConsoleDispOpt } from '@/display.config'
import { Components, InputSystem, Item, RenderSystem } from '@/lib/aeics'
import { alphabet } from '@/lib/common'
import { Console } from '@/lib/console'
import { Game } from '@/lib/game'
import { drawRect } from '@/utils'

type MenuMode = 'Main' | 'Inventory' | 'GetItems' | 'DropItems' | null

export class MenuConsole implements Console {
  readonly display: RotDisplay
  readonly container: HTMLElement | null
  private _mode: MenuMode = null
  private _selectedIndices: Record<string, boolean> = {}

  get mode(): MenuMode {
    return this._mode ?? null
  }

  set mode(mode: MenuMode) {
    this._mode = mode
  }

  constructor() {
    this.display = new RotDisplay(MenuConsoleDispOpt)
    this.container = this.display.getContainer()
  }

  getMenuTitle(mode: MenuMode): string | undefined {
    switch (mode) {
      case 'Main':
        return 'Main Menu'

      case 'Inventory':
        return 'Inventory'

      case 'GetItems':
        return 'Pick Up Items'

      case 'DropItems':
        return 'Drop Items'

      default:
        return undefined
    }
  }

  render(): void {
    switch (this._mode) {
      case 'Main':
        this.renderMainMenu()
        break

      case 'Inventory':
        this.renderInventoryMenu()
        break

      case 'GetItems':
        this.renderGetItemsMenu()
        break

      case 'DropItems':
        this.renderDropItemsMenu()
        break

      default:
        break
    }

    drawRect(
      this.display,
      {
        width: this.display._options.width,
        height: this.display._options.height,
        offsetX: 0,
        offsetY: 0,
      },
      this.getMenuTitle(this._mode),
      '#716391'
    )
  }

  renderMainMenu() {
    // main menu options
  }

  renderInventoryMenu() {
    const items: Item[] = Game.instance.player
      .getComponent(Components.InventoryComponent)
      .getItems()
    this.renderItemList(items, this._selectedIndices, false, false)
  }

  renderGetItemsMenu() {
    const playerPosition = Game.instance.player.getComponent(
      Components.TransformComponent
    ).position
    const items: Item[] | undefined =
      Game.instance.currentScene.dungeon?.getItemsAt(playerPosition)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we have guaranteed that an item is present
    this.renderItemList(items!, this._selectedIndices, true, true)
  }

  renderDropItemsMenu() {
    const items: Item[] = Game.instance.player
      .getComponent(Components.InventoryComponent)
      .getItems()
    this.renderItemList(items, this._selectedIndices, true, false)
  }

  renderItemList(
    items: Item[],
    selectedIndices: Record<string, boolean> = {},
    canSelectItem: boolean,
    canSelectMultipleItems: boolean
  ) {
    let row = 0
    for (let i = 0; i < items.length; i++) {
      if (items[i]) {
        const letter = alphabet.substring(i, i + 1)
        const selectionState =
          canSelectItem && canSelectMultipleItems && selectedIndices[i]
            ? '+'
            : '-'
        this.display.drawText(
          1,
          1 + row,
          letter + ' ' + selectionState + ' ' + items[i].describeA(true)
        )
        row++
      }
    }
  }

  processInputEvent(eventType: string, event: KeyboardEvent) {
    switch (this._mode) {
      case 'Main':
        this.processMainMenuInput(eventType, event)
        break

      case 'Inventory':
        this.processInventoryMenuInput(eventType, event)
        break

      case 'GetItems':
        this.processGetItemsMenuInput(eventType, event)
        break

      case 'DropItems':
        this.processDropItemsMenuInput(eventType, event)
        break

      default:
        break
    }
  }

  processMainMenuInput(eventType: string, event: KeyboardEvent): void {
    if (eventType === 'keydown') {
      switch (event.keyCode) {
        case RotKeys.VK_ESCAPE:
          RenderSystem.instance.menuConsole.mode = null
          InputSystem.instance.targetConsole = RenderSystem.instance.viewConsole
          break

        default:
          break
      }
    }
  }

  processInventoryMenuInput(eventType: string, event: KeyboardEvent): void {
    if (eventType === 'keydown') {
      switch (event.keyCode) {
        case RotKeys.VK_ESCAPE:
          RenderSystem.instance.menuConsole.mode = null
          InputSystem.instance.targetConsole = RenderSystem.instance.viewConsole
          break

        case RotKeys.VK_I:
          RenderSystem.instance.menuConsole.mode = null
          InputSystem.instance.targetConsole = RenderSystem.instance.viewConsole
          break
        default:
          break
      }
    }
  }

  processGetItemsMenuInput(eventType: string, event: KeyboardEvent): void {
    if (eventType === 'keydown') {
      switch (event.keyCode) {
        case RotKeys.VK_ESCAPE:
          RenderSystem.instance.menuConsole.mode = null
          InputSystem.instance.targetConsole = RenderSystem.instance.viewConsole
          this._selectedIndices = {}
          break

        case RotKeys.VK_RETURN:
          if (!Object.keys(this._selectedIndices).length) {
            RenderSystem.instance.menuConsole.mode = null
            InputSystem.instance.targetConsole =
              RenderSystem.instance.viewConsole
          } else {
            if (
              !Game.instance.player
                .getComponent(Components.InventoryComponent)
                .pickupItems([])
            ) {
              RenderSystem.instance.messageConsole.addMessage(
                'Your inventory is full. Not all items were picked up'
              )
            }
          }
          break

        default:
          break
      }

      if (event.keyCode >= RotKeys.VK_A && event.keyCode <= RotKeys.VK_Z) {
        const index = event.keyCode - RotKeys.VK_A
        const playerPosition = Game.instance.player.getComponent(
          Components.TransformComponent
        ).position
        const items: Item[] | undefined =
          Game.instance.currentScene.dungeon?.getItemsAt(playerPosition)
        if (items && items[index]) {
          if (this._selectedIndices[index]) {
            delete this._selectedIndices[index]
          } else {
            this._selectedIndices[index] = true
          }
          RenderSystem.instance.render()
        }
      }
    }
  }

  processDropItemsMenuInput(eventType: string, event: KeyboardEvent): void {
    if (eventType === 'keydown') {
      switch (event.keyCode) {
        case RotKeys.VK_ESCAPE:
          RenderSystem.instance.menuConsole.mode = null
          InputSystem.instance.targetConsole = RenderSystem.instance.viewConsole
          break

        default:
          break
      }
    }
  }
}
