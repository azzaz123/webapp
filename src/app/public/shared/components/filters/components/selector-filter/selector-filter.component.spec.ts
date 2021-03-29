import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';

import { MockFilterOptionService } from '@fixtures/filter-option-service.fixtures.spec';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { SelectorFilterComponent } from './selector-filter.component';
import { FILTER_TYPES } from '../../core/enums/filter-types/filter-types.enum';
import { FASHION_CONFIGURATION_ID } from '../../core/enums/configuration-ids/fashion-configuration-ids.enum';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { FilterOptionServiceModule } from '@public/shared/services/filter-option/filter-option-service.module';
import { AbstractSelectorFilterModule } from '../abstract-selector-filter/abstract-selector-filter.module';
import { SelectorOptionModule } from '../abstract-selector-filter/selector-option/selector-option.module';
import { SelectorFilterConfig } from './interfaces/selector-filter-config.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { FilterTemplateComponent } from '../abstract-filter/filter-template/filter-template.component';
import { SelectorFilterTemplateComponent } from '../abstract-selector-filter/selector-filter-template/selector-filter-template.component';
import { SelectorParentOptionComponent } from '../abstract-selector-filter/selector-parent-option/selector-parent-option.component';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';

@Component({
  selector: 'tsl-test-wrapper',
  template: ` <tsl-selector-filter [config]="config" [variant]="variant" [value]="value"></tsl-selector-filter> `,
})
class TestWrapperComponent {
  @Input() config: SelectorFilterConfig;
  @Input() variant: FILTER_VARIANT;
  @Input() value: FilterParameter[];
}

describe('SelectorFilterComponent', () => {
  let testComponent: TestWrapperComponent;
  let component: SelectorFilterComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<TestWrapperComponent>;

  const basicConfig: SelectorFilterConfig = {
    type: FILTER_TYPES.SIMPLE_SELECTOR,
    hasContentPlaceholder: true,
    bubblePlaceholder: 'Bubble placeholder',
    drawerPlaceholder: 'Drawer placeholder',
    mapKey: {
      parameterKey: 'key',
    },
    title: 'My selector',
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
      declarations: [TestWrapperComponent, SelectorFilterComponent],
      imports: [
        HttpClientTestingModule,
        NgbDropdownModule,
        AbstractFilterModule,
        FilterOptionServiceModule,
        AbstractSelectorFilterModule,
        SelectorOptionModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    debugElement = fixture.debugElement;
    testComponent = fixture.componentInstance;
    testComponent.config = basicConfig;
    component = debugElement.query(By.directive(SelectorFilterComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the component inits', () => {
    it('should retrieve corresponding options from backend', () => {
      expect(component.options).toEqual([
        {
          value: 'male',
          label: $localize`:@@FilterOptionGender_male:Male`,
        },
        {
          value: 'female',
          label: $localize`:@@FilterOptionGender_female:Female`,
        },
      ]);
    });

    describe('and is bubble variant', () => {
      beforeEach(() => {
        testComponent.variant = FILTER_VARIANT.BUBBLE;
        fixture.detectChanges();
      });
      it('should set label to bubble placeholder', () => {
        const filterTemplate: FilterTemplateComponent = debugElement.query(By.directive(FilterTemplateComponent)).componentInstance;

        expect(filterTemplate.label).toEqual(basicConfig.bubblePlaceholder);
      });
    });

    describe('and is content variant', () => {
      beforeEach(() => {
        testComponent.variant = FILTER_VARIANT.CONTENT;
        fixture.detectChanges();
      });

      it('should set label to drawer placeholder', () => {
        const selectorTemplate: SelectorFilterTemplateComponent = debugElement.query(By.directive(SelectorFilterTemplateComponent))
          .componentInstance;

        expect(selectorTemplate.placeholderLabel).toEqual(basicConfig.drawerPlaceholder);
      });

      it('should show option placeholder', () => {
        const parent = debugElement.query(By.directive(SelectorParentOptionComponent));
        const options = debugElement.queryAll(By.css('.SelectorFilter__option'));

        expect(parent).toBeTruthy();
        expect(options.length).toEqual(0);
      });
    });
  });
});
