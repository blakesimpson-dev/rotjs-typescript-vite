import { Component, Entity } from '@/lib/aeics'

export class DefenceComponent implements Component {
  readonly name = 'Defence'
  readonly tags = []
  defenceValue: number

  constructor(
    public entity: Entity,
    protected readonly initDefenceValue?: number
  ) {
    this.defenceValue = initDefenceValue ?? 0
  }

  // defend(): void {}
}
