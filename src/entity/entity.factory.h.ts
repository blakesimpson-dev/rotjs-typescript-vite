import { EntityCollection, PlayerEntity } from '@/entity'

export class EntityFactory {
  private static _instance: EntityFactory
  private readonly _entities: EntityCollection

  constructor() {
    this._entities = {
      player: new PlayerEntity(),
    }
  }

  get entities(): EntityCollection {
    return this._entities
  }

  static get instance(): EntityFactory {
    if (!EntityFactory._instance) {
      EntityFactory._instance = new EntityFactory()
    }

    return EntityFactory._instance
  }
}
