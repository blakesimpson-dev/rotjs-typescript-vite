rotjs-typescript-vite

displays: right now they are instantiated with ...displayOptions
this process needs to be improved so we can have generic config shared across project for accessing
and seperate classes for each display with a render() function

mapTile vs tile
ok so:
the maptile { tile: Tile, pos: Position } thing is disgusting
need to refactor this - basically tile: Tile is a shallow copy of the tiles from the tile catalog (performant !)
but we cant use that to store position etc.
maybe rename tile in Tile domain to like - tileType or tyleProps idk - move the MapTile (rename it to tile proper) to tile domain

new map.h functions
map.getEntitiesWithinRadius,
map.getUniqueTilesWithinRadius, : note, only half done - we get a set of tiles but we dont create a set based on the uniqueness

goals:
^ the above was used in CC to do a sendmessage thing - instead:
when rendering the surroundsDisplay
check for entities, and unique tiles

further goals:
show nearby entities and their HP cur/max
show a legend of nearby tiles

fixes:
common domain - pretty messy
utils.ts - this should not just be a clusterfuck of different utils all stuck together...