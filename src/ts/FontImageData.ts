
export type FontRGBAColor = number;

function clamp(min: number, max: number, value: number){
    if(value < min) value = min;
    if(value > max) value = max;

    return value;
}

export const FontColor = {
    fromRGBA(r: number, g: number, b: number, a: number) : FontRGBAColor {
        r = clamp(0, 255, r);
        g = clamp(0, 255, g);
        b = clamp(0, 255, b);
        a = clamp(0, 255, a);
        return r << 24 | g << 16 | b << 8 | a;
    },
    getRed(color: FontRGBAColor) {
        return (color >> 24) & 0xFF;
    },
    getGreen(color: FontRGBAColor) {
        return (color >> 16) & 0xFF;
    },
    getBlue(color: FontRGBAColor) {
        return (color >> 8) & 0xFF;
    },
    getAlpha(color: FontRGBAColor) {
        return (color >> 0) & 0xFF;
    },
    toRGBAString(color: FontRGBAColor) : string {
        let r = this.getRed(color);
        let g = this.getGreen(color);
        let b = this.getBlue(color);
        let a = this.getAlpha(color);

        return `rgba(${r},${g},${b},${a})`
    },
    toRGBAHexString(color: FontRGBAColor) : string {
        let r = this.getRed(color).toString(16).padStart(2, '0');
        let g = this.getGreen(color).toString(16).padStart(2, '0');
        let b = this.getBlue(color).toString(16).padStart(2, '0');
        let a = this.getAlpha(color).toString(16).padStart(2, '0');

        return `#${r}${g}${b}${a}`
    }
};

export class FontImageData {
    width: number;
    height: number;
    data: Uint8ClampedArray;

    constructor(image: HTMLImageElement){
        let canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        
        let context = canvas.getContext('2d');

        if(context === null) throw new Error("Cannot process image as context is not defined...");

        context.drawImage(image, 0, 0);

        this.width = image.width;
        this.height = image.height;

        this.data = context.getImageData(0, 0, image.width, image.height).data;
    }

    getPixelColor(x: number, y: number) : FontRGBAColor{
        let r = this.getPixelRed(x, y);
        let g = this.getPixelGreen(x, y);
        let b = this.getPixelBlue(x, y);
        let a = this.getPixelAlpha(x, y);

        return FontColor.fromRGBA(r,g,b,a);
    }

    getPixelColorString(x: number, y: number){
        let r = this.getPixelRed(x, y);
        let g = this.getPixelGreen(x, y);
        let b = this.getPixelBlue(x, y);
        
        return `rgb(${r},${g},${b})`
    }
    
    getPixelRed(x: number, y: number){
        let offset = this.getPixelIndex(x, y) + this.getRedOffset();

        return this.data[offset];
    }

    getPixelGreen(x: number, y: number){
        let offset = this.getPixelIndex(x, y) + this.getGreenOffset();

        return this.data[offset];
    }

    getPixelBlue(x: number, y: number){
        let offset = this.getPixelIndex(x, y) + this.getBlueOffset();

        return this.data[offset];
    }

    getPixelAlpha(x: number, y: number){
        let offset = this.getPixelIndex(x, y) + this.getAlphaOffset();

        return this.data[offset];
    }

    hasPixel(x: number, y: number){
        return this.getPixelAlpha(x, y) > 0;
    }

    private getPixelIndex(x: number, y: number){
        return (x + y * this.width) * 4;
    }
    private getRedOffset(){
        return 0;
    }
    private getGreenOffset(){
        return 1;
    }
    private getBlueOffset(){
        return 2;
    }
    private getAlphaOffset(){
        return 3;
    }
}