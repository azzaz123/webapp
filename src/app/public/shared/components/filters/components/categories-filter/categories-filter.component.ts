import { AfterContentInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractFilter } from '../abstract-filter/abstract-filter';
import { CategoriesFilterParams } from './interfaces/categories-filter-params.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { GridSelectFormOption } from '@shared/form/components/grid-select/interfaces/grid-select-form-option.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { CATEGORY_OPTIONS } from './data/category_options';
import { BehaviorSubject, Observable } from 'rxjs';
import { CategoriesFilterIcon } from './interfaces/categories-filter-icon.interface';
import { CategoriesFilterOption } from './interfaces/categories-filter-option.interface';
import { Subscription } from 'rxjs/internal/Subscription';
import { FilterTemplateComponent } from '../abstract-filter/filter-template/filter-template.component';
import { SelectFilterTemplateComponent } from '../abstract-select-filter/select-filter-template/select-filter-template.component';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { CategoriesFilterConfig } from './interfaces/categories-filter-config.interface';

@Component({
  selector: 'tsl-categories-filter',
  templateUrl: './categories-filter.component.html',
  styleUrls: ['./categories-filter.component.scss'],
})
export class CategoriesFilterComponent extends AbstractFilter<CategoriesFilterParams> implements OnInit, OnDestroy, AfterContentInit {
  @Input() config: CategoriesFilterConfig;

  public VARIANT = FILTER_VARIANT;
  public formGroup = new FormGroup({
    select: new FormControl([]),
  });

  @ViewChild(FilterTemplateComponent) filterTemplate: FilterTemplateComponent;
  @ViewChild(SelectFilterTemplateComponent) placeholderTemplate: SelectFilterTemplateComponent;

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

  public static getGridOptions(): GridSelectFormOption[] {
    return CATEGORY_OPTIONS;
  }

  public static getSelectOptions(): SelectFormOption<string>[] {
    return CATEGORY_OPTIONS.map((option) => ({
      ...option,
      icon: option.icon.stroke,
    }));
  }

  public ngOnInit() {
    super.ngOnInit();
    this.updateSubjects();
    this.initializeForm();
  }

  public ngAfterContentInit(): void {
    if (this.value.length > 0) {
      this.updateValueFromParent();
    }
  }

  public onValueChange(previousValue: FilterParameter[], currentValue: FilterParameter[]): void {
    console.log(previousValue, currentValue);
    if (this.hasValueChanged(previousValue, currentValue)) {
      if (this._value.length > 0) {
        this.updateValueFromParent();
      } else {
        this.cleanForm();
      }
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
    this.writeValue(this.getFilterParameterValue());
    this.valueChange.emit(this._value);
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
    this.iconSubject.next(this.getCategoryIcon(value, value === '' ? 'standard' : 'stroke'));
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
}
