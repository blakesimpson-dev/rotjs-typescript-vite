export class Queue {
  private readonly _items: unknown[]

  constructor(...params: unknown[]) {
    this._items = [...params]
  }

  get items(): unknown[] {
    return this._items
  }

  get count(): number {
    return this._items.length
  }

  enqueue(item: unknown) {
    return this._items.push(item)
  }

  dequeue() {
    return this._items.shift()
  }
}
