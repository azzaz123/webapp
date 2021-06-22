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
  @Output() toggleOnChange: EventEmitter<MultiSelectFormOption> = new EventEmitter<MultiSelectFormOption>();

  constructor() {}

  toggleCheckbox($event) {
    this.toggleOnChange.emit(this.option);
  }
}
