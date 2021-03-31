import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractSelectFilter } from '../abstract-select-filter/abstract-select-filter';
import { SuggesterFilterParams } from './interfaces/suggester-filter-params.interface';
import { SelectFilterTemplateComponent } from '../abstract-select-filter/select-filter-template/select-filter-template.component';
import { FilterTemplateComponent } from '../abstract-filter/filter-template/filter-template.component';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterOption } from '../../core/interfaces/filter-option.interface';
import { Subscription } from 'rxjs/internal/Subscription';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { take } from 'rxjs/operators';
import { ComplexSelectValue } from '@shared/form/components/select/types/complex-select-value';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { SuggesterFilterConfig } from './interfaces/suggester-filter-config.interface';

@Component({
  selector: 'tsl-suggester-filter',
  templateUrl: './suggester-filter.component.html',
  styleUrls: ['./suggester-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggesterFilterComponent extends AbstractSelectFilter<SuggesterFilterParams> implements OnInit, OnDestroy, OnChanges {
  @Input() config: SuggesterFilterConfig;

  @ViewChild('selectFilterTemplateComponent', { read: SelectFilterTemplateComponent })
  public selectFilterTemplate: SelectFilterTemplateComponent;
  @ViewChild('filterTemplateComponent', { read: FilterTemplateComponent })
  public filterTemplate: FilterTemplateComponent;

  public formGroup = new FormGroup({
    select: new FormControl(),
  });
  public options: FilterOption[] = [];
  public searchQuery = '';

  private subscriptions = new Subscription();

  public constructor(private optionService: FilterOptionService) {
    super();
  }

  public ngOnInit(): void {
    super.ngOnInit();
    if (this.config.hasOptionsOnInit) {
      this.optionService
        .getOptions(this.config.id, {
          text: this.searchQuery,
        })
        .pipe(take(1))
        .subscribe((options) => (this.options = options));
    }
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value && !changes.value.firstChange && this.hasValueChanged(changes.value.previousValue, changes.value.currentValue)) {
      if (this._value.length > 0) {
        this.updateForm();
      } else {
        this.handleClear();
      }
    }
  }

  public getLabel(): string {
    const value = this.getValue('parameterKey');
    return value ? this.options.find((option) => option.value === value).label : this.getLabelPlaceholder();
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

  private updateForm(): void {
    this.formGroup.controls.select.setValue(this.getValue('parameterKey'));
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

    this.valueChange.emit(this.value);
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
