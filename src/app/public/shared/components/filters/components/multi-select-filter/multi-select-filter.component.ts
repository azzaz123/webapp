import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractSelectFilter } from '../abstract-select-filter/abstract-select-filter';
import { FilterOption } from '../../core/interfaces/filter-option.interface';
import { take } from 'rxjs/operators';
import { MultiSelectFilterParams } from './interfaces/multi-select-filter-params.interface';
import { DrawerPlaceholderTemplateComponent } from '../abstract-select-filter/select-filter-template/drawer-placeholder-template.component';
import { FilterTemplateComponent } from '../abstract-filter/filter-template/filter-template.component';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { MultiSelectFilterConfig } from './interfaces/multi-select-filter-config.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MultiSelectFormComponent } from '@shared/form/components/multi-select-form/multi-select-form.component';
import { MULTISELECT_FILTER_BUBBLE_VARIANT } from './enum/multi-select-filter-bubble-variant.enum';
import { SelectOption } from '@shared/select/select.interface';

@Component({
  selector: 'tsl-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
  styleUrls: ['./multi-select-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectFilterComponent extends AbstractSelectFilter<MultiSelectFilterParams> implements OnInit, OnDestroy {
  @Input() config: MultiSelectFilterConfig;

  @ViewChild('selectFilterTemplateComponent', { read: DrawerPlaceholderTemplateComponent })
  public selectFilterTemplate: DrawerPlaceholderTemplateComponent;
  @ViewChild('filterTemplateComponent', { read: FilterTemplateComponent })
  public filterTemplate: FilterTemplateComponent;
  @ViewChild('multiselectForm', { read: MultiSelectFormComponent })
  private multiselectForm: MultiSelectFormComponent;

  public readonly MULTISELECT_FILTER_BUBBLE_VARIANT = MULTISELECT_FILTER_BUBBLE_VARIANT;
  public formGroup = new FormGroup({
    select: new FormControl(),
  });
  public options: FilterOption[] = [];
  public searchText: string;

  private subscriptions = new Subscription();
  private labelSubject = new BehaviorSubject(undefined);
  private multiValueSubject = new BehaviorSubject(undefined);
  private placeholderIconSubject = new BehaviorSubject(undefined);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public label$ = this.labelSubject.asObservable();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public placeholderIcon$ = this.labelSubject.asObservable();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public multiValue$ = this.multiValueSubject.asObservable();

  private offset = '0';
  private allOptions: FilterOption[] = [];

  public constructor(private optionService: FilterOptionService) {
    super();
  }

  public ngOnInit(): void {
    this.getOptions();
    this.updatePlaceholderIcon();
    super.ngOnInit();
  }

  public buildSingleBubbleLabel(hasValue: boolean, value: SelectOption[]): string {
    return hasValue
      ? value.length === 1
        ? value[0].label
        : `${value.length} ${this.config.singleBubbleValueLabel}`
      : this.config.bubblePlaceholder;
  }

  public onValueChange(): void {
    this.updateValueFromParent();
    this.updateLabel();
  }

  public handleMultiValueClear(valueToRemove: string): void {
    const clearValue = this.formGroup.controls.select.value.filter((value) => value !== valueToRemove);
    this.formGroup.controls.select.setValue(clearValue, { emitEvent: false });
    this.handleApply();
  }

  public handleClear(): void {
    this.formGroup.controls.select.setValue(undefined, { emitEvent: false });
    super.handleClear();
    this.updatePlaceholderIcon();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  public handleCancel(): void {
    const value = this.value.find((option) => option.key === this.config.mapKey.parameterKey)?.value?.split(',');
    this.formGroup.controls.select.setValue(value, {
      emitEvent: false,
    });
  }

  public handleApply(): void {
    this.handleValueChange(this.formGroup.controls.select.value);
    this.updateLabel();
    this.updatePlaceholderIcon();
    this.hasValueSubject.next(this._hasValue());
    this.valueChange.emit(this._value);
    this.closeContent();
  }

  public writeValue(value: FilterParameter[]): void {
    this._value = value;
    this.hasValueSubject.next(this._hasValue());
    this.updateLabel();
  }

  public placeholderOpenStateChange(isOpen: boolean): void {
    if (!isOpen) {
      this.handleApply();
    }
  }

  public filterTemplateOpenStateChange($event: boolean): void {
    if (!$event) {
      this.restartMultiselectNavigation();
      if (this.config.isSearchable) {
        this.restartSearch();
      }
    }
    this.openStateChange.emit($event);
  }

  public scrolledToBottom() {
    if (this.offset) {
      this.getOptions();
    }
  }

  public search(): void {
    this.offset = '0';
    this.getOptions();
  }

  private getOptions(): void {
    this.optionService
      .getOptions(this.config.id, { text: this.searchText || null }, { offset: parseInt(this.offset) })
      .pipe(take(1))
      .subscribe(({ list, paginationParameter }) => {
        const pagination = new URLSearchParams(paginationParameter);

        if (this.offset === '0') {
          this.options = list;
        } else {
          this.options = this.options.concat(list);
        }
        this.allOptions = this.mergeOptions(this.options);
        this.updateLabel();
        this.offset = pagination.get('start');
      });
  }

  private restartSearch(): void {
    this.searchText = '';
    this.offset = '0';
    this.getOptions();
  }

  private restartMultiselectNavigation(): void {
    this.multiselectForm.restartNavigation();
  }

  private mergeOptions(options: FilterOption[]): FilterOption[] {
    let allOptions = [...options];

    options.map((option: FilterOption) => {
      if (option.children?.length) {
        allOptions = allOptions.concat(option.children);
      }
    });

    return allOptions;
  }

  private updateLabel(): void {
    this.labelSubject.next(this._value.length && this.options.length ? this.buildLabel() : this.getLabelPlaceholder());
    this.multiValueSubject.next(this._value.length && this.options.length ? this.buildMultiValue() : [this.getLabelPlaceholder()]);
  }

  private updatePlaceholderIcon(): void {
    if (this.variant === FILTER_VARIANT.CONTENT && this.config.hasContentPlaceholder) {
      const value = this.formGroup.controls.select.value;
      this.placeholderIconSubject.next(value ? this.options.find((option) => option.value === value)?.icon : undefined);
    }
  }

  private buildLabel(): string {
    return (
      this.formatStringArrayToLabel(this.config.hasValueAsLabel ? this.getValueAsArray() : this.getValueLabelAsArray()) ||
      this.getLabelPlaceholder()
    );
  }

  private getValueLabelAsArray(): string[] {
    return this.getSelectedOptions().map((option: FilterOption) => {
      return option.label;
    });
  }

  private buildMultiValue(): FilterOption[] | string[] {
    return this.config.hasValueAsLabel
      ? this.getValueAsArray().map((value: string) => {
          return {
            value: value,
            label: value,
          };
        })
      : this.getSelectedOptions() || [this.getLabelPlaceholder()];
  }

  private updateValueFromParent(): void {
    this.formGroup.controls.select.setValue(this.getValueAsArray(), { emitEvent: false });
  }

  private handleValueChange(value: string[]): void {
    if (value) {
      this._value = [{ key: this.config.mapKey.parameterKey, value: value.toString() }];
    }
  }

  private getLabelPlaceholder(): string {
    return this.variant === FILTER_VARIANT.BUBBLE ? this.config?.bubblePlaceholder : this.config?.drawerPlaceholder;
  }

  private closeContent(): void {
    if (this.variant === FILTER_VARIANT.BUBBLE && this.filterTemplate.isDropdownOpen) {
      this.filterTemplate.toggleDropdown();
    }
    if (this.config.hasContentPlaceholder && this.selectFilterTemplate.isPlaceholderOpen) {
      this.selectFilterTemplate.togglePlaceholderOpen();
    }
  }

  private getValueAsArray(): string[] {
    return super.getValue('parameterKey')?.split(',') || [];
  }

  private formatStringArrayToLabel(stringArray: string[]): string {
    return stringArray.join(', ');
  }

  private getSelectedOptions(): FilterOption[] {
    return this.allOptions.filter((option) => {
      return this.getValueAsArray().includes(option.value.toString());
    });
  }
}
