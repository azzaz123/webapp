import { ComponentFixture, TestBed } from '@angular/core/testing';

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
    debugElement = fixture.debugElement;
    testComponent = fixture.componentInstance;
    testComponent.config = basicConfig;
    component = debugElement.query(By.directive(SuggesterFilterComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
