import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FontImage, FontSettings } from 'src/ts/FontModel';

@Component({
  selector: 'app-font-image-display',
  templateUrl: './font-image-display.component.html',
  styleUrls: ['./font-image-display.component.scss']
})
export class FontImageDisplayComponent implements OnChanges {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;

  // Input
  mouseButtonLeft: boolean = false;
  mouseButtonMiddle: boolean = false;
  mouseButtonRight: boolean = false;
  mouseDeltaX: number = 0;
  mouseDeltaY: number = 0;
  mouseX: number = 0;
  mouseY: number = 0;

  // View stuff
  viewX: number = 0;
  viewY: number = 0;

  viewScaleX: number = 1;
  viewScaleY: number = 1;

  @Input() image?: FontImage;
  @Input() settings?: FontSettings;

  requestedAnimationFrame: number = -1;
  
  ngOnChanges(){
    this.redraw();
  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.context =  this.canvas.getContext("2d")!;
    this.context.imageSmoothingEnabled = false;

    this.viewX = -16;
    this.viewY = -16;
    this.viewScaleX = 2;
    this.viewScaleY = 2;

    this.resize();
    this.redraw();
  }

  // =========================================== //
  // System messages
  // =========================================== //
  redraw(){
    if(this.requestedAnimationFrame > 0) return;

    this.requestedAnimationFrame = requestAnimationFrame(() => {
      this.requestedAnimationFrame = 0;
      this.draw();
    });
  }

  resize(){
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    this.redraw();
  }

  // =========================================== //
  // Drawing
  // =========================================== //
  draw(){
    if(this.context === undefined) return;

    this.context.imageSmoothingEnabled = this.viewScaleX < 1;

    this.context.resetTransform();
    
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.scale(this.viewScaleX, this.viewScaleY);
    this.context.translate(-this.viewX, -this.viewY);
    
    this.drawImage();
    this.drawGrid();
  }

  drawImage(){
    if(this.image === undefined) return;
    if(this.image.image === undefined) return;

    let image = this.image.image;
     
    this.context.drawImage(image, 0, 0);
  }

  drawGrid(){
    if(this.settings === undefined) return;
    if(this.image === undefined) return;
    if(this.image.image === undefined) return;

    let lines = this.settings.characters.split('\n');

    let imageWidth = this.image.image.width;
    let imageHeight = this.image.image.height;

    let gridWidth = this.settings.tileSizeX;
    let gridHeight = this.settings.tileSizeY;

    this.context.lineWidth = this.viewScreenPixelSize;
    
    // Draw the normal grid
    this.context.strokeStyle = "rgba(255, 255, 255, 0.3)";
    
    this.context.beginPath();

    for(let x = 0; x < imageWidth; x += gridWidth){
      this.context.moveTo(x, 0);
      this.context.lineTo(x, imageHeight);
    }

    for(let y = 0; y < imageHeight; y += gridHeight){
      this.context.moveTo(0, y);
      this.context.lineTo(imageWidth, y);
    }

    this.context.stroke();
    
    // Draw the baseline
    this.context.strokeStyle = "rgba(0, 255, 255, 0.3)";
    
    this.context.beginPath();

    for(let y = this.settings.baseLine; y < imageHeight; y += gridHeight){
      this.context.moveTo(0, y);
      this.context.lineTo(imageWidth, y);
    }

    this.context.stroke();

    // Draw the selected characters grid
    this.context.beginPath();
    this.context.strokeStyle = "blue";

    for(let l = 0; l < lines.length; l++){
      let line = lines[l];

      for(let c = 0; c < line.length; c++){
        let x = c * gridWidth;
        let y = l * gridHeight;
        
        this.context.moveTo(x, y + this.settings.baseLine);
        this.context.lineTo(x + gridWidth, y + this.settings.baseLine);
      }
    }

    this.context.stroke();
  }

  // =========================================== //
  // View
  // =========================================== //
  get canvasWidth(){
    return this.canvas.width;
  }
  
  get canvasHeight(){
    return this.canvas.height;
  }
  
  get viewWidth() {
    return this.canvasWidth / this.viewScaleX;
  }

  get viewHeight() {
    return this.canvasHeight / this.viewScaleY;
  }

  get viewScreenPixelSize(){
    return 1 / this.viewScaleX;
  }

  toViewX(canvasX: number){
    return this.viewX + canvasX / this.viewScaleX;
  }
  toViewScaleX(canvasX: number){
    return canvasX / this.viewScaleX;
  }

  toViewY(canvasY: number){
    return this.viewY + canvasY / this.viewScaleY;
  }
  toViewScaleY(canvasY: number){
    return canvasY / this.viewScaleY;
  }

  translate(deltaX: number, deltaY: number){
    this.viewX -= deltaX;
    this.viewY -= deltaY;

    this.redraw();
  }

  zoom(x: number, y: number, factor: number){
    let deltaX = x - this.viewX;
    let deltaY = y - this.viewY;

    this.viewX -= deltaX / factor - deltaX;
    this.viewY -= deltaY / factor - deltaY;

    this.viewScaleX *= factor;
    this.viewScaleY *= factor;

    this.redraw();
  }

  // =========================================== //
  // Event listeners
  // =========================================== //
  onMouseEvent(event: MouseEvent){
    this.mouseDeltaX = event.offsetX - this.mouseX;
    this.mouseDeltaY = event.offsetY - this.mouseY;

    this.mouseX = event.offsetX;
    this.mouseY = event.offsetY;
  }

  onMouseUp(event: MouseEvent){
    this.onMouseEvent(event);

    if(event.button === 0) this.mouseButtonLeft = false;
    if(event.button === 1) this.mouseButtonMiddle = false;
    if(event.button === 2) this.mouseButtonRight = false;
  }
  
  onMouseMove(event: MouseEvent){
    this.onMouseEvent(event);

    if(this.mouseButtonMiddle || this.mouseButtonLeft){
      this.translate(
        this.toViewScaleX(this.mouseDeltaX), 
        this.toViewScaleY(this.mouseDeltaY));
    }
  }
  
  onMouseDown(event: MouseEvent){
    this.onMouseEvent(event);

    if(event.button === 0) this.mouseButtonLeft = true;
    if(event.button === 1) this.mouseButtonMiddle = true;
    if(event.button === 2) this.mouseButtonRight = true;
  }

  onMouseWheel(event: WheelEvent){
    let zoomFactor = 1;

    if(event.deltaY > 0) {
      zoomFactor = 0.9;
    }

    if(event.deltaY < 0) {
      zoomFactor = 1.1;
    }
    
    this.zoom(
      this.toViewX(this.mouseX), 
      this.toViewY(this.mouseY), 
      zoomFactor);
  }
  
  @HostListener('window:resize') 
  onWindowResize() {
    this.resize();
  }
}
