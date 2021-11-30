import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

import { BubbleComponent } from '@public/shared/components/bubble/bubble.component';
import { MockFilterOptionService } from '@fixtures/filter-option-service.fixtures.spec';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { MultiSelectFilterComponent } from './multi-select-filter.component';
import { FILTER_TYPES } from '../../core/enums/filter-types/filter-types.enum';
import { MultiSelectFilterConfig } from './interfaces/multi-select-filter-config.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { FilterTemplateComponent } from '../abstract-filter/filter-template/filter-template.component';
import { DrawerPlaceholderTemplateComponent } from '../abstract-select-filter/select-filter-template/drawer-placeholder-template.component';
import { SelectParentOptionComponent } from '../abstract-select-filter/select-parent-option/select-parent-option.component';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { MultiSelectFilterModule } from './multi-select-filter.module';
import { MultiSelectFormComponent } from '@shared/form/components/multi-select-form/multi-select-form.component';
import { FASHION_CONFIGURATION_ID } from '../../core/enums/configuration-ids/fashion-configuration-ids.enum';
import { SUBCATEGORIES_WITH_CHILDREN_MOCK } from '@fixtures/subcategories.fixtures';
import { MULTISELECT_FILTER_BUBBLE_VARIANT } from './enum/multi-select-filter-bubble-variant.enum';

@Component({
  selector: 'tsl-test-wrapper',
  template: ` <tsl-multi-select-filter [config]="config" [variant]="variant" [value]="value"></tsl-multi-select-filter> `,
})
class TestWrapperComponent {
  @Input() config: MultiSelectFilterConfig;
  @Input() variant: FILTER_VARIANT = FILTER_VARIANT.BUBBLE;
  @Input() value: FilterParameter[] = [];
}

describe('MultiSelectFilterComponent', () => {
  let testComponent: TestWrapperComponent;
  let component: MultiSelectFilterComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<TestWrapperComponent>;

  const filterPredicate = By.directive(FilterTemplateComponent);
  const drawerPlaceholderTemplatePredicate = By.directive(DrawerPlaceholderTemplateComponent);
  const placeholderPredicate = By.directive(SelectParentOptionComponent);
  const multiselectFormPredicate = By.directive(MultiSelectFormComponent);
  const basicConfig: MultiSelectFilterConfig = {
    type: FILTER_TYPES.MULTISELECT,
    id: FASHION_CONFIGURATION_ID.OBJECT_TYPE,
    title: 'MultiSelectFilterComponent',
    hasContentPlaceholder: true,
    bubblePlaceholder: 'Bubble placeholder',
    drawerPlaceholder: 'Drawer placeholder',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.objectType,
    },
    bubbleVariant: MULTISELECT_FILTER_BUBBLE_VARIANT.MULTIPLE,
  };
  const OPTIONS = SUBCATEGORIES_WITH_CHILDREN_MOCK;
  const selectedOption1 = OPTIONS[0];
  const selectedOption2 = OPTIONS[1].children[0];

  const setValue = (value) => {
    component.writeValue(value);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: FilterOptionService,
          useClass: MockFilterOptionService,
        },
      ],
      declarations: [TestWrapperComponent],
      imports: [HttpClientTestingModule, MultiSelectFilterModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    debugElement = fixture.debugElement;
    testComponent = fixture.componentInstance;
    testComponent.config = basicConfig;
    component = debugElement.query(By.directive(MultiSelectFilterComponent)).componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('when the component inits', () => {
    it('should retrieve corresponding options from backend', () => {
      fixture.detectChanges();
      expect(component.options).toEqual(OPTIONS);
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
        const drawerPlaceholderTemplate: DrawerPlaceholderTemplateComponent =
          debugElement.query(drawerPlaceholderTemplatePredicate).componentInstance;

        expect(drawerPlaceholderTemplate.placeholderLabel).toEqual(basicConfig.drawerPlaceholder);
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

      describe('and new known value is applied', () => {
        const value = [
          {
            key: FILTER_QUERY_PARAM_KEY.objectType,
            value: `${selectedOption1.value},${selectedOption2.value}`,
          },
        ];

        beforeEach(() => {
          spyOn(component.valueChange, 'emit');

          setValue(value);
          component.handleApply();
          fixture.detectChanges();
        });

        it('should emit changes', () => {
          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith(value);
        });

        it('should set label with correct values', () => {
          const filterTemplates: FilterTemplateComponent[] = debugElement
            .queryAll(filterPredicate)
            .map((filterTemplate) => filterTemplate.componentInstance);

          filterTemplates.forEach((filterTemplate) => {
            expect([selectedOption1.label, selectedOption2.label]).toContain(filterTemplate.label);
          });
        });
      });

      describe('and new unkwonw value is applied', () => {
        const value = [
          {
            key: FILTER_QUERY_PARAM_KEY.objectType,
            value: `${selectedOption1.value},unknown,${selectedOption2.value},unknown`,
          },
        ];

        beforeEach(() => {
          spyOn(component.valueChange, 'emit');

          setValue(value);
          component.handleApply();
          fixture.detectChanges();
        });

        it('should emit changes', () => {
          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith(value);
        });

        it('should set label with correct values', () => {
          const filterTemplates: FilterTemplateComponent[] = debugElement
            .queryAll(filterPredicate)
            .map((filterTemplate) => filterTemplate.componentInstance);

          filterTemplates.forEach((filterTemplate) => {
            expect([selectedOption1.label, selectedOption2.label]).toContain(filterTemplate.label);
          });
        });
      });

      describe('and is cancelled', () => {
        it('should not emit changes', () => {
          spyOn(component.valueChange, 'emit');

          const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;

          filterTemplate.cancel.emit();
          fixture.detectChanges();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(0);
        });
      });
    });
    describe('... is closed', () => {
      describe('and we clean the value', () => {
        beforeEach(() => {
          testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.objectType, value: OPTIONS[0].value }];
          fixture.detectChanges();
        });

        it('should restart values', () => {
          component.handleMultiValueClear(OPTIONS[0].value);
          fixture.detectChanges();

          expect(component.value).toEqual([{ key: FILTER_QUERY_PARAM_KEY.objectType, value: '' }]);
        });

        it('should restart label', (done) => {
          component.handleMultiValueClear(OPTIONS[0].value);
          fixture.detectChanges();

          component.multiValue$.subscribe((multiValue) => {
            expect(multiValue).toEqual([basicConfig.bubblePlaceholder]);
            done();
          });
        });

        it('should emit value changes', () => {
          spyOn(component.valueChange, 'emit');
          component.handleMultiValueClear(OPTIONS[0].value);
          fixture.detectChanges();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith([{ key: FILTER_QUERY_PARAM_KEY.objectType, value: '' }]);
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

        const form = debugElement.query(multiselectFormPredicate);

        expect(form).toBeTruthy();
      });
    });

    describe('... is open', () => {
      beforeEach(() => {
        debugElement.query(placeholderPredicate).nativeElement.click();
        fixture.detectChanges();
      });
      describe('and value changes', () => {
        it('should emit changes', () => {
          spyOn(component.valueChange, 'emit');
          const drawerPlaceholderTemplate: DrawerPlaceholderTemplateComponent =
            debugElement.query(drawerPlaceholderTemplatePredicate).componentInstance;
          const value = [
            {
              key: FILTER_QUERY_PARAM_KEY.objectType,
              value: `${OPTIONS[0].value}, ${OPTIONS[1].value}`,
            },
          ];

          setValue(value);
          drawerPlaceholderTemplate.placeholderOpenStateChange.emit(false);
          fixture.detectChanges();

          expect(component.valueChange.emit).toHaveBeenCalledWith(value);
        });
      });

      describe('and we clean the value', () => {
        beforeEach(() => {
          testComponent.value = [{ key: FILTER_QUERY_PARAM_KEY.objectType, value: OPTIONS[0].value }];
          fixture.detectChanges();
        });
        it('should restart values', () => {
          const drawerPlaceholderTemplate: DrawerPlaceholderTemplateComponent =
            debugElement.query(drawerPlaceholderTemplatePredicate).componentInstance;
          expect(component.value).toEqual([{ key: FILTER_QUERY_PARAM_KEY.objectType, value: OPTIONS[0].value }]);

          drawerPlaceholderTemplate.clear.emit();

          expect(component.value).toEqual([]);
        });

        it('should restart label', () => {
          const drawerPlaceholderTemplate: DrawerPlaceholderTemplateComponent =
            debugElement.query(drawerPlaceholderTemplatePredicate).componentInstance;
          expect(drawerPlaceholderTemplate.placeholderLabel).toEqual(OPTIONS[0].label);

          drawerPlaceholderTemplate.clear.emit();
          fixture.detectChanges();

          expect(drawerPlaceholderTemplate.placeholderLabel).toEqual(basicConfig.drawerPlaceholder);
        });

        it('should emit value changes', () => {
          spyOn(component.valueChange, 'emit');
          const drawerPlaceholderTemplate: DrawerPlaceholderTemplateComponent =
            debugElement.query(drawerPlaceholderTemplatePredicate).componentInstance;

          drawerPlaceholderTemplate.clear.emit();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith([{ key: FILTER_QUERY_PARAM_KEY.objectType, value: undefined }]);
        });
      });
    });
  });
});
