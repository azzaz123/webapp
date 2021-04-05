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
import { IconGridCheckFormModule } from '@shared/form/components/icon-grid-check/icon-grid-check-form.module';
import { By } from '@angular/platform-browser';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';
import { FilterTemplateComponent } from '../abstract-filter/filter-template/filter-template.component';
import { CAR_CONFIGURATION_ID } from '../../core/enums/configuration-ids/car-configuration-ids';

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
        IconGridCheckFormModule,
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
      spyOn(optionService, 'getOptions');

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
      describe('and is empty', () => {
        it('should set label to default', () => {});

        it('should clean value', () => {});

        it('should emit value change', () => {});
      });

      describe('and has value', () => {
        it('should change label', () => {});

        it('should change value', () => {});

        it('should emit value change', () => {});
      });
    });
    describe('from form component', () => {
      it('should change label', () => {});

      it('should change value', () => {});

      it('should emit value change', () => {});
    });
  });
});
