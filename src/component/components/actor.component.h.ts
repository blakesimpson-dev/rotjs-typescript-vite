import { Component } from '@/component'
import { Entity } from '@/entity'
import { Game } from '@/game'

export class ActorComponent implements Component {
  name = 'Actor'
  tags = []

  constructor(public entity: Entity) {}

  act(): void {
    Game.instance.refresh()
    this.entity.map?.engine.lock()
  }
}
