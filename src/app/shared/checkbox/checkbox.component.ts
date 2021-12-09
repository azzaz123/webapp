import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'tsl-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
  @Input() checked = false;
  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() {}

  switchCheckbox() {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
    this.onChange.emit(this.checked);
  }
}
