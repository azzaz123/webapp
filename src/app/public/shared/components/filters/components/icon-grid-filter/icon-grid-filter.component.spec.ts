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
  let fixture: ComponentFixture<TestWrapperComponent>;

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
    testComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component = debugElement.query(By.directive(IconGridFilterComponent)).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when initialized', () => {
    it('should set label to configured placeholder', () => {});

    it('should get options from backend', () => {});
  });

  describe('when provided a value from the parent', () => {
    it('should set corresponding label', () => {});

    it('should have corresponding value', () => {});
  });

  describe('when value changes', () => {
    describe('from the parent', () => {
      it('should change label', () => {});

      it('should change value', () => {});

      it('should emit value change', () => {});
    });
    describe('from form component', () => {
      it('should change label', () => {});

      it('should change value', () => {});

      it('should emit value change', () => {});
    });
  });
});
