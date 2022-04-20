vars:

  - private static
  - private readonly
  - private
  - protected
  - public static
  - public readonly

rotjs-typescript-vite todo:

  - we cant have menuconsole handling all different inputs / rendering for different menus
  - create new menu class that menuconsole uses, change menuMode to target menu
  - menus are initialized by the render system and have their own input processing
  - this way if a menu is dealing with items, it can store its own item information etc. list of items and selected indices

fixes:
  - common domain - pretty messy
  - utils.ts - this should not just be a clusterfuck of different utils all stuck together...