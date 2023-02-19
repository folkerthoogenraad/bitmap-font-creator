import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FontSettings } from 'src/ts/FontModel';

@Component({
  selector: 'app-font-settings',
  templateUrl: './font-settings.component.html',
  styleUrls: ['./font-settings.component.scss']
})
export class FontSettingsComponent {
  @Input() settings!: FontSettings;
  @Output() onSettingsChange = new EventEmitter<FontSettings>();

  updateSettings(settings: FontSettings){
    this.onSettingsChange.emit(settings);
  }
}
