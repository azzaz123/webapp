import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconGridFilterComponent } from './icon-grid-filter.component';
import { Component, DebugElement, Input } from '@angular/core';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { IconGridFilterConfig } from './interfaces/icon-grid-filter-config.interface';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { MockFilterOptionService } from '@fixtures/filter-option-service.fixtures.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AbstractFilterModule } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.module';
import { FilterOptionServiceModule } from '@public/shared/services/filter-option/filter-option-service.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconGridCheckBoxFormModule } from '@shared/form/components/icon-grid-check-box/icon-grid-check-box-form.module';
import { By } from '@angular/platform-browser';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';
import { FilterTemplateComponent } from '../abstract-filter/filter-template/filter-template.component';
import { CAR_CONFIGURATION_ID } from '../../core/enums/configuration-ids/car-configuration-ids';
import { IconGridCheckBoxFormComponent } from '@shared/form/components/icon-grid-check-box/icon-grid-check-box-form.component';

@Component({
  selector: 'tsl-test-wrapper',
  template: ` <tsl-icon-grid-filter [config]="config" [variant]="variant" [value]="value"></tsl-icon-grid-filter> `,
})
class TestWrapperComponent {
  @Input() config: IconGridFilterConfig;
  @Input() variant: FILTER_VARIANT;
  @Input() value: FilterParameter[];
}

describe('IconGridFilterComponent', () => {
  let component: IconGridFilterComponent;
  let testComponent: TestWrapperComponent;
  let debugElement: DebugElement;
  let optionService: FilterOptionService;
  let fixture: ComponentFixture<TestWrapperComponent>;

  const filterPredicate = By.directive(FilterTemplateComponent);
  const formPredicate = By.directive(IconGridCheckBoxFormComponent);

  const basicConfig: IconGridFilterConfig = {
    id: CAR_CONFIGURATION_ID.ENGINE,
    title: 'Title',
    icon: 'icon.svg',
    bubblePlaceholder: 'Placeholder',
    mapKey: {
      parameterKey: 'key',
    },
    type: FILTER_TYPES.ICON,
    isMultiselect: false,
    hasBigIcons: false,
  };

  const multiselectConfig: IconGridFilterConfig = {
    ...basicConfig,
    isMultiselect: true,
  };

  const bigIconsConfig: IconGridFilterConfig = {
    ...basicConfig,
    hasBigIcons: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestWrapperComponent, IconGridFilterComponent],
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
        IconGridCheckBoxFormModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    optionService = TestBed.inject(FilterOptionService);
    testComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component = debugElement.query(By.directive(IconGridFilterComponent)).componentInstance;
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
      const form: IconGridCheckBoxFormComponent = debugElement.query(formPredicate).componentInstance;

      expect(form.isMultiselect).toBeTruthy();
    });
  });

  describe('when configured as big icons', () => {
    beforeEach(() => {
      testComponent.config = bigIconsConfig;
      fixture.detectChanges();
    });

    it('should pass the property to the form', () => {
      const form: IconGridCheckBoxFormComponent = debugElement.query(formPredicate).componentInstance;

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

        it('should emit value change', () => {
          spyOn(component.valueChange, 'emit');

          fixture.detectChanges();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith([]);
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

        it('should emit value change', () => {
          spyOn(component.valueChange, 'emit');

          fixture.detectChanges();

          expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
          expect(component.valueChange.emit).toHaveBeenCalledWith([{ key: 'key', value: 'gasoil,gasoline' }]);
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
          const form: IconGridCheckBoxFormComponent = debugElement.query(formPredicate).componentInstance;

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

          expect(component.valueChange.emit).toHaveBeenCalledWith([{ key: 'key', value: 'gasoline' }]);
        });
      });

      describe('and is content variant', () => {
        beforeEach(() => {
          testComponent.variant = FILTER_VARIANT.CONTENT;
          fixture.detectChanges();
        });

        it('should change value', () => {
          const form: IconGridCheckBoxFormComponent = debugElement.query(formPredicate).componentInstance;

          form.handleOptionClick('gasoline');
          fixture.detectChanges();

          expect(component.formGroup.controls.select.value).toEqual(['gasoline']);
        });

        it('should change label', () => {
          const form: IconGridCheckBoxFormComponent = debugElement.query(formPredicate).componentInstance;

          form.handleOptionClick('gasoline');
          fixture.detectChanges();

          const filterTemplate: FilterTemplateComponent = debugElement.query(filterPredicate).componentInstance;
          expect(filterTemplate.label).toEqual('Gasoline');
        });

        it('should emit value change', () => {
          spyOn(component.valueChange, 'emit');
          const form: IconGridCheckBoxFormComponent = debugElement.query(formPredicate).componentInstance;

          form.handleOptionClick('gasoline');
          fixture.detectChanges();

          expect(component.valueChange.emit).toHaveBeenCalledWith([{ key: 'key', value: 'gasoline' }]);
        });
      });
    });
  });
});
