import * as opentype from 'opentype.js'
import { FontModel, FontSettings } from "./FontModel";
import { FontImageData } from './FontImageData';
import { Glyph } from './Glyphs';


function glyphToPath(settings: FontSettings, imageData: FontImageData, glyph: Glyph, pixelSize: number){
    const path = new opentype.Path();

    for(let x = 0; x < glyph.width; x++){
        for(let y = 0; y < glyph.height; y++){
            if(!imageData.hasPixel(x + glyph.x, y + glyph.y)) continue;

            

            let gx = x;
            let gy = settings.baseLine - y - 1;

            path.moveTo(gx * pixelSize, gy * pixelSize);
            path.lineTo(gx * pixelSize + pixelSize, gy * pixelSize);
            path.lineTo(gx * pixelSize + pixelSize, gy * pixelSize + pixelSize);
            path.lineTo(gx * pixelSize, gy * pixelSize + pixelSize);
            path.lineTo(gx * pixelSize, gy * pixelSize);
        }
    }

    return path;
}

function glyphToPathWithColor(settings: FontSettings, imageData: FontImageData, glyph: Glyph, pixelSize: number){
    const path = new opentype.Path();

    // This should help... :')
    // npm install "https://github.com/opentypejs/opentype.js.git#master"
    // see https://github.com/opentypejs/opentype.js/releases/tag/1.3.4

    path.fill = "red";

    for(let x = 0; x < glyph.width; x++){
        for(let y = 0; y < glyph.height; y++){
            if(!imageData!.hasPixel(x + glyph.x, y + glyph.y)) continue;

            let gx = x;
            let gy = settings.baseLine - y - 1;

            path.moveTo(gx * pixelSize, gy * pixelSize);
            path.lineTo(gx * pixelSize + pixelSize, gy * pixelSize);
            path.lineTo(gx * pixelSize + pixelSize, gy * pixelSize + pixelSize);
            path.lineTo(gx * pixelSize, gy * pixelSize + pixelSize);
            path.lineTo(gx * pixelSize, gy * pixelSize);
        }
    }

    console.dir(path);

    return path;
}

function createActualFont(model: FontModel): opentype.Font {
    let settings = model.settings;
    let glyphs = model.createGlyphs();
    let imageData = model.imageData.getImageData();

    let unitsPerEm = model.otfSettings.unitsPerEm;
    let pixelSize = model.otfSettings.getPixelScale(settings.fontSize);//(unitsPerEm / settings.fontSize);

    let fontGlyphs: opentype.Glyph[] = [];

    const notDefPath = new opentype.Path();

    notDefPath.moveTo(0, 0);
    notDefPath.lineTo(settings.tileSizeX * pixelSize, 0);
    notDefPath.lineTo(settings.tileSizeX * pixelSize, settings.baseLine * pixelSize);
    notDefPath.lineTo(0, settings.baseLine * pixelSize);
    notDefPath.lineTo(0, 0);

    const notdefGlyph = new opentype.Glyph({
        name: '.notdef',
        advanceWidth: settings.tileSizeX * pixelSize,
        path: notDefPath
    });

    const spaceGlyph = new opentype.Glyph({
        name: ' ',
        unicode: 32,
        advanceWidth: settings.spaceSize * pixelSize,
        path: new opentype.Path()
    });

    fontGlyphs.push(notdefGlyph);
    fontGlyphs.push(spaceGlyph);

    let ascender = 0;
    let descender = 0;

    glyphs.forEach(glyph => {
        const path = model.otfSettings.preserveColor ? 
            glyphToPathWithColor(settings, imageData!, glyph, pixelSize) :
            glyphToPath(settings, imageData!, glyph, pixelSize);

        const bounds = path.getBoundingBox();

        const g = new opentype.Glyph({
            name: glyph.character,
            unicode: glyph.getCharCode(),
            advanceWidth: glyph.width * pixelSize + settings.letterSpacing * pixelSize,
            xMin: bounds.x1,
            xMax: bounds.x2,

            yMax: bounds.y1,
            yMin: bounds.y2,
            path: path
        });

        ascender = Math.max(ascender, bounds.y2);
        descender = Math.min(descender, bounds.y1);

        fontGlyphs.push(g);
    });
    
    // TODO color table
    // https://github.com/opentypejs/opentype.js/blob/aa8ad76467a27f086a19a7d3e12479a3d4fd93aa/src/tables/sfnt.mjs#L141

    // This is how color table is created
    // https://github.com/opentypejs/opentype.js/blob/aa8ad76467a27f086a19a7d3e12479a3d4fd93aa/src/tables/colr.mjs

    const font = new opentype.Font({
        familyName: settings.fontName,
        styleName: 'Regular',
        unitsPerEm: unitsPerEm,
        ascender: ascender,
        descender: descender,
        glyphs: fontGlyphs});

    return font;
}

export function toOTFFile(model: FontModel): ArrayBuffer{
    let font = createActualFont(model);

    return font.toArrayBuffer();
}