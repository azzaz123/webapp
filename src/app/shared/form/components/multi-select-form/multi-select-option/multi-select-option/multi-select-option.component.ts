import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MultiSelectFormOption } from '../../multi-select-form.component';

@Component({
  selector: 'tsl-multi-select-option',
  templateUrl: './multi-select-option.component.html',
  styleUrls: ['./multi-select-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectOptionComponent {
  @Input() option: MultiSelectFormOption;
  @Input() isDisabled: boolean;
  @Output() toggleOnChange = new EventEmitter();

  constructor() {}

  toggleCheckbox() {
    this.toggleOnChange.emit();
  }
}
