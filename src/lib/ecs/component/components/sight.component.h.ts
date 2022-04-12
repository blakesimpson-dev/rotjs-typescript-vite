import { Component, Entity } from '@/lib/ecs'

export class SightComponent implements Component {
  readonly name = 'Sight'
  readonly tags = []
  sightValue: number

  constructor(
    public entity: Entity,
    protected readonly initSightValue?: number
  ) {
    this.sightValue = initSightValue ?? 6
  }
}
