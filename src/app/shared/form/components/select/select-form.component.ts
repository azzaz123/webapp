import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractFormComponent } from '../../abstract-form/abstract-form-component';
import { SelectFormOption } from './interfaces/select-form-option.interface';
import { ComplexSelectValue } from './types/complex-select-value';

@Component({
  selector: 'tsl-select-form',
  templateUrl: './select-form.component.html',
  styleUrls: ['./select-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectFormComponent),
      multi: true,
    },
  ],
})
export class SelectFormComponent extends AbstractFormComponent<ComplexSelectValue> {
  @Input() options: SelectFormOption<ComplexSelectValue>[];

  constructor() {
    super();
  }

  writeValue(value: ComplexSelectValue) {
    super.writeValue(value);
    this.onChange(value);
  }

  public isOptionActive(optionValue: ComplexSelectValue): boolean {
    if (!this.value || typeof optionValue !== typeof this.value) {
      return false;
    }
    if (typeof optionValue === 'string') {
      return this.value === optionValue;
    }

    return this.isRecordValueActive(optionValue);
  }

  private isRecordValueActive(optionValue: Record<string, string>): boolean {
    const currentKeys = Object.keys(this.value);

    if (Object.keys(optionValue).length !== currentKeys.length) {
      return false;
    }

    for (const key of currentKeys) {
      if (optionValue[key] !== this.value[key]) {
        return false;
      }
    }

    return true;
  }
}
