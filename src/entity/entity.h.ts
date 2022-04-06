import { Component } from '@/component'
import { EntityProps } from '@/entity'
import { Glyph } from '@/glyph'

type AbstractComponent<T> = () => unknown & { prototype: T }
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- unknown[] never matches ctor
type Constructor<T> = AbstractComponent<T> | { new (...args: any[]): T }

export abstract class Entity {
  glyph: Glyph
  name: string
  readonly components: Component[] = []

  constructor(protected readonly _props: EntityProps) {
    this.glyph = _props.glyph
    this.name = _props.name
  }

  getComponent<C extends Component>(ctor: Constructor<C>): C {
    for (const component of this.components) {
      if (component instanceof ctor) {
        return component as C
      }
    }
    throw new Error(
      `GetComponent: Component ${ctor.name} not found on Entity ${this.constructor.name}`
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
        `RemoveComponent: Component ${ctor.name} not found on Entity ${this.constructor.name}`
      )
    }
  }
}
