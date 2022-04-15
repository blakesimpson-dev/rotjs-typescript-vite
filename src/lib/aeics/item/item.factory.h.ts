import { Item, ItemCatalog, Items } from '@/lib/aeics'

export class ItemFactory {
  private static _instance: ItemFactory
  readonly itemCatalog: ItemCatalog

  constructor() {
    this.itemCatalog = {}
  }

  createAppleItem(): Item {
    return new Items.AppleItem()
  }

  static get instance(): ItemFactory {
    if (!ItemFactory._instance) {
      ItemFactory._instance = new ItemFactory()
    }

    return ItemFactory._instance
  }
}
