import { Display as RotDisplay } from 'rot-js'
import { DisplayOptions } from 'rot-js/lib/display/types'

import { Components } from '@/component'
import { Entity, EntityFactory } from '@/entity'
import { MessageLog } from '@/message'
import { Scene, SceneFactory } from '@/scene'
import { drawRect } from '@/utils'

export class Game {
  private static _instance: Game
  private _currentScene: Scene

  readonly displayOptions: Partial<DisplayOptions>

  readonly viewDisplay: RotDisplay
  readonly attributeDisplay: RotDisplay
  readonly messageDisplay: RotDisplay
  readonly surroundDisplay: RotDisplay
  readonly statusDisplay: RotDisplay

  readonly messageLog: MessageLog

  readonly player: Entity

  constructor() {
    this.displayOptions = {
      width: 128,
      height: 64,
      fontSize: 16,
      forceSquareRatio: true,
      fontFamily: 'unscii-8',
    }

    this.viewDisplay = new RotDisplay({
      ...this.displayOptions,
      width: 96,
      height: 40,
    })

    this.attributeDisplay = new RotDisplay({
      ...this.displayOptions,
      width: 96,
      height: 8,
    })

    this.messageDisplay = new RotDisplay({
      ...this.displayOptions,
      width: 96,
      height: 16,
    })

    this.surroundDisplay = new RotDisplay({
      ...this.displayOptions,
      width: 32,
      height: 40,
    })

    this.statusDisplay = new RotDisplay({
      ...this.displayOptions,
      width: 32,
      height: 24,
    })

    this.messageLog = new MessageLog()
    this.messageLog.addMessage('Welcome to the %c{red}DUNGEON')

    this.player = EntityFactory.instance.entityCatalog.player

    this._currentScene = SceneFactory.instance.sceneCatalog.start
    this.player.map = this._currentScene.map
    this._currentScene.enter()

    this.renderAll()

    const bindEventToScene = (eventType: string): void => {
      window.addEventListener(eventType, (event: Event) => {
        this._currentScene.processInputEvent(eventType, event as KeyboardEvent)
        this.renderAll()
      })
    }

    bindEventToScene('keydown')
    // bindEventToScene('keyup')
    // bindEventToScene('keypress')
  }

  static get instance(): Game {
    if (!Game._instance) {
      Game._instance = new Game()
    }

    return Game._instance
  }

  get currentScene(): Scene {
    return this._currentScene
  }

  set currentScene(scene: Scene) {
    this._currentScene.exit()
    this._currentScene = scene
    this._currentScene.enter()
    this.renderView()
  }

  // clearDisplays(): void {
  //   this.viewDisplay.clear()
  //   this.attributeDisplay.clear()
  //   this.messageDisplay.clear()
  //   this.surroundDisplay.clear()
  //   this.statusDisplay.clear()
  // }

  renderAll() {
    this.renderView()
    this.renderAttributes()
    this.renderMessages()
    this.renderSurrounds()
    this.renderStatus()
  }

  renderView(): void {
    this.viewDisplay.clear()
    this._currentScene.render(this.viewDisplay)
    drawRect(this.viewDisplay, {
      width: this.viewDisplay._options.width,
      height: this.viewDisplay._options.height,
      offsetX: 0,
      offsetY: 0,
    })
  }

  renderAttributes(): void {
    this.attributeDisplay.clear()
    const playerHealth = this.player.getComponent(Components.HealthComponent)
    const playerMaxHp = playerHealth.maxHpValue
    const playerHp = playerHealth.hpValue
    this.attributeDisplay.drawText(1, 1, `HP: ${playerHp}/${playerMaxHp}`)
    drawRect(
      this.attributeDisplay,
      {
        width: this.attributeDisplay._options.width,
        height: this.attributeDisplay._options.height,
        offsetX: 0,
        offsetY: 0,
      },
      'Attributes'
    )
  }

  renderMessages(): void {
    this.messageDisplay.clear()
    this.messageLog.render(this.messageDisplay)
    drawRect(
      this.messageDisplay,
      {
        width: this.messageDisplay._options.width,
        height: this.messageDisplay._options.height,
        offsetX: 0,
        offsetY: 0,
      },
      'Messages'
    )
  }

  renderSurrounds(): void {
    this.surroundDisplay.clear()
    // todo render surrounds stuff
    drawRect(
      this.surroundDisplay,
      {
        width: this.surroundDisplay._options.width,
        height: this.surroundDisplay._options.height,
        offsetX: 0,
        offsetY: 0,
      },
      'Surrounds'
    )
  }

  renderStatus(): void {
    this.statusDisplay.clear()
    // todo render status stuff
    drawRect(
      this.statusDisplay,
      {
        width: this.statusDisplay._options.width,
        height: this.statusDisplay._options.height,
        offsetX: 0,
        offsetY: 0,
      },
      'Status'
    )
  }
}
