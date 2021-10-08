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

  private subscriptions = new Subscription();
  private labelSubject = new BehaviorSubject(undefined);
  private placeholderIconSubject = new BehaviorSubject(undefined);

  public formGroup = new FormGroup({
    select: new FormControl(),
  });
  public options: FilterOption[] = [];
  private allOptions: FilterOption[] = [];

  public label$ = this.labelSubject.asObservable();
  public placeholderIcon$ = this.labelSubject.asObservable();

  public constructor(private optionService: FilterOptionService) {
    super();
  }

  public ngOnInit(): void {
    this.optionService
      .getOptions(this.config.id)
      .pipe(take(1))
      .subscribe((options) => {
        this.options = options;
        this.allOptions = this.mergeOptions(options);
        this.updateLabel();
      });

    this.updatePlaceholderIcon();
    super.ngOnInit();
  }

  public onValueChange(previousValue: FilterParameter[], currentValue: FilterParameter[]): void {
    this.updateValueFromParent();
    this.updateLabel();
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
    }
    this.openStateChange.emit($event);
  }

  private restartMultiselectNavigation(): void {
    this.multiselectForm.restartNavigation();
  }

  private mergeOptions(options: FilterOption[]): FilterOption[] {
    let allOptions = [...options];

    allOptions.map((option: FilterOption) => {
      if (option.children?.length) {
        allOptions = allOptions.concat(option.children);
      }
    });

    return allOptions;
  }

  private updateLabel(): void {
    this.labelSubject.next(this._value.length && this.options.length ? this.buildLabel() : this.getLabelPlaceholder());
  }

  private updatePlaceholderIcon(): void {
    if (this.variant === FILTER_VARIANT.CONTENT && this.config.hasContentPlaceholder) {
      const value = this.formGroup.controls.select.value;
      this.placeholderIconSubject.next(value ? this.options.find((option) => option.value === value)?.icon : undefined);
    }
  }

  private buildLabel(): string {
    let label = '';
    const stringValues = this._value.find((option) => option.key === this.config.mapKey.parameterKey).value?.split(',');

    stringValues.forEach((value: string, index: number) => {
      const valueOption = this.allOptions.find((option) => {
        return option.value === value;
      });
      label += valueOption ? `${index !== 0 && label.length > 2 ? ', ' : ''}${valueOption.label}` : '';
    });

    return label.length ? label : this.getLabelPlaceholder();
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
}
