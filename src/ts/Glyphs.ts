import { FontImageData } from "./FontImageData";

export class Glyph {
    character: string;

    x: number;
    y: number;

    width: number;
    height: number;

    constructor(character: string, x: number, y: number, width: number, height: number){
        this.character = character;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    trim(data: FontImageData){
        let usefulPixel = -1;
        
        for(let i = 0; i < this.width; i++){
            for(let j = 0; j < this.height; j++){
                if(data.hasPixel(this.x + i, this.y + j)){
                    usefulPixel = i;
                    break;
                }
            }
        }

        this.width = usefulPixel + 1;
    }

    getCharCode(): number{
        return this.character.charCodeAt(0);
    }
}