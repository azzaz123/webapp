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
  @Input() options: [{ text: string; isChecked: boolean }];
  @Input() isDisabled: boolean = false;
  public selectedOptions: [] = [];
  /* public selected: boolean = true;
  public selectedOptions: [{ text: string; isChecked: boolean }] = [{text:null, isChecked:null}]; */

  public handleOptionClick(value: string): void {
    this.filterSelectedOptions(value);
    this.writeValue(value);
    this.onChange(this.selectedOptions);
  }

  private filterSelectedOptions(value: string): void {
    if (this.selectedOptions.includes(value)) return;
    this.selectedOptions.push(value);
  }
}
