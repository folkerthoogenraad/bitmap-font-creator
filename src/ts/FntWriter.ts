import { FontModel } from "./FontModel";

interface FntChar {
    id: number;
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
    xadvance: number;
    xoffset?: number;
    yoffset?: number;
}
interface FntInfo {
    face: string;
    size: number;
    bold: boolean;
    italic: boolean;
    unicode: boolean;
    spacing: number[];
}
interface FntPage {
    id: number;
    file: string;
}
interface FntCommon {
    lineHeight: number;
    base: number;
}

class FntWriter {
    private data: string = "";
    
    writeChar(char: FntChar){
        this.writeRaw("char", char);
    }
    writeInfo(info: FntInfo){
        this.writeRaw("info", info);
    }
    writePage(page: FntPage){
        this.writeRaw("page", page);
    }
    writeCommon(common: FntCommon){
        this.writeRaw("common", common);
    }

    writeSpace(){
        this.data += "\n";
    }
    writeComment(comment: string){
        this.data += "#" + comment + "\n";
    }

    private writeRaw(command: string, data: any){
        let d: string[] = [command];

        for (const property in data) {

            let value = data[property];

            if(typeof value === "boolean"){
                value = value ? 1: 0;
            }
            if(typeof value === "string"){
                value = "\"" + value + "\"";
            }
            if(Array.isArray(value)){
                value = value.join(",");
            }

            d.push(`${property}=${value}`);
        }

        this.data += d.join(" ") + "\n";
    }

    toString(){
        return this.data;
    }
}

export function toFntFile(model: FontModel): string {
    let settings = model.settings;
    let glyphs = model.createGlyphs();

    let writer = new FntWriter();

    writer.writeComment("General information");
    writer.writeInfo({
        bold: false,
        italic: false,
        unicode: true,
        face: settings.fontName,
        size: settings.fontSize,
        spacing: [1, 1]
    });
    writer.writeCommon({
        lineHeight: settings.lineHeight,
        base: settings.baseLine,
    });
    writer.writePage({
        id: 0,
        file: model.imageData.fileName ?? "font.png"
    });

    writer.writeSpace();
    writer.writeComment("Character information");
    writer.writeChar({ id: 32, page: 0, x: 0, y: 0, width: 0, height: 0, xadvance: settings.spaceSize });
    writer.writeSpace();
    
    glyphs.forEach(glyph => {
        writer.writeChar({ id: glyph.getCharCode(), page: 0, x: glyph.x, y: glyph.y, width: glyph.width, height: glyph.height, xadvance: glyph.width + settings.letterSpacing, xoffset: 0, yoffset: 0 });
    });

    return writer.toString();
}