import { Component, OnInit } from '@angular/core';
import { AbstractFilter } from '@public/shared/components/filters/components/abstract-filter/abstract-filter';
import { CategoriesFilterParams } from '@public/shared/components/filters/components/categories-filter/interfaces/categories-filter-params.interface';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { GridSelectFormOption } from '@shared/form/components/grid-select/interfaces/grid-select-form-option.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { CATEGORY_OPTIONS } from '@public/shared/components/filters/components/categories-filter/data/category_options';
import { BehaviorSubject, Observable } from 'rxjs';
import { CategoriesFilterIcon } from '@public/shared/components/filters/components/categories-filter/interfaces/categories-filter-icon.interface';
import { CategoriesFilterOption } from '@public/shared/components/filters/components/categories-filter/interfaces/categories-filter-option.interface';

@Component({
  selector: 'tsl-categories-filter',
  templateUrl: './categories-filter.component.html',
  styleUrls: ['./categories-filter.component.scss'],
})
export class CategoriesFilterComponent extends AbstractFilter<CategoriesFilterParams> implements OnInit {
  public VARIANT = FILTER_VARIANT;
  public formGroup = new FormGroup({
    select: new FormControl([]),
  });

  private iconSubject = new BehaviorSubject('');
  private placeholderIconSubject = new BehaviorSubject('');
  private labelSubject = new BehaviorSubject('');

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
    this.initializeSubjects();
  }

  public getGridOptions(): GridSelectFormOption[] {
    return CATEGORY_OPTIONS;
  }

  public getSelectOptions(): SelectFormOption<string>[] {
    return [];
  }

  private initializeSubjects(): void {
    this.iconSubject.next(this.getCategoryIcon(null, 'standard'));
    this.placeholderIconSubject.next(this.getCategoryIcon(null, 'standard'));
    this.labelSubject.next(this.getCategoryLabel(null));
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
}
