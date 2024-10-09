import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';

const TYPE_FLOAT = "float";
const TYPE_INTEGER = "integer";
const TYPE_STRING = "string";

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent implements OnChanges {
  @Input() warning: boolean = false;
  @Input() editable: boolean = true;
  @Input() value: string|number|undefined;
  @Input() type: string = TYPE_STRING;

  @Output() onIntegerChanged = new EventEmitter<number>();
  @Output() onFloatChanged = new EventEmitter<number>();
  @Output() onStringChanged = new EventEmitter<string>();

  internalValue: string = "";
  valid: boolean = true;

  ngOnChanges(){
    if(this.value !== undefined){
      this.internalValue = "" + this.value;
    }

    this.validate();
  }

  changed(){
    if(this.validate()){
      this.emitResult();
    }
  }

  validate(){
    let pattern = this.getPattern();
  
    this.valid = pattern.test(this.internalValue);

    return this.valid;
  }

  emitResult(){
    if(this.type === TYPE_FLOAT){
      this.onFloatChanged.emit(parseFloat(this.internalValue));
    }
    else if(this.type === TYPE_INTEGER){
      this.onIntegerChanged.emit(parseInt(this.internalValue));
    }
    else {
      this.onStringChanged.emit(this.internalValue);
    }
  }

  getPattern(): RegExp{
    if(this.type === TYPE_FLOAT){
      return /^-?[0-9]+(\.[0-9]*)?$/;
    }
    else if(this.type === TYPE_INTEGER){
      return /^-?[0-9]+$/;
    }
    else {
      return /[\s\S]*/;
    }
  }

}
