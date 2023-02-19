import { Component, Output, EventEmitter, OnChanges, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FontImage } from 'src/ts/FontModel';
import { loadImageAsync, PWA, readFileAsync } from 'src/ts/pwa/PWA';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnChanges, OnInit {
  imageSource: string = "";

  @Input() image?: FontImage;
  @Output() onImageUpload = new EventEmitter<FontImage>();

  constructor(private ref: ChangeDetectorRef){

  }

  ngOnChanges(){
    this.imageSource = this.image?.image?.src ?? "";
  }
  ngOnInit(): void {
    if (this.imageSource.length != 0) return;

    this.processLaunchFiles(PWA.launchFiles);

    PWA.onLaunchFilesLoaded = (files) => {
      this.processLaunchFiles(files);

      console.log("Launch files processed");

      this.ref.detectChanges();
    }
  }

  processLaunchFiles(files: File[]){
    files.forEach(file => {
      this.processFile(file);
    });
  }

  openFile(){
    var input = document.createElement('input');
    input.type = 'file';
    input.click();

    input.onchange = e => { 
      if(input.files === null) return;

      for(let i = 0; i < input.files.length; i++){
        let file = input.files.item(i);
        
        if(file === null) continue;
  
        this.processFile(file);
      }
    }
  }


  onDrop(ev: DragEvent){
    if(!ev.dataTransfer) return;
    if(!ev.dataTransfer.items) return;

    for(let i = 0; i < ev.dataTransfer.items.length; i++){
      let item = ev.dataTransfer.items[i];

      if (item.kind !== "file") continue;
      if (!item.type.match(/image\/*/)){continue;}

      let file = item.getAsFile();

      if(file === null) continue;

      this.processFile(file);
    }
    
    ev.preventDefault();  
  }
  onDragOver(event: DragEvent){
    event.preventDefault();
  }
  onDragLeave(event: DragEvent){
    event.preventDefault();
  }

  async processFile(file: File){
    let source = await readFileAsync(file);
    let image = await loadImageAsync(source);

    this.imageSource = image.src;
    this.onImageUpload.emit(new FontImage(file.name, image));
    
    console.log("Updating files!");
    this.ref.detectChanges();
  }
}

