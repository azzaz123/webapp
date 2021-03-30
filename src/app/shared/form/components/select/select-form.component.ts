import { Component, forwardRef, Input, ChangeDetectorRef } from '@angular/core';
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

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  writeValue(value: ComplexSelectValue) {
    super.writeValue(value);
    this.cdr.detectChanges();
    this.onChange(value);
  }

  public isOptionActive(value: ComplexSelectValue): boolean {
    return this.value === value;
  }
}
