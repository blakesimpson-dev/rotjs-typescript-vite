import { Component, Entity } from '@/lib/aeics'

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
