import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesFilterComponent } from './categories-filter.component';
import { Component, DebugElement, Input } from '@angular/core';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { CategoriesFilterConfig } from './interfaces/categories-filter-config.interface';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormatSelectOptionsPipe } from '@public/shared/components/filters/components/categories-filter/pipes/format-select-options.pipe';
import { CommonModule } from '@angular/common';
import { AbstractFilterModule } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.module';
import { GridSelectFormModule } from '@shared/form/components/grid-select/grid-select-form.module';
import { AbstractSelectFilterModule } from '@public/shared/components/filters/components/abstract-select-filter/abstract-select-filter.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { By } from '@angular/platform-browser';
import { CategoriesFilterOption } from '@public/shared/components/filters/components/categories-filter/interfaces/categories-filter-option.interface';
import { CATEGORY_OPTIONS } from './data/category_options';
import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';
import { FilterTemplateComponent } from '@public/shared/components/filters/components/abstract-filter/filter-template/filter-template.component';
import { DrawerPlaceholderTemplateComponent } from '@public/shared/components/filters/components/abstract-select-filter/select-filter-template/drawer-placeholder-template.component';
import { GridSelectFormComponent } from '@shared/form/components/grid-select/grid-select-form.component';
import { SelectFormComponent } from '@shared/form/components/select/select-form.component';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { IsBubblePipe } from '../abstract-filter/pipes/is-bubble.pipe';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MOCK_CATEGORIES_RESPONSE } from './categories-filter.fixtures.spec';

@Component({
  selector: 'tsl-test-component',
  template: ` <tsl-categories-filter [config]="config" [value]="value" [variant]="variant"></tsl-categories-filter> `,
})
class TestComponent {
  @Input() variant: FILTER_VARIANT = FILTER_VARIANT.BUBBLE;
  @Input() config: CategoriesFilterConfig;
  @Input() value: FilterParameter[] = [];
}

describe('CategoriesFilterComponent', () => {
  let component: CategoriesFilterComponent;
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;
  let http: HttpClient;

  const filterTemplatePredicate = By.directive(FilterTemplateComponent);
  const placeholderTemplatePredicate = By.directive(DrawerPlaceholderTemplateComponent);
  const gridFormPredicate = By.directive(GridSelectFormComponent);
  const listFormPredicate = By.directive(SelectFormComponent);
  const config: CategoriesFilterConfig = {
    id: COMMON_CONFIGURATION_ID.CATEGORIES,
    title: 'Category',
    icon: '/assets/icons/joke.svg',
    bubblePlaceholder: 'All categories',
    drawerPlaceholder: 'All categories',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.categoryId,
    },
    type: FILTER_TYPES.CATEGORIES,
    options: CATEGORY_OPTIONS,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CommonModule,
        AbstractFilterModule,
        GridSelectFormModule,
        AbstractSelectFilterModule,
        ReactiveFormsModule,
        SelectFormModule,
      ],
      declarations: [TestComponent, CategoriesFilterComponent, FormatSelectOptionsPipe, IsBubblePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component = debugElement.query(By.directive(CategoriesFilterComponent)).componentInstance;
    http = TestBed.inject(HttpClient);
    spyOn(http, 'get').and.returnValue(of(MOCK_CATEGORIES_RESPONSE));

    testComponent.config = config;
  });

  it('should create', () => {
    expect(testComponent).toBeTruthy();
  });

  describe('when is bubble variant', () => {
    describe('on initialization', () => {
      describe('without parent value', () => {
        beforeEach(() => {
          fixture.detectChanges();
        });
        it('should have all categories value', () => {
          const value = component.formGroup.controls.select.value;

          expect(value).toEqual([]);
        });

        it('should render all categories label', () => {
          const label = debugElement.query(filterTemplatePredicate).componentInstance.label;

          expect(label).toEqual(getOptionLabelByValue(''));
        });
      });

      describe('with parent value', () => {
        beforeEach(() => {
          testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: CATEGORY_IDS.CAR.toString() }];
        });

        it('should not emit value change', () => {
          spyOn(component.valueChange, 'emit');
          fixture.detectChanges();

          expect(component.valueChange.emit).not.toHaveBeenCalled();
        });

        it('should have cars value', () => {
          fixture.detectChanges();
          const value = component.formGroup.controls.select.value;

          expect(value).toEqual([CATEGORY_IDS.CAR.toString()]);
        });

        it('should render cars label', () => {
          fixture.detectChanges();
          const label = debugElement.query(filterTemplatePredicate).componentInstance.label;

          expect(label).toEqual(getOptionLabelByValue(CATEGORY_IDS.CAR.toString()));
        });
      });
    });

    describe('on parent value change', () => {
      beforeEach(() => {
        testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: CATEGORY_IDS.CAR.toString() }];
        fixture.detectChanges();
      });

      it('should not emit value change', () => {
        spyOn(component.valueChange, 'emit');
        testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: CATEGORY_IDS.REAL_ESTATE.toString() }];
        fixture.detectChanges();

        expect(component.valueChange.emit).not.toHaveBeenCalled();
      });

      describe('when value has content', () => {
        it('should change its value', () => {
          const previousValue = component.formGroup.controls.select.value;
          expect(previousValue).toEqual([CATEGORY_IDS.CAR.toString()]);

          testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: CATEGORY_IDS.REAL_ESTATE.toString() }];
          fixture.detectChanges();

          const nextValue = component.formGroup.controls.select.value;
          expect(nextValue).toEqual([CATEGORY_IDS.REAL_ESTATE.toString()]);
        });

        it('should change label', () => {
          const previousLabel = debugElement.query(filterTemplatePredicate).componentInstance.label;
          expect(previousLabel).toEqual(getOptionLabelByValue(CATEGORY_IDS.CAR.toString()));

          testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: CATEGORY_IDS.REAL_ESTATE.toString() }];
          fixture.detectChanges();

          const nextLabel = debugElement.query(filterTemplatePredicate).componentInstance.label;
          expect(nextLabel).toEqual(getOptionLabelByValue(CATEGORY_IDS.REAL_ESTATE.toString()));
        });
      });

      describe('when value is empty', () => {
        it('should change its value', () => {
          const previousValue = component.formGroup.controls.select.value;
          expect(previousValue).toEqual([CATEGORY_IDS.CAR.toString()]);

          testComponent.value = [];
          fixture.detectChanges();

          const nextValue = component.formGroup.controls.select.value;
          expect(nextValue).toEqual([]);
        });

        it('should change label', () => {
          const previousLabel = debugElement.query(filterTemplatePredicate).componentInstance.label;
          expect(previousLabel).toEqual(getOptionLabelByValue(CATEGORY_IDS.CAR.toString()));

          testComponent.value = [];
          fixture.detectChanges();

          const nextLabel = debugElement.query(filterTemplatePredicate).componentInstance.label;
          expect(nextLabel).toEqual(getOptionLabelByValue(''));
        });
      });
    });

    describe('on form value change', () => {
      beforeEach(() => {
        testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: CATEGORY_IDS.CAR.toString() }];
        fixture.detectChanges();
        component.filterTemplate.toggleDropdown();
        fixture.detectChanges();
      });
      it('should emit value change', () => {
        spyOn(component.valueChange, 'emit');
        const gridForm: GridSelectFormComponent = debugElement.query(gridFormPredicate).componentInstance;
        gridForm.handleOptionClick(CATEGORY_IDS.REAL_ESTATE.toString());
        fixture.detectChanges();

        expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
        expect(component.valueChange.emit).toHaveBeenCalledWith([
          { key: FILTER_QUERY_PARAM_KEY.categoryId, value: CATEGORY_IDS.REAL_ESTATE.toString() },
        ]);
      });

      it('should change its value', () => {
        const gridForm: GridSelectFormComponent = debugElement.query(gridFormPredicate).componentInstance;
        gridForm.handleOptionClick(CATEGORY_IDS.REAL_ESTATE.toString());
        fixture.detectChanges();

        const value = component.formGroup.controls.select.value;

        expect(value).toEqual([CATEGORY_IDS.REAL_ESTATE.toString()]);
      });

      it('should change its label', () => {
        const gridForm: GridSelectFormComponent = debugElement.query(gridFormPredicate).componentInstance;
        gridForm.handleOptionClick(CATEGORY_IDS.REAL_ESTATE.toString());
        fixture.detectChanges();

        const label = debugElement.query(filterTemplatePredicate).componentInstance.label;
        fixture.detectChanges();

        expect(label).toEqual(getOptionLabelByValue(CATEGORY_IDS.REAL_ESTATE.toString()));
      });

      it('should close bubble', () => {
        const gridForm: SelectFormComponent = debugElement.query(gridFormPredicate).componentInstance;
        gridForm.handleOptionClick(CATEGORY_IDS.REAL_ESTATE.toString());
        fixture.detectChanges();

        const placeholderTemplate: FilterTemplateComponent = debugElement.query(filterTemplatePredicate).componentInstance;
        expect(placeholderTemplate.isDropdownOpen).toBeFalsy();
      });
    });
  });

  describe('when is content variant', () => {
    beforeEach(() => {
      testComponent.variant = FILTER_VARIANT.CONTENT;
    });
    describe('on initialization', () => {
      describe('without parent value', () => {
        beforeEach(() => {
          fixture.detectChanges();
        });
        it('should have all categories value', () => {
          const value = component.formGroup.controls.select.value;

          expect(value).toEqual([]);
        });

        it('should have all categories label', () => {
          const label = debugElement.query(placeholderTemplatePredicate).componentInstance.placeholderLabel;

          expect(label).toEqual(getOptionLabelByValue(''));
        });
      });

      describe('with parent value', () => {
        beforeEach(() => {
          testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: CATEGORY_IDS.CAR.toString() }];
        });
        it('should not emit value change', () => {
          spyOn(component.valueChange, 'emit');
          fixture.detectChanges();

          expect(component.valueChange.emit).not.toHaveBeenCalled();
        });

        it('should change its value', () => {
          fixture.detectChanges();
          const value = component.formGroup.controls.select.value;

          expect(value).toEqual(CATEGORY_IDS.CAR.toString());
        });

        it('should change label', () => {
          fixture.detectChanges();
          const label = debugElement.query(placeholderTemplatePredicate).componentInstance.placeholderLabel;

          expect(label).toEqual(getOptionLabelByValue(CATEGORY_IDS.CAR.toString()));
        });
      });
    });

    describe('on parent value change', () => {
      beforeEach(() => {
        testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: CATEGORY_IDS.CAR.toString() }];
        fixture.detectChanges();
      });

      it('should not emit value change', () => {
        spyOn(component.valueChange, 'emit');
        testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: CATEGORY_IDS.REAL_ESTATE.toString() }];
        fixture.detectChanges();

        expect(component.valueChange.emit).not.toHaveBeenCalled();
      });

      it('should change its value', () => {
        const previousValue = component.formGroup.controls.select.value;
        expect(previousValue).toEqual(CATEGORY_IDS.CAR.toString());

        testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: CATEGORY_IDS.REAL_ESTATE.toString() }];
        fixture.detectChanges();

        const nextValue = component.formGroup.controls.select.value;
        expect(nextValue).toEqual(CATEGORY_IDS.REAL_ESTATE.toString());
      });

      it('should change label', () => {
        const previousLabel = debugElement.query(placeholderTemplatePredicate).componentInstance.placeholderLabel;
        expect(previousLabel).toEqual(getOptionLabelByValue(CATEGORY_IDS.CAR.toString()));

        testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: CATEGORY_IDS.REAL_ESTATE.toString() }];
        fixture.detectChanges();

        const nextLabel = debugElement.query(placeholderTemplatePredicate).componentInstance.placeholderLabel;
        expect(nextLabel).toEqual(getOptionLabelByValue(CATEGORY_IDS.REAL_ESTATE.toString()));
      });
    });

    describe('on form value change', () => {
      beforeEach(() => {
        fixture.detectChanges();
        const placeholderTemplate: DrawerPlaceholderTemplateComponent = debugElement.query(placeholderTemplatePredicate).componentInstance;
        placeholderTemplate.togglePlaceholderOpen();
        fixture.detectChanges();
      });
      it('should emit value change', () => {
        spyOn(component.valueChange, 'emit');
        const gridForm: SelectFormComponent = debugElement.query(listFormPredicate).componentInstance;
        gridForm.handleOptionClick(CATEGORY_IDS.REAL_ESTATE.toString());
        fixture.detectChanges();

        expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
        expect(component.valueChange.emit).toHaveBeenCalledWith([
          { key: FILTER_QUERY_PARAM_KEY.categoryId, value: CATEGORY_IDS.REAL_ESTATE.toString() },
        ]);
      });

      it('should change its value', () => {
        const gridForm: SelectFormComponent = debugElement.query(listFormPredicate).componentInstance;
        gridForm.handleOptionClick(CATEGORY_IDS.REAL_ESTATE.toString());
        fixture.detectChanges();

        const value = component.formGroup.controls.select.value;

        expect(value).toEqual(CATEGORY_IDS.REAL_ESTATE.toString());
      });

      it('should change label', () => {
        const gridForm: SelectFormComponent = debugElement.query(listFormPredicate).componentInstance;
        gridForm.handleOptionClick(CATEGORY_IDS.REAL_ESTATE.toString());
        fixture.detectChanges();

        const label = debugElement.query(placeholderTemplatePredicate).componentInstance.placeholderLabel;
        fixture.detectChanges();

        expect(label).toEqual(getOptionLabelByValue(CATEGORY_IDS.REAL_ESTATE.toString()));
      });

      it('should close placeholder', () => {
        const gridForm: SelectFormComponent = debugElement.query(listFormPredicate).componentInstance;
        gridForm.handleOptionClick(CATEGORY_IDS.REAL_ESTATE.toString());
        fixture.detectChanges();

        const placeholderTemplate: DrawerPlaceholderTemplateComponent = debugElement.query(placeholderTemplatePredicate).componentInstance;
        expect(placeholderTemplate.isPlaceholderOpen).toBeFalsy();
      });
    });
  });

  function getOptionLabelByValue(value: string): string {
    return getOptionByValue(value).label;
  }

  function getOptionByValue(value: string): CategoriesFilterOption {
    return config.options.find((option) => option.value === value);
  }
});
