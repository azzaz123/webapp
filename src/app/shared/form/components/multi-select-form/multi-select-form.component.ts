import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
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
    this.extendedOptions = this.formatToExtendedOptions(value);
    this.mapCheckedValue();
    this.extendedOptionsSubject.next(this.extendedOptions);
  }
  @Input() disabled: boolean = false;

  private extendedOptions: TemplateMultiSelectFormOption[] = [];
  private extendedOptionsSubject: BehaviorSubject<TemplateMultiSelectFormOption[]> = new BehaviorSubject([]);
  private shownChildrenOptionIdSubject: BehaviorSubject<string> = new BehaviorSubject(null);
  public extendedOptions$: Observable<TemplateMultiSelectFormOption[]> = this.extendedOptionsSubject.asObservable();
  public shownChildrenOptionId$: Observable<string> = this.shownChildrenOptionIdSubject.asObservable();

  constructor(private elementRef: ElementRef) {
    super();

    this.shownChildrenOptionId$.subscribe(() => {
      this.elementRef.nativeElement.scrollTo(0, 0);
    });
  }

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

    this.value = this.getValue(this.extendedOptions);
    this.onChange(this.value);
  }

  public showChildren(option: TemplateMultiSelectFormOption): void {
    if (option.children?.length) {
      this.shownChildrenOptionIdSubject.next(option.value);
    }
  }

  public restartNavigation(): void {
    this.shownChildrenOptionIdSubject.next(null);
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
      const { label, sublabel, icon, value } = option;

      if (option.children?.length) {
        return { label, sublabel, icon, value, children: this.formatToExtendedOptions(option.children), checked: false };
      } else {
        return { label, sublabel, icon, value, checked: false };
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
