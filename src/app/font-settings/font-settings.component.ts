import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FontOtfSettings, FontSettings } from 'src/ts/FontModel';

@Component({
  selector: 'app-font-settings',
  templateUrl: './font-settings.component.html',
  styleUrls: ['./font-settings.component.scss']
})
export class FontSettingsComponent {
  @Input() settings!: FontSettings;
  @Input() otfSettings!: FontOtfSettings;
  @Output() onSettingsChange = new EventEmitter<FontSettings>();
  @Output() onOtfSettingsChange = new EventEmitter<FontOtfSettings>();

  updateSettings(settings: FontSettings){
    this.onSettingsChange.emit(settings);
  }
  updateOtfSettings(otfSettings: FontOtfSettings){
    this.onOtfSettingsChange.emit(otfSettings);
  }

  isPowerOfTwo(n: number){
    let check = 2;

    while(check <= n){
      if(check === n) return true;
      
      check *= 2;
    }

    return false;
  }
  isWholeNumber(n: number){
    return (n % 1) === 0;
  }
}
