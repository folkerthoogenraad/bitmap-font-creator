export class FontImageData{
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
    private getAlphaOffset(){
        return 3;
    }
}