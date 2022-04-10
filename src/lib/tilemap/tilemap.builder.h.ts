import { Color as RotColor, Map as RotMap } from 'rot-js'

import { Position } from '@/lib/common'
import { Glyph } from '@/lib/glyph'
import { Tile, Tiles } from '@/lib/tile'
import { TileMap, TileMapBuilderProps } from '@/lib/tilemap'
import { shuffleArray } from '@/utils'

export class TileMapBuilder {
  readonly _width: number
  readonly _height: number
  readonly _depth: number
  readonly _tileMaps: TileMap[]
  readonly _regions: number[][][]

  constructor(props: TileMapBuilderProps) {
    this._width = props.width
    this._height = props.height
    this._depth = props.depth
    this._tileMaps = new Array<TileMap>(this._depth)
    this._regions = new Array<number[][]>(this._depth)

    for (let z = 0; z < this._depth; z++) {
      this._tileMaps[z] = this.buildTileMapForZLevel()
      this._regions[z] = new Array<number[]>(this._width)
      for (let x = 0; x < this._width; x++) {
        this._regions[z][x] = new Array<number>(this._height)
        for (let y = 0; y < this._height; y++) {
          this._regions[z][x][y] = 0
        }
      }
    }

    for (let z = 0; z < this._depth; z++) {
      this.setupRegionsForZLevel(z)
    }

    this.connectAllRegions()
  }

  private buildTileMapForZLevel(): TileMap {
    const tiles: Tile[][] = new Array<Tile[]>(this._width)
    for (let w = 0; w < this._width; w++) {
      tiles[w] = new Array<Tile>(this._height)
    }

    const rotGenerator = new RotMap.Cellular(this._width, this._height)
    rotGenerator.randomize(0.5)
    const totalIterations = 3

    for (let i = 0; i < totalIterations; i++) {
      rotGenerator.create()
    }

    rotGenerator.create((x, y, v) => {
      if (v === 1) {
        tiles[x][y] = {
          ...Tiles.Floor,
          glyph: new Glyph({ ...Tiles.Floor.glyph }),
          position: new Position(x, y),
        }
      } else {
        tiles[x][y] = {
          ...Tiles.Wall,
          glyph: new Glyph({ ...Tiles.Wall.glyph }),
          position: new Position(x, y),
        }
      }
      if (y === 0 || y === this._height - 1) {
        tiles[x][y] = {
          ...Tiles.Bounds,
          glyph: new Glyph({ ...Tiles.Bounds.glyph }),
          position: new Position(x, y),
        }
      } else if (x === 0 || x === this._width - 1) {
        tiles[x][y] = {
          ...Tiles.Bounds,
          glyph: new Glyph({ ...Tiles.Bounds.glyph }),
          position: new Position(x, y),
        }
      }

      const rndFgColor = RotColor.randomize(
        RotColor.fromString(tiles[x][y].glyph.fgColor),
        [20, 20, 20]
      )
      tiles[x][y].glyph.fgColor = RotColor.toHex(rndFgColor)
    })

    return new TileMap({ tiles: tiles })
  }

  private canFillRegion(x: number, y: number, z: number): boolean {
    if (
      x < 0 ||
      y < 0 ||
      z < 0 ||
      x >= this._width ||
      y >= this._height ||
      z >= this._depth
    ) {
      return false
    }

    if (this._regions[z][x][y] !== 0) {
      return false
    }

    return !this._tileMaps[z].getTileAt(x, y).isCollider
  }

  private fillRegion(region: number, x: number, y: number, z: number): number {
    let tilesFilled = 1
    const tilePositions: Position[] = [new Position(x, y)]
    this._regions[z][x][y] = region
    while (tilePositions.length > 0) {
      const tilePosition = tilePositions.pop() ?? Position.zero()
      const neighbours = this._tileMaps[z].getNeighbouringTiles(
        tilePosition.x,
        tilePosition.y
      )
      while (neighbours.length > 0) {
        const tilePosition = neighbours.pop()?.position ?? Position.zero()
        if (this.canFillRegion(tilePosition.x, tilePosition.y, z)) {
          this._regions[z][tilePosition.x][tilePosition.y] = region
          tilePositions.push(tilePosition)
          tilesFilled++
        }
      }
    }
    return tilesFilled
  }

  private removeRegion(region: number, z: number) {
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        if (this._regions[z][x][y] === region) {
          this._regions[z][x][y] = 0
          this._tileMaps[z].tiles[x][y] = {
            ...Tiles.Wall,
            glyph: new Glyph({
              ...Tiles.Wall.glyph,
              fgColor: RotColor.toHex(
                RotColor.randomize(
                  RotColor.fromString(Tiles.Wall.glyph.fgColor),
                  [15, 15, 15]
                )
              ),
            }),
            position: new Position(x, y),
          }
        }
      }
    }
  }

  private setupRegionsForZLevel(z: number): void {
    let region = 1
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        if (this.canFillRegion(x, y, z)) {
          const tilesFilled = this.fillRegion(region, x, y, z)
          if (tilesFilled <= 20) {
            this.removeRegion(region, z)
          } else {
            region++
          }
        }
      }
    }
  }

  private getRegionOverlapPositions(
    z: number,
    r1: number,
    r2: number
  ): Position[] {
    const results = []

    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        if (
          this._tileMaps[z].getTileAt(x, y).type === 'Floor' &&
          this._tileMaps[z + 1].getTileAt(x, y).type === 'Floor' &&
          this._regions[z][x][y] === r1 &&
          this._regions[z + 1][x][y] === r2
        ) {
          results.push(new Position(x, y))
        }
      }
    }

    return shuffleArray(results)
  }

  private connectRegions(z: number, r1: number, r2: number): boolean {
    const overlapPositions = this.getRegionOverlapPositions(z, r1, r2)
    if (!overlapPositions.length) {
      return false
    }

    const overlapPositon = overlapPositions[0]
    this._tileMaps[z].tiles[overlapPositon.x][overlapPositon.y] = {
      ...Tiles.StairsDown,
      glyph: new Glyph({ ...Tiles.StairsDown.glyph }),
      position: new Position(overlapPositon.x, overlapPositon.y),
    }

    this._tileMaps[z + 1].tiles[overlapPositon.x][overlapPositon.y] = {
      ...Tiles.StairsUp,
      glyph: new Glyph({ ...Tiles.StairsUp.glyph }),
      position: new Position(overlapPositon.x, overlapPositon.y),
    }

    return true
  }

  private connectAllRegions(): void {
    for (let z = 0; z < this._depth - 1; z++) {
      const connected: Record<string, boolean> = {}
      for (let x = 0; x < this._width; x++) {
        for (let y = 0; y < this._height; y++) {
          const key = this._regions[z][x][y] + ',' + this._regions[z + 1][x][y]
          if (
            this._tileMaps[z].getTileAt(x, y).type === 'Floor' &&
            this._tileMaps[z + 1].getTileAt(x, y).type === 'Floor' &&
            !connected[key]
          ) {
            if (
              this.connectRegions(
                z,
                this._regions[z][x][y],
                this._regions[z + 1][x][y]
              )
            ) {
              connected[key] = true
            }
          }
        }
      }
    }
  }
}
