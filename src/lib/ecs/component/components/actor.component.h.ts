import { Component, Entity, RenderSystem } from '@/lib/ecs'

export class ActorComponent implements Component {
  readonly name = 'Actor'
  readonly tags = []

  constructor(public entity: Entity) {}

  act(): void {
    RenderSystem.instance.render()
    this.entity.tileMap?.engine.lock()
  }
}
