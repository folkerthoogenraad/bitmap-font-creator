import * as opentype from "opentype/dist/opentype.min.js";
import { FontModel, FontSettings } from "./FontModel";
import { FontColor, FontImageData, FontRGBAColor } from './FontImageData';
import { Glyph } from './Glyphs';


function glyphGetColors(settings: FontSettings, imageData: FontImageData, glyph: Glyph) : FontRGBAColor[] {
    let colors =  new Set<FontRGBAColor>();

    for(let x = 0; x < glyph.width; x++){
        for(let y = 0; y < glyph.height; y++){
            if(!imageData.hasPixel(x + glyph.x, y + glyph.y)) continue;
            
            let color = imageData.getPixelColor(x + glyph.x, y + glyph.y);

            colors.add(color);
        }
    }

    return [...colors];
}

function glyphToPath(settings: FontSettings, imageData: FontImageData, glyph: Glyph, pixelSize: number, onlyColor?: FontRGBAColor){
    const path = new opentype.Path();

    for(let x = 0; x < glyph.width; x++){
        for(let y = 0; y < glyph.height; y++){
            if(!imageData.hasPixel(x + glyph.x, y + glyph.y)) continue;

            if(onlyColor !== undefined){
                let color = imageData.getPixelColor(x + glyph.x, y + glyph.y);
                
                if(onlyColor !== color) continue;
            }

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

function gatherPalette(settings: FontSettings, imageData: FontImageData, glyphs: Glyph[]) : FontRGBAColor[]{
    let gathered = new Set<FontRGBAColor>();

    glyphs.forEach(glyph => {
        const colors = glyphGetColors(settings, imageData!, glyph);

        colors.forEach(c => gathered.add(c));
    });

    return [...gathered];
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

    let palette = model.otfSettings.preserveColor ? gatherPalette(settings, imageData!, glyphs) : [];

    let ascender = 0;
    let descender = 0;

    let layersToAdd : any[] = [];

    glyphs.forEach(glyph => {
        const colors = model.otfSettings.preserveColor ? glyphGetColors(settings, imageData!, glyph) : [];

        const characterGlyphIndex = fontGlyphs.length + colors.length;

        colors.forEach(color => {
            const path = glyphToPath(settings, imageData!, glyph, pixelSize, color);

            const paletteIndex = palette.findIndex(x => x == color);

            const colorLayerGlyphIndex = fontGlyphs.length;
            
            const bounds = path.getBoundingBox();

            const g = new opentype.Glyph({
                index: colorLayerGlyphIndex,
                name: glyph.character + "_" + FontColor.toRGBAHexString(color),
                advanceWidth: glyph.width * pixelSize + settings.letterSpacing * pixelSize,
                xMin: bounds.x1,
                xMax: bounds.x2,

                yMax: bounds.y1,
                yMin: bounds.y2,
                path: path
            });

            layersToAdd.push({
                glyphIndex:  characterGlyphIndex,
                layerGlyphIndex: colorLayerGlyphIndex,
                paletteIndex: paletteIndex
            });

            fontGlyphs.push(g);
        });

        const path = glyphToPath(settings, imageData!, glyph, pixelSize);

        const bounds = path.getBoundingBox();

        const g = new opentype.Glyph({
            index: characterGlyphIndex,
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
    
    const font = new opentype.Font({
        familyName: settings.fontName,
        styleName: 'Regular',
        unitsPerEm: unitsPerEm,
        ascender: ascender,
        descender: descender,
        glyphs: fontGlyphs});

    if(model.otfSettings.preserveColor) {
        font.palettes.extend(1);
    
        for(let i = 0; i < palette.length; i++){
            font.palettes.setColor(i, FontColor.toRGBAHexString(palette[i]), 0);
        }
    
        layersToAdd.forEach(layer => {
            font.layers.add(layer.glyphIndex, {
                glyph: layer.layerGlyphIndex,
                paletteIndex: layer.paletteIndex,
            });
        });
    }

    return font;
}

function createActualFont_(model: FontModel): opentype.Font {
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
        const colors = glyphGetColors(settings, imageData!, glyph);

        const path = glyphToPath(settings, imageData!, glyph, pixelSize);

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