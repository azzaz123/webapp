import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';

import { BubbleComponent } from '@public/shared/components/bubble/bubble.component';
import { MockFilterOptionService } from '@fixtures/filter-option-service.fixtures.spec';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { SelectFilterComponent } from './select-filter.component';
import { FILTER_TYPES } from '../../core/enums/filter-types/filter-types.enum';
import { FASHION_CONFIGURATION_ID } from '../../core/enums/configuration-ids/fashion-configuration-ids.enum';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { FilterOptionServiceModule } from '@public/shared/services/filter-option/filter-option-service.module';
import { AbstractSelectFilterModule } from '../abstract-select-filter/abstract-select-filter.module';
import { SelectFilterConfig } from './interfaces/select-filter-config.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { FilterTemplateComponent } from '../abstract-filter/filter-template/filter-template.component';
import { DrawerPlaceholderTemplateComponent } from '../abstract-select-filter/select-filter-template/drawer-placeholder-template.component';
import { SelectParentOptionComponent } from '../abstract-select-filter/select-parent-option/select-parent-option.component';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectFormComponent } from '@shared/form/components/select/select-form.component';
import { IsBubblePipe } from '../abstract-filter/pipes/is-bubble.pipe';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

@Component({
  selector: 'tsl-test-wrapper',
  template: ` <tsl-select-filter [config]="config" [variant]="variant" [value]="value"></tsl-select-filter> `,
})
class TestWrapperComponent {
  @Input() config: SelectFilterConfig;
  @Input() variant: FILTER_VARIANT = FILTER_VARIANT.BUBBLE;
  @Input() value: FilterParameter[] = [];
}

describe('SelectFilterComponent', () => {
  let testComponent: TestWrapperComponent;
  let component: SelectFilterComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<TestWrapperComponent>;

  const filterPredicate = By.directive(FilterTemplateComponent);
  const selectFilterTemplate = By.directive(DrawerPlaceholderTemplateComponent);
  const placeholderPredicate = By.directive(SelectParentOptionComponent);
  const selectFormPredicate = By.directive(SelectFormComponent);
  const basicConfig: SelectFilterConfig = {
    type: FILTER_TYPES.SELECT,
    hasContentPlaceholder: true,
    bubblePlaceholder: 'Bubble placeholder',
    drawerPlaceholder: 'Drawer placeholder',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.gender,
    },
    title: 'My select',
    id: FASHION_CONFIGURATION_ID.GENDER,
    isClearable: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: FilterOptionService,
          useClass: MockFilterOptionService,
        },
      ],
      declarations: [TestWrapperComponent, SelectFilterComponent, IsBubblePipe],
      imports: [
        HttpClientTestingModule,
        NgbDropdownModule,
        AbstractFilterModule,
        FilterOptionServiceModule,
        AbstractSelectFilterModule,
        FormsModule,
        ReactiveFormsModule,
        SelectFormModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    debugElement = fixture.debugElement;
    testComponent = fixture.componentInstance;
    testComponent.config = basicConfig;
    component = debugElement.query(By.directive(SelectFilterComponent)).componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('when the component inits', () => {
    it('should retrieve corresponding options from backend', (done) => {
      fixture.detectChanges();

      component.options$.subscribe((options) => {
        expect(options).toEqual([
          {
            value: 'male',
            label: 'Male',
          },
          {
            value: 'female',
            label: 'Female',
          },
        ]);

        done();
      });
    });

    describe('and is bubble variant', () => {
      beforeEach(() => {
        testComponent.variant = FILTER_VARIANT.BUBBLE;
        fixture.detectChanges();
      });
      it('should set label to bubble placeholder', () => {
        const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;

        expect(filterTemplate.label).toEqual(basicConfig.bubblePlaceholder);
      });
    });

    describe('and is content variant', () => {
      beforeEach(() => {
        testComponent.variant = FILTER_VARIANT.CONTENT;
        fixture.detectChanges();
      });

      it('should set label to drawer placeholder', () => {
        const selectTemplate: DrawerPlaceholderTemplateComponent = debugElement.query(selectFilterTemplate).componentInstance;

        expect(selectTemplate.placeholderLabel).toEqual(basicConfig.drawerPlaceholder);
      });

      it('should show option placeholder', () => {
        const parent = debugElement.query(placeholderPredicate);

        expect(parent).toBeTruthy();
      });
    });
  });

  describe('when bubble', () => {
    beforeEach(() => {
      testComponent.variant = FILTER_VARIANT.BUBBLE;
      fixture.detectChanges();
    });
    describe('... is open', () => {
      beforeEach(() => {
        debugElement.query(By.directive(BubbleComponent)).nativeElement.click();
        fixture.detectChanges();
      });
      describe('and value changes', () => {
        it('should close the bubble', () => {
          const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;
          spyOn(filterTemplate, 'toggleDropdown');

          const form: SelectFormComponent = debugElement.query(selectFormPredicate).componentInstance;

          form.handleOptionClick('male');

          fixture.detectChanges();

          expect(component.value).toEqual([
            {
              key: FILTER_QUERY_PARAM_KEY.gender,
              value: 'male',
            },
          ]);
          expect(filterTemplate.label).toEqual('Male');
          expect(filterTemplate.toggleDropdown).toHaveBeenCalledTimes(1);
        });

        it('should emit changes', () => {
          spyOn(component.valueChange, 'emit');
          const form: SelectFormComponent = debugElement.query(selectFormPredicate).componentInstance;

          form.handleOptionClick('male');
          fixture.detectChanges();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith([
            {
              key: FILTER_QUERY_PARAM_KEY.gender,
              value: 'male',
            },
          ]);
        });
      });
    });
    describe('... is closed', () => {
      describe('and we clean the value', () => {
        beforeEach(() => {
          testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.gender, value: 'male' }];
          fixture.detectChanges();
        });

        it('should restart values', () => {
          const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;
          expect(component.value).toEqual([{ key: FILTER_QUERY_PARAM_KEY.gender, value: 'male' }]);

          filterTemplate.clear.emit();

          expect(component.value).toEqual([]);
        });

        it('should restart label', () => {
          const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;
          expect(filterTemplate.label).toEqual('Male');

          filterTemplate.clear.emit();
          fixture.detectChanges();

          expect(filterTemplate.label).toEqual(basicConfig.bubblePlaceholder);
        });

        it('should emit value changes', () => {
          spyOn(component.valueChange, 'emit');
          const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;

          filterTemplate.clear.emit();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith([{ key: FILTER_QUERY_PARAM_KEY.gender, value: undefined }]);
        });
      });
    });
  });

  describe('when placeholder', () => {
    beforeEach(() => {
      testComponent.variant = FILTER_VARIANT.CONTENT;
      fixture.detectChanges();
    });

    describe('... is clicked', () => {
      it('should open the filters content', () => {
        const parentElement: HTMLElement = debugElement.query(placeholderPredicate).nativeElement;

        parentElement.click();
        fixture.detectChanges();

        const form = debugElement.query(selectFormPredicate);

        expect(form).toBeTruthy();
      });
    });

    describe('... is open', () => {
      beforeEach(() => {
        debugElement.query(By.directive(SelectParentOptionComponent)).nativeElement.click();
        fixture.detectChanges();
      });
      describe('and value changes', () => {
        it('should close the placeholder', () => {
          const formInstance: SelectFormComponent = debugElement.query(selectFormPredicate).componentInstance;

          formInstance.handleOptionClick('male');
          fixture.detectChanges();

          const selectTemplate: DrawerPlaceholderTemplateComponent = debugElement.query(By.directive(DrawerPlaceholderTemplateComponent))
            .componentInstance;
          const formDebugElement = debugElement.query(selectFormPredicate);
          const parent = debugElement.query(placeholderPredicate);

          expect(formDebugElement).toBeFalsy();
          expect(parent).toBeTruthy();
          expect(component.value).toEqual([
            {
              key: FILTER_QUERY_PARAM_KEY.gender,
              value: 'male',
            },
          ]);
          expect(selectTemplate.placeholderLabel).toEqual('Male');
        });

        it('should emit changes', () => {
          spyOn(component.valueChange, 'emit');
          const form: SelectFormComponent = debugElement.query(selectFormPredicate).componentInstance;

          form.handleOptionClick('male');
          fixture.detectChanges();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith([
            {
              key: FILTER_QUERY_PARAM_KEY.gender,
              value: 'male',
            },
          ]);
        });
      });

      describe('and we clean the value', () => {
        beforeEach(() => {
          testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.gender, value: 'male' }];
          fixture.detectChanges();
        });
        it('should restart values', () => {
          const selectTemplate: DrawerPlaceholderTemplateComponent = debugElement.query(selectFilterTemplate).componentInstance;
          expect(component.value).toEqual([{ key: FILTER_QUERY_PARAM_KEY.gender, value: 'male' }]);

          selectTemplate.clear.emit();

          expect(component.value).toEqual([]);
        });

        it('should restart label', () => {
          const selectTemplate: DrawerPlaceholderTemplateComponent = debugElement.query(selectFilterTemplate).componentInstance;
          expect(selectTemplate.placeholderLabel).toEqual('Male');

          selectTemplate.clear.emit();
          fixture.detectChanges();

          expect(selectTemplate.placeholderLabel).toEqual(basicConfig.drawerPlaceholder);
        });

        it('should emit value changes', () => {
          spyOn(component.valueChange, 'emit');
          const selectTemplate: DrawerPlaceholderTemplateComponent = debugElement.query(selectFilterTemplate).componentInstance;

          selectTemplate.clear.emit();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith([{ key: FILTER_QUERY_PARAM_KEY.gender, value: undefined }]);
        });
      });
    });
  });
});
