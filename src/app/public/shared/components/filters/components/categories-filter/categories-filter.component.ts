import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'tsl-categories-filter',
  templateUrl: './categories-filter.component.html',
  styleUrls: ['./categories-filter.component.scss'],
})
export class CategoriesFilterComponent extends AbstractFilter<CategoriesFilterParams> implements OnInit, OnDestroy {
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

  public ngOnInit() {
    super.ngOnInit();
    this.updateSubjects();
    this.initializeForm();
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public getGridOptions(): GridSelectFormOption[] {
    return CATEGORY_OPTIONS;
  }

  public getSelectOptions(): SelectFormOption<string>[] {
    return [];
  }

  public handleClear() {
    super.handleClear();
    this.cleanForm();
  }

  private initializeForm(): void {
    this.subscriptions.add(
      this.formGroup.controls.select.valueChanges.subscribe((value) => {
        if (this.isAllCategoriesSelected(value[0])) {
          this.cleanForm();
        }
        this.handleValueChange();
        this.updateSubjects(value[0]);
        this.closeTemplates();
      })
    );
  }

  private handleValueChange(): void {
    this.writeValue(this.getFilterParameterValue());
  }

  private getFilterParameterValue(): FilterParameter[] {
    const value = this.formGroup.controls.select.value[0];
    if (value) {
      return [{ key: this.config.mapKey.parameterKey, value: this.formGroup.controls.select.value[0] }];
    }
    return [];
  }

  private isAllCategoriesSelected(value: string): boolean {
    return value === null;
  }

  private cleanForm(): void {
    this.formGroup.controls.select.reset([]);
  }

  private updateSubjects(value: string | null = null): void {
    this.iconSubject.next(this.getCategoryIcon(value, typeof value !== 'string' ? 'standard' : 'stroke'));
    this.placeholderIconSubject.next(this.getCategoryIcon(value, 'standard'));
    this.labelSubject.next(this.getCategoryLabel(value));
  }

  private getCategoryIcon(value: string | null, iconType: keyof CategoriesFilterIcon): string {
    return this.getCategoryByValue(value).icon[iconType];
  }

  private getCategoryLabel(value: string | null): string {
    return this.getCategoryByValue(value).label;
  }

  private getCategoryByValue(value: string | null): CategoriesFilterOption {
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
