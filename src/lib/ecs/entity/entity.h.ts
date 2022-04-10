import { Component, EntityProps } from '@/lib/ecs'
import { Glyph } from '@/lib/glyph'
import { TileMap } from '@/lib/tilemap'

type AbstractComponent<T> = () => unknown & { prototype: T }
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- unknown[] never matches ctor
type Constructor<T> = AbstractComponent<T> | { new (...args: any[]): T }

export abstract class Entity {
  private _tileMap: TileMap | null = null

  readonly glyph: Glyph
  readonly name: string
  readonly components: Component[] = []

  constructor(protected readonly props: EntityProps) {
    this.glyph = props.glyph
    this.name = props.name
  }

  get tileMap(): TileMap | null {
    return this._tileMap
  }

  set tileMap(tileMap: TileMap | null) {
    this._tileMap = tileMap
  }

  getComponent<C extends Component>(ctor: Constructor<C>): C {
    for (const component of this.components) {
      if (component instanceof ctor) {
        return component as C
      }
    }
    throw new Error(
      `getComponent(ctor: Constructor<C>): Component ${ctor.name} not found on Entity ${this.constructor.name}`
    )
  }

  hasComponent<C extends Component>(ctor: Constructor<C>): boolean {
    for (const component of this.components) {
      if (component instanceof ctor) {
        return true
      }
    }
    return false
  }

  getComponentsWithTag(tag: string): Component[] {
    return this.components.filter((component: Component) => {
      return component.tags.indexOf(tag) !== -1
    })
  }

  addComponent(component: Component): void {
    this.components.push(component)
    component.entity = this
  }

  removeComponent<C extends Component>(ctor: Constructor<C>): void {
    let toRemove: Component | undefined
    let index: number | undefined

    for (let i = 0; i < this.components.length; i++) {
      const component = this.components[i]
      if (component instanceof ctor) {
        toRemove = component
        index = i
        break
      }
    }

    if (toRemove && index) {
      toRemove.entity = null
      this.components.splice(index, 1)
    } else {
      throw new Error(
        `removeComponent(ctor: Constructor<C>): Component ${ctor.name} not found on Entity ${this.constructor.name}`
      )
    }
  }
}
