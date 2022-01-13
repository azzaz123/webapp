import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, OnDestroy, Self } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { Observable, BehaviorSubject } from 'rxjs';
import { MultiSelectFormOption, TemplateMultiSelectFormOption } from '../multi-select-form/interfaces/multi-select-form-option.interface';
import { MultiSelectValue } from '../multi-select-form/interfaces/multi-select-value.type';
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
    if (value) {
      this.extendedOptions = this.formatToExtendedOptions(value);
      this.mapCheckedValue();
      this.extendedOptionsSubject.next(this.extendedOptions);
    }
  }
  @Input() set max(value: number) {
    this.maxLength = value;
    this.handleMaxLength();
  }
  @Input() isDisabled: boolean = false;
  @Input() reseteable: boolean = true;

  private extendedOptions: TemplateMultiSelectFormOption[] = [];
  private extendedOptionsSubject: BehaviorSubject<TemplateMultiSelectFormOption[]> = new BehaviorSubject([]);
  private shownChildrenOptionIdSubject: BehaviorSubject<string> = new BehaviorSubject(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public extendedOptions$: Observable<TemplateMultiSelectFormOption[]> = this.extendedOptionsSubject.asObservable();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public shownChildrenOptionId$: Observable<string> = this.shownChildrenOptionIdSubject.asObservable();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public maxLengthReached: boolean = false;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public maxLength: number;

  constructor() {
    super();
    this.value = [];
  }

  public writeValue(value: MultiSelectValue): void {
    this.value = value;
    this.mapCheckedValue();
    this.handleMaxLength();
  }

  public handleToggleChange(option: TemplateMultiSelectFormOption): void {
    if (option.checked) {
      this.addValue(option.value);
    } else {
      this.removeValue(option.value);
    }

    this.onChange([...this.value]);
    this.handleMaxLength();
  }

  public handleChildToggleChange(childOption: TemplateMultiSelectFormOption, parentOption: TemplateMultiSelectFormOption): void {
    const checkedValues = parentOption.children
      .filter((option) => {
        return option.checked;
      })
      .map((option) => {
        return option.value;
      });

    if (childOption.checked) {
      if (checkedValues.length === parentOption.children.length) {
        this.addValue(parentOption.value);
        parentOption.children.forEach((option) => {
          this.removeValue(option.value);
        });
      } else {
        this.addValue(childOption.value);
      }
    } else {
      this.removeValue(parentOption.value);
      this.removeValue(childOption.value);
      checkedValues.forEach((value) => {
        this.addValue(value);
      });
    }

    this.onChange([...this.value]);
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

  private removeValue(valueToRemove: string): void {
    this.value = this.value.filter((value) => {
      return value !== valueToRemove;
    });
  }

  private addValue(valueToAdd: string): void {
    this.value.push(valueToAdd);
  }

  private handleMaxLength(): void {
    this.maxLengthReached = this.value?.length >= this.maxLength;
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
}
