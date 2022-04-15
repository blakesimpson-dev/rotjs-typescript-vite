import { Component, Components, Entity, Item } from '@/lib/aeics'

type Slot = {
  item: Item | null
}

export class InventoryComponent implements Component {
  readonly name = 'Position'
  readonly tags = []
  readonly slots: Slot[] = []
  slotCount: number

  constructor(public entity: Entity, initSlotCount?: number) {
    this.slotCount = initSlotCount ?? 10
    for (let i = 0; i < this.slotCount; i++) {
      this.slots.push({ item: null })
    }
  }

  getItem(index: number): Item | null {
    return this.slots[index].item
  }

  addItem(item: Item): boolean {
    let success = false
    for (let i = 0; i < this.slots.length; i++) {
      if (!this.slots[i].item) {
        this.slots[i].item = item
        success = true
        break
      }
    }
    return success
  }

  removeItem(index: number): void {
    this.slots[index].item = null
  }

  isInventoryFull(): boolean {
    for (let i = 0; i < this.slots.length; i++) {
      if (!this.slots[i].item) {
        return false
      }
    }
    return true
  }

  pickupItems(indices: number[]): number {
    const entityPosition = this.entity.getComponent(
      Components.TransformComponent
    ).position
    const items = this.entity.dungeon?.getItemsAt(entityPosition) ?? []
    let added = 0
    for (let i = 0; i < indices.length; i++) {
      if (this.addItem(items[indices[i] - added])) {
        items.splice(indices[i] - added, 1)
        added++
      } else {
        // inventory is full
        break
      }
    }
    this.entity.dungeon?.setItemsAt(entityPosition, items)
    return added - indices.length
  }

  dropItem(index: number): void {
    if (this.slots[index].item) {
      const entityPosition = this.entity.getComponent(
        Components.TransformComponent
      ).position
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we have guaranteed that an item is present
      this.entity.dungeon?.addItem(entityPosition, this.slots[index].item!)
      this.removeItem(index)
    }
  }
}
