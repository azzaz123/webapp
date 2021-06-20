import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { ComplexSelectValue } from '../select/types/complex-select-value';

@Component({
  selector: 'tsl-multi-select-form',
  templateUrl: './multi-select-form.component.html',
  styleUrls: ['./multi-select-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectFormComponent),
      multi: true,
    },
  ],
})
export class MultiSelectFormComponent extends AbstractFormComponent<ComplexSelectValue> {
  @Input() options: string[];
  @Input() isDisabled: boolean = false;

  public handleOptionClick(value: string): void {
    this.writeValue(value);
    this.onChange(value);
  }
}
