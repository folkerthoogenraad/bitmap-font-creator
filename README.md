# PixelFontGenerator
This project can generate fonts from pixel art tilemaps. It scans the tilemaps for existing pixels and crops each letter accordingly.

## Installing
Due to the package used for opentype.js at version 2, we currently need to import the opentype from github (the npm version is three years behind...). Therefore this project demands a certain folder structure:

 - `Projects/bitmap-font-creator`
 - `Projects/opentype.js`

Before you install bitmap font creator, you need to go to the `opentype.js` repo and run `npm install` and `npm run dist` to build the opentype.js project. Afterwards run `npm install` in the bitmap font creator folder to install this project.