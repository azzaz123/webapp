import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SuggesterFilterComponent } from './suggester-filter.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { AbstractSelectFilterModule } from '../abstract-select-filter/abstract-select-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';
import { FASHION_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/fashion-configuration-ids.enum';
import { SuggesterFilterConfig } from './interfaces/suggester-filter-config.interface';
import { Component, DebugElement, Input } from '@angular/core';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { By } from '@angular/platform-browser';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { CAR_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/car-configuration-ids.enum';
import { FilterTemplateComponent } from '../abstract-filter/filter-template/filter-template.component';
import { SelectParentOptionComponent } from '../abstract-select-filter/select-parent-option/select-parent-option.component';
import { SelectFormComponent } from '@shared/form/components/select/select-form.component';
import { DrawerPlaceholderTemplateComponent } from '../abstract-select-filter/select-filter-template/drawer-placeholder-template.component';
import { BubbleComponent } from '../../../bubble/bubble.component';
import { IsBubblePipe } from '../abstract-filter/pipes/is-bubble.pipe';
import { of } from 'rxjs/internal/observable/of';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { MockFilterOptionService } from '@fixtures/filter-option-service.fixtures.spec';

@Component({
  selector: 'tsl-test-wrapper',
  template: ` <tsl-suggester-filter [config]="config" [variant]="variant" [value]="value"></tsl-suggester-filter> `,
})
class TestWrapperComponent {
  @Input() config: SuggesterFilterConfig;
  @Input() variant: FILTER_VARIANT;
  @Input() value: FilterParameter[] = [];
}

describe('SuggesterFilterComponent', () => {
  let testComponent: TestWrapperComponent;
  let debugElement: DebugElement;
  let component: SuggesterFilterComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;
  let optionService: FilterOptionService;

  const filterPredicate = By.directive(FilterTemplateComponent);
  const selectFilterTemplate = By.directive(DrawerPlaceholderTemplateComponent);
  const placeholderPredicate = By.directive(SelectParentOptionComponent);
  const selectFormPredicate = By.directive(SelectFormComponent);

  const basicConfig: SuggesterFilterConfig = {
    type: FILTER_TYPES.SUGGESTER,
    hasContentPlaceholder: true,
    bubblePlaceholder: 'Bubble placeholder',
    drawerPlaceholder: 'Drawer placeholder',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.brand,
    },
    title: 'My select',
    id: FASHION_CONFIGURATION_ID.BRAND,
    isClearable: true,
    hasOptionsOnInit: false,
    suggesterPlaceholder: 'Search for stuff',
    isLabelInValue: true,
  };

  const optionsOnInitConfig: SuggesterFilterConfig = {
    ...basicConfig,
    hasOptionsOnInit: true,
  };

  const complexValueConfig: SuggesterFilterConfig = {
    ...basicConfig,
    id: CAR_CONFIGURATION_ID.BRAND_N_MODEL,
    mapKey: {
      brand: FILTER_QUERY_PARAM_KEY.brand,
      model: FILTER_QUERY_PARAM_KEY.model,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestWrapperComponent, SuggesterFilterComponent, IsBubblePipe],
      providers: [
        {
          provide: FilterOptionService,
          useClass: MockFilterOptionService,
        },
      ],
      imports: [
        HttpClientTestingModule,
        NgbDropdownModule,
        AbstractFilterModule,
        AbstractSelectFilterModule,
        FormsModule,
        ReactiveFormsModule,
        SelectFormModule,
        SvgIconModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    optionService = TestBed.inject(FilterOptionService);
    debugElement = fixture.debugElement;
    testComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(SuggesterFilterComponent)).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when initialised', () => {
    describe('and filter variant is bubble', () => {
      beforeEach(() => {
        testComponent.variant = FILTER_VARIANT.BUBBLE;
        testComponent.config = basicConfig;
        fixture.detectChanges();
      });
      it('should have bubble placeholder as label', () => {
        const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;

        expect(filterTemplate.label).toEqual(basicConfig.bubblePlaceholder);
      });
    });

    describe('and filter variant is content', () => {
      beforeEach(() => {
        testComponent.variant = FILTER_VARIANT.CONTENT;
        testComponent.config = basicConfig;
        fixture.detectChanges();
      });
      it('should have drawer placeholder as label', () => {
        const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;

        expect(filterTemplate.label).toEqual(basicConfig.drawerPlaceholder);
      });
    });

    describe('and has value from parent', () => {
      const parentValue = [{ key: FILTER_QUERY_PARAM_KEY.brand, value: 'value' }];
      beforeEach(() => {
        testComponent.config = basicConfig;
        testComponent.value = parentValue;
        fixture.detectChanges();
      });

      it('should update value', () => {
        expect(component.value).toEqual(parentValue);
      });

      it('should update form', () => {
        expect(component.formGroup.getRawValue()).toEqual({ select: 'value' });
      });

      it('should update label', () => {
        expect(debugElement.query(filterPredicate).componentInstance.label).toEqual('value');
      });
    });
  });

  describe('when search input', () => {
    const clearPredicate = By.css('.SuggesterFilter__clear');
    beforeEach(() => {
      testComponent.config = basicConfig;
      testComponent.variant = FILTER_VARIANT.CONTENT;
      fixture.detectChanges();
      component.selectFilterTemplate.togglePlaceholderOpen();
      fixture.detectChanges();
    });
    describe('... has no value', () => {
      it('should not show hide icon', () => {
        const clear = debugElement.query(clearPredicate);

        expect(clear).toBeFalsy();
      });
    });
    describe('... has value', () => {
      beforeEach(async () => {
        const input: HTMLInputElement = debugElement.query(By.css('.SuggesterFilter__search_box_input')).nativeElement;

        input.value = 'my search';
        input.dispatchEvent(new Event('input'));
        await fixture.whenStable();
        fixture.detectChanges();
      });
      it('should show clear icon', () => {
        const clear = debugElement.query(clearPredicate);

        expect(clear).toBeTruthy();
      });

      describe('and clear icon is clicked', () => {
        it('should clear input', async () => {
          const clear: HTMLElement = debugElement.query(clearPredicate).nativeElement;

          clear.click();
          await fixture.whenStable();
          fixture.detectChanges();

          const clearDebugElement = debugElement.query(clearPredicate);

          expect(clearDebugElement).toBeFalsy();
          expect(component.searchQuery).toEqual('');
        });
      });
    });

    describe('... changes', () => {
      it('should ask for new options', fakeAsync(() => {
        spyOn(optionService, 'getOptions').and.returnValue(of([]));
        const input: HTMLInputElement = debugElement.query(By.css('.SuggesterFilter__search_box_input')).nativeElement;

        input.value = 'my search';
        input.dispatchEvent(new Event('input'));
        tick(1000);
        fixture.detectChanges();

        expect(optionService.getOptions).toHaveBeenCalledTimes(1);
        expect(optionService.getOptions).toHaveBeenCalledWith(basicConfig.id, { text: 'my search' });
      }));
    });
  });

  describe('when value changes from parent', () => {
    describe('and is simple value', () => {
      beforeEach(() => {
        testComponent.config = basicConfig;
        fixture.detectChanges();
      });

      it('should update value', () => {
        const newValue = [{ key: FILTER_QUERY_PARAM_KEY.brand, value: 'value' }];
        expect(component.value).toEqual([]);

        testComponent.value = newValue;
        fixture.detectChanges();

        expect(component.value).toEqual(newValue);
      });

      it('should update form', () => {
        const newValue = [{ key: FILTER_QUERY_PARAM_KEY.brand, value: 'value' }];
        spyOn(component.formGroup.controls.select, 'setValue');

        testComponent.value = newValue;
        fixture.detectChanges();

        expect(component.formGroup.controls.select.setValue).toHaveBeenCalledTimes(1);
        expect(component.formGroup.controls.select.setValue).toHaveBeenCalledWith('value', { emitEvent: false });
      });

      it('should update label', () => {
        testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.brand, value: 'value' }];
        fixture.detectChanges();

        expect(debugElement.query(filterPredicate).componentInstance.label).toEqual('value');
      });
    });

    describe('and the value contains a pipe', () => {
      it('should update the label removing the pipe', () => {
        const MOCK_BRAND_MODEL = 'Apple|iPhone 12 Pro';
        const expectedValue = MOCK_BRAND_MODEL.replace(/\|/g, ', ');
        testComponent.config = {
          ...basicConfig,
          mapKey: {
            parameterKey: FILTER_QUERY_PARAM_KEY.brandModel,
          },
        };
        testComponent.value = [
          {
            key: FILTER_QUERY_PARAM_KEY.brandModel,
            value: 'Apple|iPhone 12 Pro',
          },
        ];
        fixture.detectChanges();

        expect(debugElement.query(filterPredicate).componentInstance.label).toEqual(expectedValue);
      });
    });

    describe('and is complex value', () => {
      const complexFilterValue = [
        { key: FILTER_QUERY_PARAM_KEY.brand, value: 'Audi' },
        { key: FILTER_QUERY_PARAM_KEY.model, value: 'A4' },
      ];
      const complexOptionValue = {
        brand: 'Audi',
        model: 'A4',
      };
      describe('and component had no value', () => {
        beforeEach(() => {
          testComponent.config = complexValueConfig;
          fixture.detectChanges();
        });
        it('should update value', () => {
          expect(component.value).toEqual([]);

          testComponent.value = complexFilterValue;
          fixture.detectChanges();

          expect(component.value).toEqual(complexFilterValue);
        });

        it('should update form', () => {
          spyOn(component.formGroup.controls.select, 'setValue');

          testComponent.value = complexFilterValue;
          fixture.detectChanges();

          expect(component.formGroup.controls.select.setValue).toHaveBeenCalledTimes(1);
          expect(component.formGroup.controls.select.setValue).toHaveBeenCalledWith(complexOptionValue, { emitEvent: false });
        });

        it('should update label', () => {
          testComponent.value = complexFilterValue;
          fixture.detectChanges();

          expect(debugElement.query(filterPredicate).componentInstance.label).toEqual('Audi, A4');
        });
      });

      describe('and component had same value', () => {
        const previousValue = [
          { key: FILTER_QUERY_PARAM_KEY.brand, value: 'Audi' },
          { key: FILTER_QUERY_PARAM_KEY.model, value: 'A4' },
        ];
        beforeEach(() => {
          testComponent.config = complexValueConfig;
          testComponent.value = previousValue;
          fixture.detectChanges();
        });

        it('should keep value', () => {
          expect(component.value).toEqual(previousValue);

          testComponent.value = complexFilterValue;
          fixture.detectChanges();

          expect(component.value).toEqual(previousValue);
        });

        it('should not update form', () => {
          spyOn(component.formGroup.controls.select, 'setValue');

          testComponent.value = complexFilterValue;
          fixture.detectChanges();

          expect(component.formGroup.controls.select.setValue).not.toHaveBeenCalled();
        });

        it('should keep label', () => {
          testComponent.value = complexFilterValue;
          fixture.detectChanges();

          expect(debugElement.query(filterPredicate).componentInstance.label).toEqual('Audi, A4');
        });
      });

      describe('and component had different value', () => {
        const previousValue = [
          { key: FILTER_QUERY_PARAM_KEY.brand, value: 'Mercedes' },
          { key: FILTER_QUERY_PARAM_KEY.model, value: 'Coupe' },
        ];
        beforeEach(() => {
          testComponent.config = complexValueConfig;
          testComponent.value = previousValue;
          fixture.detectChanges();
        });
        it('should update value', () => {
          expect(component.value).toEqual(previousValue);

          testComponent.value = complexFilterValue;
          fixture.detectChanges();

          expect(component.value).toEqual(complexFilterValue);
        });

        it('should update form', () => {
          spyOn(component.formGroup.controls.select, 'setValue');

          testComponent.value = complexFilterValue;
          fixture.detectChanges();

          expect(component.formGroup.controls.select.setValue).toHaveBeenCalledTimes(1);
          expect(component.formGroup.controls.select.setValue).toHaveBeenCalledWith(complexOptionValue, { emitEvent: false });
        });

        it('should update label', () => {
          testComponent.value = complexFilterValue;
          fixture.detectChanges();

          expect(debugElement.query(filterPredicate).componentInstance.label).toEqual('Audi, A4');
        });
      });
    });

    describe('and is empty value', () => {
      const initialValue = [{ key: FILTER_QUERY_PARAM_KEY.brand, value: 'value' }];
      beforeEach(() => {
        testComponent.config = basicConfig;
        testComponent.value = initialValue;
        fixture.detectChanges();
      });

      it('should update value', () => {
        expect(component.value).toEqual(initialValue);

        testComponent.value = [];
        fixture.detectChanges();

        expect(component.value).toEqual([]);
      });

      it('should update form', () => {
        spyOn(component.formGroup.controls.select, 'setValue');

        testComponent.value = [];
        fixture.detectChanges();

        expect(component.formGroup.controls.select.setValue).toHaveBeenCalledTimes(1);
        expect(component.formGroup.controls.select.setValue).toHaveBeenCalledWith(undefined, { emitEvent: false });
      });

      it('should update label', () => {
        testComponent.value = [];
        fixture.detectChanges();

        expect(debugElement.query(filterPredicate).componentInstance.label).toEqual(basicConfig.drawerPlaceholder);
      });
    });
  });

  describe('when options', () => {
    describe('are configured to load on init', () => {
      beforeEach(() => {
        testComponent.config = optionsOnInitConfig;
      });
      it('should call for options on init', () => {
        spyOn(optionService, 'getOptions').and.returnValue(of([]));

        fixture.detectChanges();

        expect(optionService.getOptions).toHaveBeenCalledTimes(1);
        expect(optionService.getOptions).toHaveBeenCalledWith(FASHION_CONFIGURATION_ID.BRAND, undefined);
      });
    });

    describe('are configured to wait for input', () => {
      beforeEach(() => {
        testComponent.config = basicConfig;
      });
      it('should not call for options on init', () => {
        spyOn(optionService, 'getOptions');

        fixture.detectChanges();

        expect(optionService.getOptions).not.toHaveBeenCalled();
      });
    });
  });

  describe('when bubble', () => {
    beforeEach(() => {
      testComponent.variant = FILTER_VARIANT.BUBBLE;
      testComponent.config = optionsOnInitConfig;
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

          form.handleOptionClick('default_1');

          fixture.detectChanges();

          expect(filterTemplate.toggleDropdown).toHaveBeenCalledTimes(1);
        });

        it('should emit changes', () => {
          spyOn(component.valueChange, 'emit');
          const form: SelectFormComponent = debugElement.query(selectFormPredicate).componentInstance;

          form.handleOptionClick('default_1');
          fixture.detectChanges();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith([
            {
              key: FILTER_QUERY_PARAM_KEY.brand,
              value: 'default_1',
            },
          ]);
        });

        it('should change label', () => {
          const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;
          const form: SelectFormComponent = debugElement.query(selectFormPredicate).componentInstance;

          form.handleOptionClick('default_1');

          fixture.detectChanges();

          expect(component.value).toEqual([
            {
              key: FILTER_QUERY_PARAM_KEY.brand,
              value: 'default_1',
            },
          ]);
          expect(filterTemplate.label).toEqual('default_1');
        });
      });
    });
    describe('... is closed', () => {
      describe('and we clean the value', () => {
        beforeEach(() => {
          testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.brand, value: 'default_1' }];
          fixture.detectChanges();
        });

        it('should restart values', () => {
          const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;
          expect(component.value).toEqual([{ key: FILTER_QUERY_PARAM_KEY.brand, value: 'default_1' }]);

          filterTemplate.clear.emit();

          expect(component.value).toEqual([]);
        });

        it('should restart label', () => {
          const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;
          expect(filterTemplate.label).toEqual('default_1');

          filterTemplate.clear.emit();
          fixture.detectChanges();

          expect(filterTemplate.label).toEqual(basicConfig.bubblePlaceholder);
        });

        it('should emit value changes', () => {
          spyOn(component.valueChange, 'emit');
          const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;

          filterTemplate.clear.emit();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith([{ key: FILTER_QUERY_PARAM_KEY.brand, value: undefined }]);
        });
      });
    });
  });

  describe('when placeholder', () => {
    beforeEach(() => {
      testComponent.variant = FILTER_VARIANT.CONTENT;
      testComponent.config = optionsOnInitConfig;
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

          formInstance.handleOptionClick('default_1');
          fixture.detectChanges();

          const formDebugElement = debugElement.query(selectFormPredicate);
          const parent = debugElement.query(placeholderPredicate);

          expect(formDebugElement).toBeFalsy();
          expect(parent).toBeTruthy();
        });

        it('should emit changes', () => {
          spyOn(component.valueChange, 'emit');
          const form: SelectFormComponent = debugElement.query(selectFormPredicate).componentInstance;

          form.handleOptionClick('default_1');
          fixture.detectChanges();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith([
            {
              key: FILTER_QUERY_PARAM_KEY.brand,
              value: 'default_1',
            },
          ]);
        });

        it('should change label', () => {
          const formInstance: SelectFormComponent = debugElement.query(selectFormPredicate).componentInstance;

          formInstance.handleOptionClick('default_1');
          fixture.detectChanges();

          const selectTemplate: DrawerPlaceholderTemplateComponent = debugElement.query(By.directive(DrawerPlaceholderTemplateComponent))
            .componentInstance;

          expect(component.value).toEqual([
            {
              key: FILTER_QUERY_PARAM_KEY.brand,
              value: 'default_1',
            },
          ]);
          expect(selectTemplate.placeholderLabel).toEqual('default_1');
        });
      });

      describe('and we clean the value', () => {
        beforeEach(() => {
          testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.brand, value: 'default_1' }];
          fixture.detectChanges();
        });
        it('should restart values', () => {
          const selectTemplate: DrawerPlaceholderTemplateComponent = debugElement.query(selectFilterTemplate).componentInstance;
          expect(component.value).toEqual([{ key: FILTER_QUERY_PARAM_KEY.brand, value: 'default_1' }]);

          selectTemplate.clear.emit();

          expect(component.value).toEqual([]);
        });

        it('should restart label', () => {
          const selectTemplate: DrawerPlaceholderTemplateComponent = debugElement.query(selectFilterTemplate).componentInstance;
          expect(selectTemplate.placeholderLabel).toEqual('default_1');

          selectTemplate.clear.emit();
          fixture.detectChanges();

          expect(selectTemplate.placeholderLabel).toEqual(basicConfig.drawerPlaceholder);
        });

        it('should emit value changes', () => {
          spyOn(component.valueChange, 'emit');
          const selectTemplate: DrawerPlaceholderTemplateComponent = debugElement.query(selectFilterTemplate).componentInstance;

          selectTemplate.clear.emit();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith([{ key: FILTER_QUERY_PARAM_KEY.brand, value: undefined }]);
        });
      });
    });
  });
});
