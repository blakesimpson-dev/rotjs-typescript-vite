import { Biome, TileCatalog, Tiles } from '@/tile'

export class TileFactory {
  private static _instance: TileFactory
  tileCatalog: TileCatalog = {}

  setBiome(biome?: Biome): void {
    this.tileCatalog = {
      empty: new Tiles.EmptyTile(),
      floor: new Tiles.FloorTile(biome),
      wall: new Tiles.WallTile(biome),
      bounds: new Tiles.BoundsTile(biome),
    }
  }

  static get instance(): TileFactory {
    if (!TileFactory._instance) {
      TileFactory._instance = new TileFactory()
      TileFactory._instance.setBiome()
    }

    return TileFactory._instance
  }
}
