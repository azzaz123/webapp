import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SuggesterFilterComponent } from './suggester-filter.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AbstractFilterModule } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.module';
import { FilterOptionServiceModule } from '@public/shared/services/filter-option/filter-option-service.module';
import { AbstractSelectFilterModule } from '@public/shared/components/filters/components/abstract-select-filter/abstract-select-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';
import { FASHION_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/fashion-configuration-ids.enum';
import { SuggesterFilterConfig } from '@public/shared/components/filters/components/suggester-filter/interfaces/suggester-filter-config.interface';
import { Component, DebugElement, Input } from '@angular/core';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { By } from '@angular/platform-browser';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { CAR_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/car-configuration-ids';
import { FilterTemplateComponent } from '@public/shared/components/filters/components/abstract-filter/filter-template/filter-template.component';
import { SelectParentOptionComponent } from '@public/shared/components/filters/components/abstract-select-filter/select-parent-option/select-parent-option.component';
import { SelectFormComponent } from '@shared/form/components/select/select-form.component';
import { SelectFilterTemplateComponent } from '@public/shared/components/filters/components/abstract-select-filter/select-filter-template/select-filter-template.component';
import { BubbleComponent } from '@public/shared/components/bubble/bubble.component';
import spyOn = jest.spyOn;

@Component({
  selector: 'tsl-test-wrapper',
  template: ` <tsl-suggester-filter [config]="config" [variant]="variant" [value]="value"></tsl-suggester-filter> `,
})
class TestWrapperComponent {
  @Input() config: SuggesterFilterConfig;
  @Input() variant: FILTER_VARIANT;
  @Input() value: FilterParameter[];
}

describe('SuggesterFilterComponent', () => {
  let testComponent: TestWrapperComponent;
  let debugElement: DebugElement;
  let component: SuggesterFilterComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;
  let optionService: FilterOptionService;

  const filterPredicate = By.directive(FilterTemplateComponent);
  const selectFilterTemplate = By.directive(SelectFilterTemplateComponent);
  const placeholderPredicate = By.directive(SelectParentOptionComponent);
  const selectFormPredicate = By.directive(SelectFormComponent);

  const basicConfig: SuggesterFilterConfig = {
    type: FILTER_TYPES.SUGGESTER,
    hasContentPlaceholder: true,
    bubblePlaceholder: 'Bubble placeholder',
    drawerPlaceholder: 'Drawer placeholder',
    mapKey: {
      parameterKey: 'key',
    },
    title: 'My select',
    id: FASHION_CONFIGURATION_ID.BRAND,
    isClearable: true,
    hasOptionsOnInit: false,
    suggesterPlaceholder: 'Search for stuff',
  };

  const optionsOnInitConfig: SuggesterFilterConfig = {
    ...basicConfig,
    hasOptionsOnInit: true,
  };

  const complexValueConfig: SuggesterFilterConfig = {
    ...basicConfig,
    id: CAR_CONFIGURATION_ID.BRAND_N_MODEL,
    mapKey: {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestWrapperComponent, SuggesterFilterComponent],
      imports: [
        HttpClientTestingModule,
        NgbDropdownModule,
        AbstractFilterModule,
        FilterOptionServiceModule,
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
      const parentValue = [{ key: 'key', value: 'value' }];
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
        spyOn(optionService, 'getOptions');
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
        const newValue = [{ key: 'key', value: 'value' }];
        expect(component.value).toEqual([]);

        testComponent.value = newValue;
        fixture.detectChanges();

        expect(component.value).toEqual(newValue);
      });

      it('should update form', () => {
        const newValue = [{ key: 'key', value: 'value' }];
        spyOn(component.formGroup.controls.select, 'setValue');

        testComponent.value = newValue;
        fixture.detectChanges();

        expect(component.formGroup.controls.select.setValue).toHaveBeenCalledWith('value');
      });

      it('should update label', () => {
        testComponent.value = [{ key: 'key', value: 'value' }];
        fixture.detectChanges();

        expect(debugElement.query(filterPredicate).componentInstance.label).toEqual('value');
      });
    });

    describe('and is complex value', () => {
      const complexFilterValue = [
        { key: 'brand', value: 'Audi' },
        { key: 'model', value: 'A4' },
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

          expect(component.formGroup.controls.select.setValue).toHaveBeenCalledWith(complexOptionValue);
        });

        it('should update label', () => {
          testComponent.value = complexFilterValue;
          fixture.detectChanges();

          expect(debugElement.query(filterPredicate).componentInstance.label).toEqual('Audi, A4');
        });
      });

      describe('and component had same value', () => {
        const previousValue = [
          { key: 'brand', value: 'Audi' },
          { key: 'model', value: 'A4' },
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
          { key: 'brand', value: 'Mercedes' },
          { key: 'model', value: 'Coupe' },
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

          expect(component.formGroup.controls.select.setValue).toHaveBeenCalledWith(complexOptionValue);
        });

        it('should update label', () => {
          testComponent.value = complexFilterValue;
          fixture.detectChanges();

          expect(debugElement.query(filterPredicate).componentInstance.label).toEqual('Audi, A4');
        });
      });
    });

    describe('and is empty value', () => {
      const initialValue = [{ key: 'key', value: 'value' }];
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
        spyOn(optionService, 'getOptions');

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

          form.writeValue('default_1');

          fixture.detectChanges();

          expect(filterTemplate.toggleDropdown).toHaveBeenCalledTimes(1);
        });

        it('should emit changes', () => {
          spyOn(component.valueChange, 'emit');
          const form: SelectFormComponent = debugElement.query(selectFormPredicate).componentInstance;

          form.writeValue('default_1');
          fixture.detectChanges();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith([
            {
              key: 'key',
              value: 'default_1',
            },
          ]);
        });

        it('should change label', () => {
          const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;
          const form: SelectFormComponent = debugElement.query(selectFormPredicate).componentInstance;

          form.writeValue('default_1');

          fixture.detectChanges();

          expect(component.value).toEqual([
            {
              key: 'key',
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
          component.writeValue([{ key: 'key', value: 'default_1' }]);
          fixture.detectChanges();
        });

        it('should restart values', () => {
          const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;
          expect(component.value).toEqual([{ key: 'key', value: 'default_1' }]);

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
          expect(component.valueChange.emit).toHaveBeenCalledWith([]);
        });

        it('should emit clear event', () => {
          spyOn(component.clear, 'emit');
          const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;

          filterTemplate.clear.emit();

          expect(component.clear.emit).toHaveBeenCalledTimes(1);
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

          formInstance.writeValue('default_1');
          fixture.detectChanges();

          const formDebugElement = debugElement.query(selectFormPredicate);
          const parent = debugElement.query(placeholderPredicate);

          expect(formDebugElement).toBeFalsy();
          expect(parent).toBeTruthy();
        });

        it('should emit changes', () => {
          spyOn(component.valueChange, 'emit');
          const form: SelectFormComponent = debugElement.query(selectFormPredicate).componentInstance;

          form.writeValue('default_1');
          fixture.detectChanges();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith([
            {
              key: 'key',
              value: 'default_1',
            },
          ]);
        });

        it('should change label', () => {
          const formInstance: SelectFormComponent = debugElement.query(selectFormPredicate).componentInstance;

          formInstance.writeValue('default_1');
          fixture.detectChanges();

          const selectTemplate: SelectFilterTemplateComponent = debugElement.query(By.directive(SelectFilterTemplateComponent))
            .componentInstance;

          expect(component.value).toEqual([
            {
              key: 'key',
              value: 'default_1',
            },
          ]);
          expect(selectTemplate.placeholderLabel).toEqual('default_1');
        });
      });

      describe('and we clean the value', () => {
        beforeEach(() => {
          component.writeValue([{ key: 'key', value: 'default_1' }]);
          fixture.detectChanges();
        });
        it('should restart values', () => {
          const selectTemplate: SelectFilterTemplateComponent = debugElement.query(selectFilterTemplate).componentInstance;
          expect(component.value).toEqual([{ key: 'key', value: 'default_1' }]);

          selectTemplate.clear.emit();

          expect(component.value).toEqual([]);
        });

        it('should restart label', () => {
          const selectTemplate: SelectFilterTemplateComponent = debugElement.query(selectFilterTemplate).componentInstance;
          expect(selectTemplate.placeholderLabel).toEqual('default_1');

          selectTemplate.clear.emit();
          fixture.detectChanges();

          expect(selectTemplate.placeholderLabel).toEqual(basicConfig.drawerPlaceholder);
        });

        it('should emit value changes', () => {
          spyOn(component.valueChange, 'emit');
          const selectTemplate: SelectFilterTemplateComponent = debugElement.query(selectFilterTemplate).componentInstance;

          selectTemplate.clear.emit();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith([]);
        });

        it('should emit clear event', () => {
          spyOn(component.clear, 'emit');
          const selectTemplate: SelectFilterTemplateComponent = debugElement.query(selectFilterTemplate).componentInstance;

          selectTemplate.clear.emit();

          expect(component.clear.emit).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
