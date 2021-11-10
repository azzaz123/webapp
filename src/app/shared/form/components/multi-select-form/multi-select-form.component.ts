import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, OnDestroy, Self } from '@angular/core';
import { FormControl, NgControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { Observable, BehaviorSubject } from 'rxjs';
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
    console.log('MultiSelectFormComponent set', value);
    if (value) {
      this.extendedOptions = this.formatToExtendedOptions(value);
      this.mapCheckedValue();
      this.extendedOptionsSubject.next(this.extendedOptions);
    }
  }
  @Input() disabled: boolean = false;
  @Input() max: number;

  private extendedOptions: TemplateMultiSelectFormOption[] = [];
  private extendedOptionsSubject: BehaviorSubject<TemplateMultiSelectFormOption[]> = new BehaviorSubject([]);
  private shownChildrenOptionIdSubject: BehaviorSubject<string> = new BehaviorSubject(null);
  public extendedOptions$: Observable<TemplateMultiSelectFormOption[]> = this.extendedOptionsSubject.asObservable();
  public shownChildrenOptionId$: Observable<string> = this.shownChildrenOptionIdSubject.asObservable();

  public maxLengthReached: boolean = false;

  constructor(private elementRef: ElementRef) {
    super();

    this.shownChildrenOptionId$.subscribe((shownChildrenOptionId) => {
      this.elementRef.nativeElement.scrollTo(0, 0);
    });
  }

  public writeValue(value: MultiSelectValue): void {
    this.value = value;
    this.mapCheckedValue();
    this.handleMaxLength();
  }

  public handleSelectedOption(): void {
    this.value = this.extendedOptions
      .filter((option) => {
        return option.checked;
      })
      .map((option) => {
        return option.value;
      });

    this.value = this.getValue(this.extendedOptions);
    this.onChange(this.value);
    this.handleMaxLength();
  }

  public showChildren(option: TemplateMultiSelectFormOption): void {
    if (option.children?.length) {
      this.shownChildrenOptionIdSubject.next(option.value);
    }
  }

  public restartNavigation(): void {
    this.shownChildrenOptionIdSubject.next(null);
  }

  public selectAllChildren(option: TemplateMultiSelectFormOption): void {
    const childValues = [...option.children].map((childOption) => childOption.value);
    this.value = this.value ? this.value.filter((value) => !childValues.includes(value)) : [];
    this.triggerValueChange([...this.value, option.value]);
  }

  public unselectAllChildren(option: TemplateMultiSelectFormOption): void {
    const valuesToRemove = [...this.getOptionValues(option.children), option.value];
    this.value = this.value ? this.value.filter((value) => !valuesToRemove.includes(value)) : [];
    this.triggerValueChange(this.value);
  }

  public unselectAll(): void {
    this.value = [];
    this.triggerValueChange(this.value);
  }

  public hasSelectedChildren(option: TemplateMultiSelectFormOption): boolean {
    return !![...option.children].filter((childOption) => childOption.checked).length;
  }

  public isDisabledByMaxLengthReached(checked: boolean): boolean {
    return !checked && this.maxLengthReached;
  }

  private handleMaxLength(): void {
    this.maxLengthReached = this.value?.length >= this.max;
  }

  private getOptionValues(options: TemplateMultiSelectFormOption[]): string[] {
    return [...options].map((childOption) => childOption.value);
  }

  private triggerValueChange(value: MultiSelectValue): void {
    this.writeValue(value);
    this.onChange(value);
  }

  private mapCheckedValue(): void {
    this.extendedOptions = this.mapCheckedOptions(this.extendedOptions);
    this.extendedOptionsSubject.next(this.extendedOptions);
  }

  private mapCheckedOptions(options: TemplateMultiSelectFormOption[]): TemplateMultiSelectFormOption[] {
    const mappedCheckedOptions: TemplateMultiSelectFormOption[] = options.map((option) => {
      const isChecked = this.value?.includes(option.value);

      if (option.children?.length) {
        if (isChecked) {
          option.checked = false;
          option.children.map((childOption) => (childOption.checked = true));
        } else {
          option.children = this.mapCheckedOptions(option.children);
        }
      } else {
        option.checked = isChecked;
      }

      return { ...option };
    });

    return mappedCheckedOptions;
  }

  private formatToExtendedOptions(options: MultiSelectFormOption[]): TemplateMultiSelectFormOption[] {
    const formattedExtendedOptions: TemplateMultiSelectFormOption[] = options.map((option) => {
      const { label, icon, value } = option;

      if (option.children?.length) {
        return { label, icon, value, children: this.formatToExtendedOptions(option.children), checked: false };
      } else {
        return { label, icon, value, checked: false };
      }
    });

    return formattedExtendedOptions;
  }

  private getValue(options: TemplateMultiSelectFormOption[]): string[] {
    let value = [];
    options.forEach((option: TemplateMultiSelectFormOption) => {
      if (option.checked) {
        value.push(option.value);
      } else {
        if (option.children?.length) {
          const checkedChildOptions = this.getValue(option.children);
          if (checkedChildOptions.length === option.children.length) {
            value = [...value, option.value];
          } else {
            value = [...value, ...this.getValue(option.children)];
          }
        }
      }
    });

    return value;
  }
}
