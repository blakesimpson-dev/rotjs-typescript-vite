import { Component } from '@/component'
import { Entity } from '@/entity'

export class DefenceComponent implements Component {
  name = 'Defence'
  tags = []
  defenceValue: number

  constructor(
    public entity: Entity,
    protected readonly initDefenceValue?: number
  ) {
    this.defenceValue = initDefenceValue ?? 0
  }

  // defend(): void {}
}
