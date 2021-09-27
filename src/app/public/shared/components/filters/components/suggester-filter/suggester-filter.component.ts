import { AfterContentInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractSelectFilter } from '../abstract-select-filter/abstract-select-filter';
import { SuggesterFilterParams } from './interfaces/suggester-filter-params.interface';
import { DrawerPlaceholderTemplateComponent } from '../abstract-select-filter/select-filter-template/drawer-placeholder-template.component';
import { FilterTemplateComponent } from '../abstract-filter/filter-template/filter-template.component';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterOption } from '../../core/interfaces/filter-option.interface';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { ComplexSelectValue } from '@shared/form/components/select/types/complex-select-value';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { SuggesterFilterConfig } from './interfaces/suggester-filter-config.interface';
import { BehaviorSubject, Subject, Observable, Subscription } from 'rxjs';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

// TODO: Tech debt. Need to set to onpush
@Component({
  selector: 'tsl-suggester-filter',
  templateUrl: './suggester-filter.component.html',
  styleUrls: ['./suggester-filter.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggesterFilterComponent extends AbstractSelectFilter<SuggesterFilterParams> implements OnInit, OnDestroy, AfterContentInit {
  @Input() config: SuggesterFilterConfig;

  @ViewChild('selectFilterTemplateComponent', { read: DrawerPlaceholderTemplateComponent })
  public selectFilterTemplate: DrawerPlaceholderTemplateComponent;
  @ViewChild('filterTemplateComponent', { read: FilterTemplateComponent })
  public filterTemplate: FilterTemplateComponent;

  public formGroup = new FormGroup({
    select: new FormControl(),
  });
  public searchQuery: string;
  private optionsSubject = new BehaviorSubject<FilterOption[]>([]);
  private searchQuery$ = new Subject<string>();
  private labelSubject: BehaviorSubject<string> = new BehaviorSubject('');

  private subscriptions = new Subscription();

  constructor(private optionService: FilterOptionService) {
    super();
  }

  public get options$(): Observable<FilterOption[]> {
    return this.optionsSubject.asObservable();
  }

  public get label$(): Observable<string> {
    return this.labelSubject.asObservable();
  }

  public ngOnInit(): void {
    if (this.config.hasOptionsOnInit) {
      this.getOptions();
    }
    this.initLabel();
    this.initForm();
    this.initModel();
    super.ngOnInit();
  }

  public ngAfterContentInit(): void {
    if (this.value.length > 0) {
      this.updateValueFromParent();
    }
  }

  public onValueChange(previousValue: FilterParameter[], currentValue: FilterParameter[]): void {
    if (this._value.length > 0) {
      this.updateValueFromParent();
    } else {
      this.handleClear();
    }
  }

  public handleClear(): void {
    super.handleClear();
    this.formGroup.controls.select.setValue(undefined, { emitEvent: false });
    this.clearSearch();
    this.initLabel();
  }

  public clearSearch(): void {
    this.searchQuery = '';
    this.searchQuery$.next('');
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initForm(): void {
    const labelSubscription = this.valueChange.subscribe(this.handleLabelChange.bind(this));
    const valueSubscription = this.formGroup.controls.select.valueChanges.subscribe(this.handleValueChange.bind(this));

    this.subscriptions.add(labelSubscription);
    this.subscriptions.add(valueSubscription);
  }

  private updateValueFromParent(): void {
    this.formGroup.controls.select.setValue(this.getComplexValue(), { emitEvent: false });
    this.handleLabelChange();
  }

  private getComplexValue(): string | Record<string, string> {
    if (this.config.mapKey.parameterKey) {
      return this.getValue('parameterKey');
    }
    return this._value.reduce((acc, parameter) => {
      const value = {
        [parameter.key]: parameter.value,
      };
      return { ...acc, ...value };
    }, {});
  }

  private initModel(): void {
    const subscription = this.searchQuery$.pipe(debounceTime(500), distinctUntilChanged()).subscribe(this.getOptions.bind(this));
    this.subscriptions.add(subscription);
  }

  private initLabel(): void {
    const label = this.variant === FILTER_VARIANT.BUBBLE ? this.config.bubblePlaceholder : this.config.drawerPlaceholder;
    this.labelSubject.next(label);
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

    this.valueChange.emit(this._value);
  }

  private handleLabelChange(): void {
    const value = this.getComplexValue();
    if (!value) {
      return this.initLabel();
    }

    if (!this.config.isLabelInValue) {
      return this.labelSubject.next(this.optionsSubject.getValue().find((option) => option.value === value)?.label);
    }

    if (typeof value === 'string') {
      return this.labelSubject.next(value.replace(/\|/g, ', '));
    }

    return this.labelSubject.next(this.calculateComplexLabel(value));
  }

  private calculateComplexLabel(value: Record<string, string>): string {
    const mapKeys = Object.keys(this.config.mapKey);
    return mapKeys
      .map((key) => value[this.config.mapKey[key]])
      .filter((str) => str)
      .join(', ');
  }

  private closeContent(): void {
    if (this.variant === FILTER_VARIANT.BUBBLE && this.filterTemplate?.isDropdownOpen) {
      this.filterTemplate.toggleDropdown();
    }
    if (this.config.hasContentPlaceholder && this.selectFilterTemplate?.isPlaceholderOpen) {
      this.selectFilterTemplate.togglePlaceholderOpen();
    }
  }

  private isStringValue(value: ComplexSelectValue): value is string {
    return typeof value === 'string';
  }

  public onModelChanged() {
    this.searchQuery$.next(this.searchQuery);
  }

  private getOptions(query?: string): void {
    if (this.config.hasOptionsOnInit || query) {
      this.optionService
        .getOptions(this.config.id, query ? { text: query } : undefined)
        .pipe(take(1))
        .subscribe((options) => {
          this.optionsSubject.next(options);
        });
    }
  }
}
