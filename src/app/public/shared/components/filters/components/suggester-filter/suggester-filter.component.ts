import { AfterContentInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractSelectFilter } from '../abstract-select-filter/abstract-select-filter';
import { SuggesterFilterParams } from './interfaces/suggester-filter-params.interface';
import { SelectFilterTemplateComponent } from '../abstract-select-filter/select-filter-template/select-filter-template.component';
import { FilterTemplateComponent } from '../abstract-filter/filter-template/filter-template.component';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterOption } from '../../core/interfaces/filter-option.interface';
import { Subscription } from 'rxjs/internal/Subscription';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { ComplexSelectValue } from '@shared/form/components/select/types/complex-select-value';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { SuggesterFilterConfig } from './interfaces/suggester-filter-config.interface';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';

// TODO: Tech debt. Need to set to onpush
@Component({
  selector: 'tsl-suggester-filter',
  templateUrl: './suggester-filter.component.html',
  styleUrls: ['./suggester-filter.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggesterFilterComponent extends AbstractSelectFilter<SuggesterFilterParams> implements OnInit, OnDestroy, AfterContentInit {
  @Input() config: SuggesterFilterConfig;

  @ViewChild('selectFilterTemplateComponent', { read: SelectFilterTemplateComponent })
  public selectFilterTemplate: SelectFilterTemplateComponent;
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
    super.ngOnInit();
    if (this.config.hasOptionsOnInit) {
      this.getOptions();
    }
    this.initLabel();
    this.initForm();
    this.initModel();
  }

  public ngAfterContentInit(): void {
    if (this.value.length > 0) {
      this.updateValueFromParent();
    }
  }

  public onValueChange(previousValue: FilterParameter[], currentValue: FilterParameter[]): void {
    if (this.hasValueChanged(previousValue, currentValue)) {
      if (this._value.length > 0) {
        this.updateValueFromParent();
      } else {
        this.handleClear();
      }
    }
  }

  // TODO: TechDebt(brand/model). This overwrite is needed to be able to handle the brand/model filter. In this filter, we are not
  //       able to use the mapKey configuration because this comes from the backend dynamically, and the hasValueChanged
  //       check depends on the mapKey configuration. There should be a new filter type for this case.

  public hasValueChanged(previousParameters: FilterParameter[], currentParameters: FilterParameter[]): boolean {
    if (!previousParameters && !currentParameters) {
      return false;
    } else if (!previousParameters) {
      return true;
    } else if (previousParameters.length !== currentParameters.length) {
      return true;
    }

    for (const currentParameter of currentParameters) {
      const previousParameter = previousParameters.find((parameter) => parameter.key === currentParameter.key);

      if (!previousParameter || previousParameter.value !== currentParameter.value) {
        return true;
      }
    }

    return false;
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
      this.writeValue(keys.map((key) => ({ key: key, value: value[key] })));
    }

    this.valueChange.emit(this._value);
  }

  private handleLabelChange(): void {
    const value = this.getComplexValue();
    if (!value) {
      return this.initLabel();
    }

    if (typeof value === 'string') {
      return this.labelSubject.next(value);
    }

    // TODO: TechDebt(brand/model) On the case of a complex value, when it enters through query, we don't have the options loaded
    //       Complex values (brand/model filter) are always concatenated strings so we can just directly grab it from its values
    return this.labelSubject.next(
      Object.keys(value)
        .map((key) => value[key])
        .join(', ')
    );
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
    this.optionService
      .getOptions(this.config.id, query ? { text: query } : undefined)
      .pipe(take(1))
      .subscribe((options) => this.optionsSubject.next(options));
  }
}
