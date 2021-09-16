import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { Observable, BehaviorSubject } from 'rxjs';
import { SelectFormOption } from '../select/interfaces/select-form-option.interface';
import { MultiSelectFormOption, TemplateMultiSelectFormOption } from './interfaces/multi-select-form-option.interface';
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
  @Input() set options(value: MultiSelectFormOption[]) {
    this.extendedOptions = value.map((option) => {
      return { ...option, checked: false };
    });

    this.mapCheckedValue();
    this.extendedOptionsSubject.next(this.extendedOptions);
  }
  @Input() disabled: boolean = false;

  private extendedOptions: TemplateMultiSelectFormOption[] = [];
  private extendedOptionsSubject: BehaviorSubject<TemplateMultiSelectFormOption[]> = new BehaviorSubject([]);
  public extendedOptions$: Observable<TemplateMultiSelectFormOption[]> = this.extendedOptionsSubject.asObservable();

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
    this.extendedOptions = this.extendedOptions.map((option: TemplateMultiSelectFormOption) => {
      option.checked = this.value?.includes(option.value);
      return { ...option };
    });

    this.extendedOptionsSubject.next(this.extendedOptions);
  }
}
