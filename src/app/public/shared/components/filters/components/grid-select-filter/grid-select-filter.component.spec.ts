import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSelectFilterComponent } from './grid-select-filter.component';
import { Component, DebugElement, Input } from '@angular/core';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { GridSelectFilterConfig } from './interfaces/grid-select-filter-config.interface';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { MockFilterOptionService } from '@fixtures/filter-option-service.fixtures.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AbstractFilterModule } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.module';
import { FilterOptionServiceModule } from '@public/shared/services/filter-option/filter-option-service.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridSelectFormModule } from '@shared/form/components/grid-select/grid-select-form.module';
import { By } from '@angular/platform-browser';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';
import { FilterTemplateComponent } from '../abstract-filter/filter-template/filter-template.component';
import { CAR_CONFIGURATION_ID } from '../../core/enums/configuration-ids/car-configuration-ids';
import { GridSelectFormComponent } from '@shared/form/components/grid-select/grid-select-form.component';
import { IsBubblePipe } from '../abstract-filter/pipes/is-bubble.pipe';

@Component({
  selector: 'tsl-test-wrapper',
  template: ` <tsl-grid-select-filter [config]="config" [variant]="variant" [value]="value"></tsl-grid-select-filter> `,
})
class TestWrapperComponent {
  @Input() config: GridSelectFilterConfig;
  @Input() variant: FILTER_VARIANT;
  @Input() value: FilterParameter[] = [];
}

describe('GridSelectFilterComponent', () => {
  let component: GridSelectFilterComponent;
  let testComponent: TestWrapperComponent;
  let debugElement: DebugElement;
  let optionService: FilterOptionService;
  let fixture: ComponentFixture<TestWrapperComponent>;

  const filterPredicate = By.directive(FilterTemplateComponent);
  const formPredicate = By.directive(GridSelectFormComponent);

  const basicConfig: GridSelectFilterConfig = {
    id: CAR_CONFIGURATION_ID.ENGINE,
    title: 'Title',
    icon: 'icon.svg',
    bubblePlaceholder: 'Placeholder',
    mapKey: {
      parameterKey: 'key',
    },
    type: FILTER_TYPES.GRID,
    isMultiselect: false,
    hasBigIcons: false,
  };

  const multiselectConfig: GridSelectFilterConfig = {
    ...basicConfig,
    isMultiselect: true,
  };

  const bigIconsConfig: GridSelectFilterConfig = {
    ...basicConfig,
    hasBigIcons: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestWrapperComponent, GridSelectFilterComponent, IsBubblePipe],
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
        FilterOptionServiceModule,
        FormsModule,
        ReactiveFormsModule,
        GridSelectFormModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    optionService = TestBed.inject(FilterOptionService);
    testComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component = debugElement.query(By.directive(GridSelectFilterComponent)).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when configured as multiselect', () => {
    beforeEach(() => {
      testComponent.config = multiselectConfig;
      fixture.detectChanges();
    });

    it('should pass the property to the form', () => {
      const form: GridSelectFormComponent = debugElement.query(formPredicate).componentInstance;

      expect(form.isMultiselect).toBeTruthy();
    });
  });

  describe('when configured as big icons', () => {
    beforeEach(() => {
      testComponent.config = bigIconsConfig;
      fixture.detectChanges();
    });

    it('should pass the property to the form', () => {
      const form: GridSelectFormComponent = debugElement.query(formPredicate).componentInstance;

      expect(form.isBig).toBeTruthy();
    });
  });

  describe('when initialized', () => {
    beforeEach(() => {
      testComponent.config = basicConfig;
    });
    it('should set label to configured placeholder', () => {
      fixture.detectChanges();

      const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;

      expect(filterTemplate.label).toEqual(basicConfig.bubblePlaceholder);
    });

    it('should get options from backend', () => {
      spyOn(optionService, 'getOptions').and.callThrough();

      fixture.detectChanges();

      expect(optionService.getOptions).toHaveBeenCalledTimes(1);
      expect(optionService.getOptions).toHaveBeenCalledWith(basicConfig.id);
    });
  });

  describe('when provided a value from the parent', () => {
    beforeEach(() => {
      testComponent.config = basicConfig;
      testComponent.value = [{ key: 'key', value: 'gasoil' }];
      fixture.detectChanges();
    });
    it('should set corresponding label', () => {
      const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;

      expect(filterTemplate.label).toEqual('Gasoil');
    });

    it('should have corresponding value', () => {
      expect(component.formGroup.controls.select.value).toEqual(['gasoil']);
    });
  });

  describe('when value changes', () => {
    describe('from the parent', () => {
      beforeEach(() => {
        testComponent.config = basicConfig;
        testComponent.value = [{ key: 'key', value: 'gasoil' }];
        fixture.detectChanges();
      });
      describe('and is empty', () => {
        beforeEach(() => {
          testComponent.value = [];
        });
        it('should set label to default', () => {
          fixture.detectChanges();
          const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;

          expect(filterTemplate.label).toEqual(basicConfig.bubblePlaceholder);
        });

        it('should clean value', () => {
          fixture.detectChanges();
          expect(component.formGroup.controls.select.value).toEqual([]);
        });

        it('should not emit value change', () => {
          spyOn(component.valueChange, 'emit');

          fixture.detectChanges();

          expect(component.valueChange.emit).not.toHaveBeenCalled();
        });
      });

      describe('and has value', () => {
        beforeEach(() => {
          testComponent.value = [{ key: 'key', value: 'gasoil,gasoline' }];
        });
        it('should change label', () => {
          fixture.detectChanges();
          const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;

          expect(filterTemplate.label).toEqual('Gasoil, Gasoline');
        });

        it('should change value', () => {
          fixture.detectChanges();
          expect(component.formGroup.controls.select.value).toEqual(['gasoil', 'gasoline']);
        });

        it('should not emit value change', () => {
          spyOn(component.valueChange, 'emit');

          fixture.detectChanges();

          expect(component.valueChange.emit).not.toHaveBeenCalled();
        });
      });
    });
    describe('from form component', () => {
      beforeEach(() => {
        testComponent.config = basicConfig;
        testComponent.value = [{ key: 'key', value: 'gasoil' }];
      });

      describe('and is bubble variant', () => {
        beforeEach(() => {
          fixture.detectChanges();
          const form: GridSelectFormComponent = debugElement.query(formPredicate).componentInstance;

          form.handleOptionClick('gasoline');
        });
        it('should NOT change label until apply', () => {
          fixture.detectChanges();

          const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;

          expect(filterTemplate.label).toEqual('Gasoil');

          component.handleApply();
          fixture.detectChanges();

          expect(filterTemplate.label).toEqual('Gasoline');
        });

        it('should NOT emit value change until apply', () => {
          spyOn(component.valueChange, 'emit');

          fixture.detectChanges();

          expect(component.valueChange.emit).not.toHaveBeenCalled();

          component.handleApply();
          fixture.detectChanges();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith([{ key: 'key', value: 'gasoline' }]);
        });
      });

      describe('and is content variant', () => {
        beforeEach(() => {
          testComponent.variant = FILTER_VARIANT.CONTENT;
          fixture.detectChanges();
        });

        it('should change value', () => {
          const form: GridSelectFormComponent = debugElement.query(formPredicate).componentInstance;

          form.handleOptionClick('gasoline');
          fixture.detectChanges();

          expect(component.formGroup.controls.select.value).toEqual(['gasoline']);
        });

        it('should change label', () => {
          const form: GridSelectFormComponent = debugElement.query(formPredicate).componentInstance;

          form.handleOptionClick('gasoline');
          fixture.detectChanges();

          const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;
          expect(filterTemplate.label).toEqual('Gasoline');
        });

        it('should emit value change', () => {
          spyOn(component.valueChange, 'emit');
          const form: GridSelectFormComponent = debugElement.query(formPredicate).componentInstance;

          form.handleOptionClick('gasoline');
          fixture.detectChanges();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith([{ key: 'key', value: 'gasoline' }]);
        });
      });
    });
  });
});
