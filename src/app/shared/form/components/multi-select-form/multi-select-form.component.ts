import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { SelectFormOption } from '../select/interfaces/select-form-option.interface';
import { MultiSelectFormOption } from './interfaces/multi-select-form-option.interface';
import { MultiSelectValue } from './interfaces/multi-select-value.type';
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
  @Input() disabled: boolean = false;

  public extendedOptions: MultiSelectFormOption[] = [];

  public writeValue(value: MultiSelectValue): void {
    this.value = value;

    this.mapCheckedValue();
  }

  public handleSelectedOption(): void {
    this.value = this.extendedOptions
      .filter((option) => {
        return option.checked;
      })
      .map((option) => {
        return option.value;
      });
    this.onChange(this.value);
  }

  private mapCheckedValue(): void {
    this.value.map((checkedValue: string) => {
      this.extendedOptions.forEach((option: MultiSelectFormOption) => {
        if (option.value === checkedValue) {
          option.checked = true;
        } else option.checked = false;
      });
    });
  }
}
