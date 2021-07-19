import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MultiSelectFormOption } from '../../interfaces/multi-select-form-option.interface';

@Component({
  selector: 'tsl-multi-select-option',
  templateUrl: './multi-select-option.component.html',
  styleUrls: ['./multi-select-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectOptionComponent {
  @Input() option: MultiSelectFormOption;
  @Input() disabled: boolean;
  @Output() toggleOnChange = new EventEmitter();

  public toggleCheckbox(): void {
    this.toggleOnChange.emit();
  }
}
