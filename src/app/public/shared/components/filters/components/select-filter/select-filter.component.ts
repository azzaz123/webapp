import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractSelectFilter } from '../abstract-select-filter/abstract-select-filter';
import { FilterOption } from '../../core/interfaces/filter-option.interface';
import { take } from 'rxjs/operators';
import { SelectFilterParams } from './interfaces/select-filter-params.interface';
import { DrawerPlaceholderTemplateComponent } from '../abstract-select-filter/select-filter-template/drawer-placeholder-template.component';
import { FilterTemplateComponent } from '../abstract-filter/filter-template/filter-template.component';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { SelectFilterConfig } from './interfaces/select-filter-config.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { ComplexSelectValue } from '@shared/form/components/select/types/complex-select-value';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'tsl-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFilterComponent extends AbstractSelectFilter<SelectFilterParams> implements OnInit, OnDestroy {
  @Input() config: SelectFilterConfig;

  @ViewChild('selectFilterTemplateComponent', { read: DrawerPlaceholderTemplateComponent })
  public selectFilterTemplate: DrawerPlaceholderTemplateComponent;
  @ViewChild('filterTemplateComponent', { read: FilterTemplateComponent })
  public filterTemplate: FilterTemplateComponent;

  private options: FilterOption[] = [];
  private subscriptions = new Subscription();
  private labelSubject = new BehaviorSubject(undefined);
  private placeholderIconSubject = new BehaviorSubject(undefined);
  private optionsSubject: BehaviorSubject<FilterOption[]> = new BehaviorSubject([]);

  public formGroup = new FormGroup({
    select: new FormControl(),
  });
  public options$ = this.optionsSubject.asObservable();
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
        this.optionsSubject.next(options);
        this.options = options;
        this.updateLabel();
      });
    this.initForm();
    this.updateLabel();
    this.updatePlaceholderIcon();
    super.ngOnInit();
  }

  public onValueChange(previousValue: FilterParameter[], currentValue: FilterParameter[]): void {
    this.updateValueFromParent();
    this.updateLabel();
  }

  public handleClear(): void {
    this.formGroup.controls.select.setValue(undefined, { emitEvent: false });
    this.updateLabel();
    this.updatePlaceholderIcon();
    super.handleClear();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private updateLabel(): void {
    const value = this.formGroup.controls.select.value;
    this.labelSubject.next(value ? this.options.find((option) => option.value === value)?.label : this.getLabelPlaceholder());
  }

  private updatePlaceholderIcon(): void {
    if (this.variant === FILTER_VARIANT.CONTENT && this.config.hasContentPlaceholder) {
      const value = this.formGroup.controls.select.value;
      this.placeholderIconSubject.next(value ? this.options.find((option) => option.value === value)?.icon : undefined);
    }
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
      this.writeValue(keys.map((key: FILTER_QUERY_PARAM_KEY) => ({ key: key, value: value[key] })));
    }

    this.updateLabel();
    this.updatePlaceholderIcon();

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
