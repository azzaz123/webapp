import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { SelectFormOption } from '../select/interfaces/select-form-option.interface';
import { ComplexSelectValue } from '../select/types/complex-select-value';

export type MultiSelectValue = string[];

export interface MultiSelectFormOption extends SelectFormOption<string> {
  checked: boolean;
}

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectFormComponent extends AbstractFormComponent<MultiSelectValue> {
  @Input() set options(value: SelectFormOption<string>[]) {
    this.extendedOptions = value.map((option) => {
      return { ...option, checked: false };
    });
  }
  @Input() isDisabled: boolean = false;

  public extendedOptions: MultiSelectFormOption[] = [];

  public writeValue(value: MultiSelectValue): void {
    this.value = value;
    console.log('writeValue', value);

    this.extendedOptions.map((option) => {
      option.checked = this.value.includes(option.value);
      return option;
    });
  }

  public handleSelectedOption(option: MultiSelectFormOption) {
    console.log(this.extendedOptions, option);

    // manage the value array depedning on this option.checked
    this.onChange(this.value);

    /*  // const { option, isChecked } = event;
    // if (isChecked) {
    //   this.selectedOptions.push(option);
    //   this.onChange(this.selectedOptions);
    // } else {
    //   const index = this.selectedOptions.indexOf(option);
    //   this.selectedOptions.splice(index, 1);
    } */
  }
}
