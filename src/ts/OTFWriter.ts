import * as opentype from 'opentype.js'
import { FontModel } from "./FontModel";

function createActualFont(model: FontModel): opentype.Font {
    let settings = model.settings;
    let glyphs = model.createGlyphs();
    let imageData = model.imageData.getImageData();

    let fontGlyphs: opentype.Glyph[] = [];

    const notDefPath = new opentype.Path();

    notDefPath.moveTo(0, 0);
    notDefPath.lineTo(settings.tileSizeX, 0);
    notDefPath.lineTo(settings.tileSizeX, settings.baseLine);
    notDefPath.lineTo(0, settings.baseLine);
    notDefPath.lineTo(0, 0);

    const notdefGlyph = new opentype.Glyph({
        name: '.notdef',
        advanceWidth: settings.tileSizeX,
        path: notDefPath
    });

    const spaceGlyph = new opentype.Glyph({
        name: ' ',
        unicode: 32,
        advanceWidth: settings.spaceSize,
        path: new opentype.Path()
    });

    fontGlyphs.push(notdefGlyph);
    fontGlyphs.push(spaceGlyph);

    glyphs.forEach(glyph => {
        const path = new opentype.Path();

        for(let x = 0; x < glyph.width; x++){
            for(let y = 0; y < glyph.height; y++){
                if(!imageData!.hasPixel(x + glyph.x, y + glyph.y)) continue;

                let gx = x;
                let gy = settings.baseLine - y - 1;

                path.moveTo(gx, gy);
                path.lineTo(gx + 1, gy);
                path.lineTo(gx + 1, gy + 1);
                path.lineTo(gx, gy + 1);
                path.lineTo(gx, gy);
            }
        }

        const bounds = path.getBoundingBox();

        const g = new opentype.Glyph({
            name: glyph.character,
            unicode: glyph.getCharCode(),
            advanceWidth: glyph.width + settings.letterSpacing,
            xMin: bounds.x1,
            xMax: bounds.x2,

            yMax: bounds.y1,
            yMin: bounds.y2,
            path: path
        });

        fontGlyphs.push(g);
    });

    // TODO read this stuff 
    // https://help.fontlab.com/fontlab-vi/Font-Sizes-and-the-Coordinate-System/


    const font = new opentype.Font({
        familyName: settings.fontName,
        styleName: 'Regular',
        unitsPerEm: Math.max(settings.tileSizeX, settings.tileSizeY) + 1,
        ascender: settings.baseLine,
        descender: (settings.baseLine - settings.tileSizeY),
        glyphs: fontGlyphs});

    return font;
}

export function toOTFFile(model: FontModel): ArrayBuffer{
    let font = createActualFont(model);

    return font.toArrayBuffer();
}