import { FontImageData } from "./FontImageData";
import { Glyph } from "./Glyphs";

export class FontModel {
    readonly imageData: FontImage;
    readonly settings: FontSettings;
    readonly otfSettings: FontOtfSettings;

    cachedGlyphs?: Glyph[];

    constructor(image?: FontImage, settings?: FontSettings, otfSettings?: FontOtfSettings){
        this.imageData = image ?? new FontImage();
        this.settings = settings ?? new FontSettings("My font", 10, 10, 7, 10, 1, 7, 5, "ABCD\nEFGH");
        this.otfSettings = otfSettings ?? new FontOtfSettings(1024, false);
    }

    setImage(image: FontImage){
        return new FontModel(image, this.settings, this.otfSettings);
    }

    setOtfSettings(otfSettings: FontOtfSettings){
        return new FontModel(this.imageData, this.settings, otfSettings);
    }

    setSettings(settings: FontSettings){
        return new FontModel(this.imageData, settings, this.otfSettings);
    }

    createGlyphs(): Glyph[]{
        if(this.cachedGlyphs !== undefined) return this.cachedGlyphs;

        let imageData = this.imageData.getImageData();

        if(imageData === undefined) throw new Error("No image is defined");

        let list: Glyph[] = [];

        let characters = this.settings.characters;

        let xOffset = 0;
        let yOffset = 0;

        for(let i = 0; i < characters.length; i++){
            let char = characters.charAt(i);
            
            if(char === "\n"){
                xOffset = 0;
                yOffset += this.settings.tileSizeY;
                continue;
            }

            list.push(new Glyph(char, xOffset, yOffset, this.settings.tileSizeX, this.settings.tileSizeY));

            xOffset += this.settings.tileSizeX;

            if(xOffset > imageData.width){
                throw new Error("Width out of image bounds!");
            }
            if(yOffset > imageData.height){
                throw new Error("Height out of image bounds!");
            }
        }

        list.forEach(glyph => {
            glyph.trim(imageData!);
        });

        this.cachedGlyphs = list;

        return list;
    }

    getFntFileName(): string{
        return this.getImageFileName() + ".fnt";
    }

    getOtfFileName(): string{
        return this.settings.fontName + ".otf";
    }

    getImageFileName(): string{
        if(this.imageData.fileName === undefined) return "";

        let fileName = this.imageData.fileName;

        let seperatorIndex = fileName.lastIndexOf(".");

        if(seperatorIndex > 0){
            fileName = fileName.substring(0, seperatorIndex);
        }

        return fileName;
    }
}

export class FontImage{
    readonly fileName?: string;
    readonly image?: HTMLImageElement;

    cachedFontImageData?: FontImageData;

    constructor(fileName?: string, image?: HTMLImageElement){
        this.fileName = fileName;
        this.image = image;
    }

    getImageData(): FontImageData|undefined {
        if(this.image === undefined) return undefined;

        if(this.cachedFontImageData !== undefined) return this.cachedFontImageData;

        this.cachedFontImageData = new FontImageData(this.image);

        return this.cachedFontImageData;
    }
}

export class FontOtfSettings {
    readonly unitsPerEm: number;
    readonly preserveColor: boolean;

    constructor(unitsPerEm: number, preserveColor: boolean){
        this.unitsPerEm = unitsPerEm;
        this.preserveColor = preserveColor;
    }

    setUnitsPerEm(unitsPerEm: number){
        return new FontOtfSettings(
            unitsPerEm,
            this.preserveColor
        );
    }

    setPreserveColor(color: boolean){
        return new FontOtfSettings(
            this.unitsPerEm,
            color
        );
    }

    getPixelScale(fontSize: number) {
        return this.unitsPerEm / fontSize;
    }
}

// Man I need to really create a generator for this...
export class FontSettings{
    readonly fontName: string;
    
    readonly tileSizeX: number;
    readonly tileSizeY: number;

    readonly fontSize: number;
    readonly lineHeight: number;
    readonly letterSpacing: number;
    readonly baseLine: number;
    readonly spaceSize: number;

    readonly characters: string;

    constructor(fontName: string, tileSizeX: number, tileSizeY: number, fontSize: number, lineHeight: number, letterSpacing: number, baseLine: number, spaceSize: number, characters: string){
        this.fontName = fontName;
        this.tileSizeX = tileSizeX;
        this.tileSizeY = tileSizeY;
        this.fontSize = fontSize;
        this.lineHeight = lineHeight;
        this.letterSpacing = letterSpacing;
        this.baseLine = baseLine;
        this.spaceSize = spaceSize;
        this.characters = characters;
    }
    
    setFontName(fontName: string){
        return new FontSettings(
            fontName,
            this.tileSizeX,
            this.tileSizeY,
            this.fontSize,
            this.lineHeight,
            this.letterSpacing,
            this.baseLine,
            this.spaceSize,
            this.characters
        )
    }

    setTileSizeX(tileSizeX: number){
        return new FontSettings(
            this.fontName,
            tileSizeX,
            this.tileSizeY,
            this.fontSize,
            this.lineHeight,
            this.letterSpacing,
            this.baseLine,
            this.spaceSize,
            this.characters
        )
    }

    setTileSizeY(tileSizeY: number){
        return new FontSettings(
            this.fontName,
            this.tileSizeX,
            tileSizeY,
            this.fontSize,
            this.lineHeight,
            this.letterSpacing,
            this.baseLine,
            this.spaceSize,
            this.characters
        )
    }

    setFontSize(fontSize: number){
        return new FontSettings(
            this.fontName,
            this.tileSizeX,
            this.tileSizeY,
            fontSize,
            this.lineHeight,
            this.letterSpacing,
            this.baseLine,
            this.spaceSize,
            this.characters
        )
    }

    setLineHeight(lineHeight: number){
        return new FontSettings(
            this.fontName,
            this.tileSizeX,
            this.tileSizeY,
            this.fontSize,
            lineHeight,
            this.letterSpacing,
            this.baseLine,
            this.spaceSize,
            this.characters
        )
    }

    setLetterSpacing(letterSpacing: number){
        return new FontSettings(
            this.fontName,
            this.tileSizeX,
            this.tileSizeY,
            this.fontSize,
            this.lineHeight,
            letterSpacing,
            this.baseLine,
            this.spaceSize,
            this.characters
        )
    }

    setBaseLine(baseLine: number){
        return new FontSettings(
            this.fontName,
            this.tileSizeX,
            this.tileSizeY,
            this.fontSize,
            this.lineHeight,
            this.letterSpacing,
            baseLine,
            this.spaceSize,
            this.characters
        )
    }

    setSpaceSize(spaceSize: number){
        return new FontSettings(
            this.fontName,
            this.tileSizeX,
            this.tileSizeY,
            this.fontSize,
            this.lineHeight,
            this.letterSpacing,
            this.baseLine,
            spaceSize,
            this.characters
        )
    }

    setCharacters(characters: string){
        return new FontSettings(
            this.fontName,
            this.tileSizeX,
            this.tileSizeY,
            this.fontSize,
            this.lineHeight,
            this.letterSpacing,
            this.baseLine,
            this.spaceSize,
            characters
        )
    }
}