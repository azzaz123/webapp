import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractSelectFilter } from '../abstract-select-filter/abstract-select-filter';
import { FilterOption } from '../../core/interfaces/filter-option.interface';
import { take } from 'rxjs/operators';
import { SelectFilterParams } from './interfaces/select-filter-params.interface';
import { SelectFilterTemplateComponent } from '../abstract-select-filter/select-filter-template/select-filter-template.component';
import { FilterTemplateComponent } from '../abstract-filter/filter-template/filter-template.component';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { SelectFilterConfig } from './interfaces/select-filter-config.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { ComplexSelectValue } from '@shared/form/components/select/types/complex-select-value';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';

@Component({
  selector: 'tsl-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFilterComponent extends AbstractSelectFilter<SelectFilterParams> implements OnInit, OnDestroy {
  @Input() config: SelectFilterConfig;

  @ViewChild('selectFilterTemplateComponent', { read: SelectFilterTemplateComponent })
  public selectFilterTemplate: SelectFilterTemplateComponent;
  @ViewChild('filterTemplateComponent', { read: FilterTemplateComponent })
  public filterTemplate: FilterTemplateComponent;

  public formGroup = new FormGroup({
    select: new FormControl(),
  });
  public options: FilterOption[] = [];

  private subscriptions = new Subscription();

  public constructor(private optionService: FilterOptionService) {
    super();
  }

  public ngOnInit(): void {
    this.optionService
      .getOptions(this.config.id)
      .pipe(take(1))
      .subscribe((options) => (this.options = options));
    this.initForm();
    super.ngOnInit();
  }

  public onValueChange(previousValue: FilterParameter[], currentValue: FilterParameter[]): void {
    this.updateValueFromParent();
  }

  public getLabel(): string {
    const value = this.getValue('parameterKey');
    return value ? this.options.find((option) => option.value === value).label : this.getLabelPlaceholder();
  }

  public getPlaceholderIcon(): string {
    const value = this.getValue('parameterKey');
    return value ? this.options.find((option) => option.value === value).icon : undefined;
  }

  public handleClear(): void {
    this.formGroup.controls.select.setValue(undefined, { emitEvent: false });
    super.handleClear();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initForm(): void {
    const subscription = this.formGroup.controls.select.valueChanges.subscribe(this.handleValueChange.bind(this));
    this.subscriptions.add(subscription);
  }

  private updateValueFromParent(): void {
    this.formGroup.controls.select.setValue(this.getValue('parameterKey'), { emitEvent: false });
  }

  private handleValueChange(value: ComplexSelectValue): void {
    this.closeContent();

    if (!value) {
      this.writeValue([]);
    } else if (this.isStringValue(value)) {
      this.writeValue([{ key: this.config.mapKey.parameterKey, value: value }]);
    } else {
      const keys = Object.keys(value);
      this.writeValue(keys.map((key) => ({ key: key, value: value[key] })));
    }

    this.valueChange.emit(this._value);
  }

  private getLabelPlaceholder(): string {
    if (this.variant === FILTER_VARIANT.BUBBLE) {
      return this.config.bubblePlaceholder;
    }
    return this.config.drawerPlaceholder;
  }

  private closeContent(): void {
    if (this.variant === FILTER_VARIANT.BUBBLE && this.filterTemplate.isDropdownOpen) {
      this.filterTemplate.toggleDropdown();
    }
    if (this.config.hasContentPlaceholder && this.selectFilterTemplate.isPlaceholderOpen) {
      this.selectFilterTemplate.togglePlaceholderOpen();
    }
  }

  private isStringValue(value: ComplexSelectValue): value is string {
    return typeof value === 'string';
  }
}
