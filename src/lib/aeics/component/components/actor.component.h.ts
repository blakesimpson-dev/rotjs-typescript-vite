import { Action, Component, Entity, RenderSystem } from '@/lib/aeics'

export class ActorComponent implements Component {
  readonly name = 'Actor'
  readonly tags = []

  constructor(public entity: Entity, public actions: Action[]) {}

  act(): void {
    this.actions.forEach((action) => {
      action.performAction()
    })
    if (this.entity.name === 'Player') {
      this.entity.dungeon?.engine.lock()
      RenderSystem.instance.render()
    }
  }
}
