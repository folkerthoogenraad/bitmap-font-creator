import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-checkbox',
  templateUrl: './input-checkbox.component.html',
  styleUrls: ['./input-checkbox.component.scss']
})
export class InputCheckboxComponent {
  @Input() checked: boolean = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  click(){
    this.checked = !this.checked;

    this.checkedChange.emit(this.checked);
  }
}
