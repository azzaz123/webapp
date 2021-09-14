import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractFilter } from '../abstract-filter/abstract-filter';
import { CategoriesFilterParams } from './interfaces/categories-filter-params.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { FormControl, FormGroup } from '@angular/forms';
import { CATEGORY_OPTIONS } from './data/category_options';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CategoriesFilterIcon } from './interfaces/categories-filter-icon.interface';
import { CategoriesFilterOption } from './interfaces/categories-filter-option.interface';
import { FilterTemplateComponent } from '../abstract-filter/filter-template/filter-template.component';
import { DrawerPlaceholderTemplateComponent } from '../abstract-select-filter/select-filter-template/drawer-placeholder-template.component';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { CategoriesFilterConfig } from './interfaces/categories-filter-config.interface';
import { HttpClient } from '@angular/common/http';
import { API_VERSION_URL } from '@public/core/constants/api-version-url-constants';
import { FILTER_OPTIONS_API_ENDPOINTS } from '@public/shared/services/filter-option/configurations/filter-options-api-endpoints';
import { CategoryResponse } from '@public/shared/services/filter-option/interfaces/option-responses/category.response';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tsl-categories-filter',
  templateUrl: './categories-filter.component.html',
  styleUrls: ['./categories-filter.component.scss'],
})
export class CategoriesFilterComponent extends AbstractFilter<CategoriesFilterParams> implements OnInit, OnDestroy {
  @Input() config: CategoriesFilterConfig;

  constructor(private httpClient: HttpClient) {
    super();
  }

  public VARIANT = FILTER_VARIANT;
  public formGroup = new FormGroup({
    select: new FormControl([]),
  });

  @ViewChild(FilterTemplateComponent) filterTemplate: FilterTemplateComponent;
  @ViewChild(DrawerPlaceholderTemplateComponent) placeholderTemplate: DrawerPlaceholderTemplateComponent;

  private iconSubject = new BehaviorSubject('');
  private placeholderIconSubject = new BehaviorSubject('');
  private labelSubject = new BehaviorSubject('');
  private subscriptions = new Subscription();

  public get icon$(): Observable<string> {
    return this.iconSubject.asObservable();
  }

  public get placeholderIcon$(): Observable<string> {
    return this.placeholderIconSubject.asObservable();
  }

  public get label$(): Observable<string> {
    return this.labelSubject.asObservable();
  }

  public ngOnInit() {
    this.getCategories().subscribe((categories: CategoriesFilterOption[]) => {
      this.config.options = categories;
      this.updateSubjects();
      this.initializeForm();
      super.ngOnInit();
    });
  }

  public onValueChange(previousValue: FilterParameter[], currentValue: FilterParameter[]): void {
    if (this._value.length > 0) {
      this.updateValueFromParent();
    } else {
      this.cleanForm();
    }
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private initializeForm(): void {
    this.subscriptions.add(
      this.formGroup.controls.select.valueChanges.subscribe(() => {
        const formattedValue = this.getFormValue();
        if (this.isAllCategoriesSelected(formattedValue)) {
          this.cleanForm();
        }
        this.handleValueChange();
        this.updateSubjects(formattedValue);
        this.closeTemplates();
      })
    );
  }

  private handleValueChange(): void {
    const value = this.getFilterParameterValue();
    if (value.length) {
      this.writeValue(value);
      this.valueChange.emit(this._value);
    } else {
      this.handleClear();
    }
  }

  private getFilterParameterValue(): FilterParameter[] {
    const value = this.getFormValue();
    if (value) {
      return [{ key: this.config.mapKey.parameterKey, value: this.getFormValue() }];
    }
    return [];
  }

  private isAllCategoriesSelected(value: string): boolean {
    return value === '';
  }

  private updateValueFromParent(): void {
    const value = this.getValue('parameterKey');
    this.formGroup.controls.select.setValue(this.variant === FILTER_VARIANT.BUBBLE ? [value] : value, { emitEvent: false });
    this.updateSubjects(value);
  }

  private cleanForm(): void {
    this.formGroup.controls.select.reset([]);
  }

  private getFormValue(): string {
    const value = this.formGroup.controls.select.value;
    return typeof value === 'string' ? value : value[0];
  }

  private updateSubjects(value: string = ''): void {
    this.iconSubject.next(this.getCategoryIcon(value, 'stroke'));
    this.placeholderIconSubject.next(this.getCategoryIcon(value, 'standard'));
    this.labelSubject.next(this.getCategoryLabel(value));
  }

  private getCategoryIcon(value: string, iconType: keyof CategoriesFilterIcon): string {
    return this.getCategoryByValue(value).icon[iconType];
  }

  private getCategoryLabel(value: string): string {
    return this.getCategoryByValue(value).label;
  }

  private getCategoryByValue(value: string): CategoriesFilterOption {
    return CATEGORY_OPTIONS.find((option) => option.value === value);
  }

  private closeTemplates(): void {
    if (this.filterTemplate?.isDropdownOpen) {
      this.filterTemplate.toggleDropdown();
    }
    if (this.placeholderTemplate?.isPlaceholderOpen) {
      this.placeholderTemplate.togglePlaceholderOpen();
    }
  }

  private getCategories(): Observable<CategoriesFilterOption[]> {
    return this.httpClient.get<CategoryResponse[]>(`${API_VERSION_URL.v3}${FILTER_OPTIONS_API_ENDPOINTS.CATEGORIES}`).pipe(
      map((categories: CategoryResponse[]) => {
        const formattedCategories: CategoriesFilterOption[] = [CATEGORY_OPTIONS[0]];

        categories.forEach((categoryResponse) => {
          const hardcodedCategory = CATEGORY_OPTIONS.find((category) => category.value === categoryResponse.category_id.toString());

          if (hardcodedCategory) {
            formattedCategories.push({
              value: categoryResponse.category_id.toString(),
              label: categoryResponse.name,
              icon: hardcodedCategory.icon,
            });
          }
        });

        return formattedCategories;
      })
    );
  }
}
