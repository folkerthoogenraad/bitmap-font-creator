import { Component, OnInit, HostListener } from '@angular/core';
import { toFntFile } from 'src/ts/FntWriter';
import { FontImage, FontModel, FontOtfSettings, FontSettings } from 'src/ts/FontModel';
import { initPWA, PWA } from 'src/ts/pwa/PWA';
import { toOTFFile } from 'src/ts/OTFWriter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Bitmap Font Generator';
  model = new FontModel();
  isFullscreen = true;

  ngOnInit(){
    this.load();

    this.isFullscreen = !PWA.isBrowser;
  }

  loadImage(element: FontImage){
    this.model = this.model.setImage(element);
    this.save();
  }
  loadSettings(settings: FontSettings){
    this.model = this.model.setSettings(settings);
    this.save();
  }
  loadOtfSettings(otfSettings: FontOtfSettings){
    this.model = this.model.setOtfSettings(otfSettings);
    this.save();
  }
  async downloadFnt(){
    let data = toFntFile(this.model);

    let fileName = this.model.getFntFileName();

    let w = window as any;

    if(!w.showOpenFilePicker){
      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
      element.setAttribute('download', fileName);
    
      element.style.display = 'none';
      document.body.appendChild(element);
    
      element.click();
    
      document.body.removeChild(element);
    }
    else{
      const options = {
        multiple: false,
        suggestedName: fileName
      };
      let fileHandle = await w.showSaveFilePicker(options);

      const writableStream = await fileHandle.createWritable();

      await writableStream.write(data);
      await writableStream.close();
    }
  }
  
  async downloadOtf(){
    let data = toOTFFile(this.model);

    let fileName = this.model.getOtfFileName();

    let w = window as any;

    if(!w.showOpenFilePicker){
      let element = document.createElement('a');

      const href = window.URL.createObjectURL(new Blob([data]));

      element.setAttribute('href', href);
      element.setAttribute('download', fileName);
    
      element.style.display = 'none';
      document.body.appendChild(element);
    
      element.click();
    
      document.body.removeChild(element);
    }
    else{
      const options = {
        multiple: false,
        suggestedName: fileName
      };
      let fileHandle = await w.showSaveFilePicker(options);

      const writableStream = await fileHandle.createWritable();

      await writableStream.write(data);
      await writableStream.close();
    }
  }

  private load(){
    let data = localStorage.getItem("data");
    
    if(data === null) return;

    let info = JSON.parse(data);

    let settings = this.model.settings;

    this.model = this.model.setSettings(new FontSettings(
      info.fontName ?? settings.fontName,
      info.tileSizeX ?? settings.tileSizeX,
      info.tileSizeY ?? settings.tileSizeY,
      info.fontSize ?? settings.fontSize,
      info.lineHeight ?? settings.lineHeight,
      info.letterSpacing ?? settings.letterSpacing,
      info.baseLine ?? settings.baseLine,
      info.spaceSize ?? settings.spaceSize,
      info.characters ?? settings.characters));
  }

  hasImage(){
    if(this.model.imageData === undefined) return false;
    if(this.model.imageData.image === undefined) return false;

    return true;
  }

  private saveInternal(){
    localStorage.setItem("data", JSON.stringify(this.model.settings));
  }

  @HostListener('document:keydown.control.s', ['$event']) 
  onKeydownHandler(event: KeyboardEvent) {
    this.downloadFnt();
    event.preventDefault();
  }    
  @HostListener('window:resize', ['$event']) 
  onResize() {
    this.isFullscreen = !PWA.isBrowser;
  }    

  private _timeout?: ReturnType<typeof setTimeout>;
  private save(){
    clearTimeout(this._timeout);

    this._timeout = setTimeout(() => {
      this.saveInternal();
    }, 500);
  }
}
