import { Color as RotColor, Map as RotMap } from 'rot-js'

import { Vector2, Vector3 } from '@/lib/common'
import { DungeonBuilderProps } from '@/lib/dungeon'
import { Glyph } from '@/lib/glyph'
import { Tile, Tiles } from '@/lib/tile'
import { shuffleArray } from '@/utils'

export class DungeonBuilder {
  readonly _width: number
  readonly _height: number
  readonly _depth: number
  readonly _tiles: Tile[][][]
  readonly _regions: number[][][]

  get tiles(): Tile[][][] {
    return this._tiles
  }

  constructor(props: DungeonBuilderProps) {
    this._width = props.width
    this._height = props.height
    this._depth = props.depth
    this._tiles = new Array<Tile[][]>(this._depth)
    this._regions = new Array<number[][]>(this._depth)

    for (let z = 0; z < this._depth; z++) {
      this._tiles[z] = this.buildZLevel(z)
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

  private buildZLevel(depth: number): Tile[][] {
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
          position: { x: x, y: y, z: depth },
        }
      } else {
        tiles[x][y] = {
          ...Tiles.Wall,
          glyph: new Glyph({ ...Tiles.Wall.glyph }),
          position: { x: x, y: y, z: depth },
        }
      }
      if (y === 0 || y === this._height - 1) {
        tiles[x][y] = {
          ...Tiles.Bounds,
          glyph: new Glyph({ ...Tiles.Bounds.glyph }),
          position: { x: x, y: y, z: depth },
        }
      } else if (x === 0 || x === this._width - 1) {
        tiles[x][y] = {
          ...Tiles.Bounds,
          glyph: new Glyph({ ...Tiles.Bounds.glyph }),
          position: { x: x, y: y, z: depth },
        }
      }

      const rndFgColor = RotColor.randomize(
        RotColor.fromString(tiles[x][y].glyph.fgColor),
        [20, 20, 20]
      )
      tiles[x][y].glyph.fgColor = RotColor.toHex(rndFgColor)
    })

    return tiles
  }

  private canFillRegion(position: Vector3): boolean {
    if (
      position.x < 0 ||
      position.y < 0 ||
      position.z < 0 ||
      position.x >= this._width ||
      position.y >= this._height ||
      position.z >= this._depth
    ) {
      return false
    }

    if (this._regions[position.z][position.x][position.y] !== 0) {
      return false
    }

    return !this._tiles[position.z][position.x][position.y].isCollider
  }

  private fillRegion(region: number, origin: Vector3): number {
    let tilesFilled = 1
    let tilePosition: Vector2 | undefined
    let neighbours: Vector2[]
    const tilePositions: Vector2[] = [{ x: origin.x, y: origin.y }]
    this._regions[origin.z][origin.x][origin.y] = region

    while (tilePositions.length > 0) {
      tilePosition = tilePositions.pop()
      if (tilePosition) {
        neighbours = this.getNeighbouringPositions({
          x: tilePosition.x,
          y: tilePosition.y,
        })
        while (neighbours.length > 0) {
          tilePosition = neighbours.pop()
          if (tilePosition) {
            if (
              this.canFillRegion({
                x: tilePosition.x,
                y: tilePosition.y,
                z: origin.z,
              })
            ) {
              this._regions[origin.z][tilePosition.x][tilePosition.y] = region
              tilePositions.push(tilePosition)
              tilesFilled++
            }
          }
        }
      }
    }
    return tilesFilled
  }

  private removeRegion(region: number, depth: number) {
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        if (this._regions[depth][x][y] === region) {
          this._regions[depth][x][y] = 0
          this._tiles[depth][x][y] = {
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
            position: { x: 0, y: 0, z: depth },
          }
        }
      }
    }
  }

  private setupRegionsForZLevel(depth: number): void {
    let region = 1
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        if (this.canFillRegion({ x: x, y: y, z: depth })) {
          if (this.fillRegion(region, { x: x, y: y, z: depth }) <= 20) {
            this.removeRegion(region, depth)
          } else {
            region++
          }
        }
      }
    }
  }

  private getRegionOverlapPositions(
    depth: number,
    regionOne: number,
    regionTwo: number
  ): Vector3[] {
    const results = []

    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        if (
          this._tiles[depth][x][y].type === 'Floor' &&
          this._tiles[depth + 1][x][y].type === 'Floor' &&
          this._regions[depth][x][y] === regionOne &&
          this._regions[depth + 1][x][y] === regionTwo
        ) {
          results.push({ x: x, y: y, z: depth })
        }
      }
    }

    return shuffleArray(results)
  }

  private connectRegions(
    depth: number,
    regionOne: number,
    regionTwo: number
  ): boolean {
    const overlapPositions = this.getRegionOverlapPositions(
      depth,
      regionOne,
      regionTwo
    )
    if (!overlapPositions.length) {
      return false
    }

    const overlapPositon = overlapPositions[0]
    this._tiles[depth][overlapPositon.x][overlapPositon.y] = {
      ...Tiles.StairsDown,
      glyph: new Glyph({ ...Tiles.StairsDown.glyph }),
      position: {
        x: overlapPositon.x,
        y: overlapPositon.y,
        z: overlapPositon.z,
      },
    }

    this._tiles[depth + 1][overlapPositon.x][overlapPositon.y] = {
      ...Tiles.StairsUp,
      glyph: new Glyph({ ...Tiles.StairsUp.glyph }),
      position: {
        x: overlapPositon.x,
        y: overlapPositon.y,
        z: overlapPositon.z,
      },
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
            this._tiles[z][x][y].type === 'Floor' &&
            this._tiles[z + 1][x][y].type === 'Floor' &&
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

  getNeighbouringPositions(origin: Vector2): Vector2[] {
    const results: Vector2[] = []
    for (let dx = -1; dx < 2; dx++) {
      for (let dy = -1; dy < 2; dy++) {
        if (dx === 0 && dy === 0) {
          continue
        }
        results.push({ x: origin.x + dx, y: origin.y + dy })
      }
    }
    return shuffleArray(results)
  }
}
