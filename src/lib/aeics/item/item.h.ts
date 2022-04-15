import { Entity, ItemProps } from '@/lib/aeics'

export class Item extends Entity {
  constructor(protected readonly props: ItemProps) {
    super({ ...props })
  }
}
