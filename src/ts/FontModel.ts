import { FontImageData } from "./FontImageData";
import { Glyph } from "./Glyphs";

export class FontModel {
    readonly imageData: FontImage;
    readonly settings: FontSettings;

    constructor(image?: FontImage, settings?: FontSettings){
        this.imageData = image ?? new FontImage();
        this.settings = settings ?? new FontSettings("My font", 10, 10, 7, 10, 1, 7, 5, "ABCD\nEFGH");
    }

    setImage(image: FontImage){
        return new FontModel(image, this.settings);
    }
    setSettings(settings: FontSettings){
        return new FontModel(this.imageData, settings);
    }

    createGlyphs(): Glyph[]{
        if(this.imageData.image === undefined) throw new Error("No image is defined");

        let image = this.imageData.image;

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

            if(xOffset > image.width){
                throw new Error("Width out of image bounds!");
            }
            if(yOffset > image.height){
                throw new Error("Height out of image bounds!");
            }
        }

        let imageData = this.getImageData(image);

        list.forEach(glyph => {
            glyph.trim(imageData);
        });

        return list;
    }

    getFntFileName(): string{
        if(this.imageData.fileName === undefined) return "";

        let fileName = this.imageData.fileName;

        let seperatorIndex = fileName.lastIndexOf(".");

        if(seperatorIndex > 0){
            fileName = fileName.substring(0, seperatorIndex);
        }

        return fileName + ".fnt";
    }

    private getImageData(image: HTMLImageElement): FontImageData{
        return new FontImageData(image);
    }
}

export class FontImage{
    readonly fileName?: string;
    readonly image?: HTMLImageElement;

    constructor(fileName?: string, image?: HTMLImageElement){
        this.fileName = fileName;
        this.image = image;
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