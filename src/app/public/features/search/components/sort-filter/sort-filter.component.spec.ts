import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import {
  FILTER_PARAMETER_STORE_TOKEN,
  FilterParameterStoreService,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { SortFilterComponent } from './sort-filter.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchQueryStringService } from '@core/search/search-query-string.service';
import { QueryStringLocationService } from '@core/search/query-string-location.service';
import { CookieService } from 'ngx-cookie';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { SearchNavigatorService } from '@core/search/search-navigator.service';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ButtonModule } from '@shared/button/button.module';
import { FILTERS_SOURCE } from '@public/core/services/search-tracking-events/enums/filters-source-enum';
import {
  SORT_BY,
  SORT_BY_DEFAULT_OPTIONS,
  SORT_BY_DISTANCE_OPTION,
  SORT_BY_RELEVANCE_OPTION,
} from './services/constants/sort-by-options-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { SortByService } from './services/sort-by.service';

@Component({
  selector: 'tsl-select-form',
  template: '',
})
class SelectFormStubComponent {
  @Input() options: SelectFormOption<string>;
  @Input() formControl: FormControl;

  mockClickOption(option: SelectFormOption<string>): void {
    this.formControl.setValue(option.value);
  }
}

describe('SortFilterComponent', () => {
  let fixture: ComponentFixture<SortFilterComponent>;
  let component: SortFilterComponent;
  let navigator: SearchNavigatorService;
  let sortByService: SortByService;
  const sortFilterValueLabelSelector = '.SortFilter__value';
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ButtonModule,
        HttpClientTestingModule,
        SvgIconModule,
        NgbDropdownModule,
        RouterTestingModule.withRoutes([
          {
            path: 'search',
            redirectTo: '',
          },
        ]),
      ],
      declarations: [SortFilterComponent, SelectFormStubComponent],
      providers: [
        {
          provide: FILTER_PARAMETER_STORE_TOKEN,
          useClass: FilterParameterStoreService,
        },
        SearchQueryStringService,
        QueryStringLocationService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {},
            },
          },
        },
        { provide: 'SUBDOMAIN', useValue: 'es' },
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
        SortByService,
        {
          provide: FeatureFlagService,
          useValue: {
            getFlag() {
              return of();
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortFilterComponent);
    navigator = TestBed.inject(SearchNavigatorService);
    sortByService = TestBed.inject(SortByService);
    route = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('by default', () => {
    it('should set sort by distance', () => {
      const value: HTMLElement = fixture.debugElement.query(By.css(sortFilterValueLabelSelector)).nativeElement;

      expect(value.textContent).toBe(component.options[0].label);
    });

    it('should buble be closed', () => {
      const dropdown: NgbDropdown = component.dropdown;

      expect(dropdown.isOpen()).toBe(false);
    });

    describe('when a value is already provided in the URL', () => {
      describe('and the provided value is a valid option', () => {
        it('should show the label for the provided option', () => {
          route.snapshot.queryParams = { [FILTER_QUERY_PARAM_KEY.orderBy]: SORT_BY_DEFAULT_OPTIONS[0].value };
          component.ngOnInit();
          fixture.detectChanges();

          const value: HTMLElement = fixture.debugElement.query(By.css('.SortFilter__value')).nativeElement;

          expect(value.textContent).toEqual(SORT_BY_DEFAULT_OPTIONS[0].label);
        });
      });

      describe('and the provided value is not a valid option', () => {
        it('should select the default option', () => {
          route.snapshot.queryParams = { [FILTER_QUERY_PARAM_KEY.orderBy]: 'invalid-sort-value' };
          component.ngOnInit();
          fixture.detectChanges();

          const value: HTMLElement = fixture.debugElement.query(By.css('.SortFilter__value')).nativeElement;

          expect(value.textContent).toEqual(SORT_BY_DEFAULT_OPTIONS[0].label);
        });
      });
    });
  });

  describe('on isRelevanceOptionActive change', () => {
    const distanceSortByOption = SORT_BY_DISTANCE_OPTION;

    describe('and isRelevanceOptionActive is false and option relevance is selected', () => {
      beforeEach(() => {
        component.selected = SORT_BY_RELEVANCE_OPTION;
        sortByService['isRelevanceOptionActiveSubject'].next(false);
      });

      it('should set sort by distance', () => {
        const value: HTMLElement = fixture.debugElement.query(By.css(sortFilterValueLabelSelector)).nativeElement;

        expect(value.textContent).toBe(distanceSortByOption.label);
        expect(component.selected).toBe(distanceSortByOption);
        expect(component.formControl.value).toBe(distanceSortByOption.value);
      });
    });

    describe('and isRelevanceOptionActive is false and option relevance is selected', () => {
      beforeEach(() => {
        component.selected = SORT_BY_DISTANCE_OPTION;
        sortByService['isRelevanceOptionActiveSubject'].next(false);
      });

      it('should not modify sort by distance', () => {
        const value: HTMLElement = fixture.debugElement.query(By.css(sortFilterValueLabelSelector)).nativeElement;

        expect(value.textContent).toBe(component.selected.label);
        expect(component.selected).toBe(component.selected);
        expect(component.formControl.value).toBe(component.selected.value);
      });
    });
  });

  describe('on value input', () => {
    describe('and valid value', () => {
      const validSortByValue = SORT_BY.NEWEST;
      let validSortByOption: SelectFormOption<SORT_BY>;

      beforeEach(() => {
        component.value = validSortByValue;
        validSortByOption = component.options.find((option) => option.value === validSortByValue);
        fixture.detectChanges();
      });

      it('should set sort by the given value', () => {
        const value: HTMLElement = fixture.debugElement.query(By.css(sortFilterValueLabelSelector)).nativeElement;

        fixture.whenStable().then(() => {
          expect(value.textContent).toBe(validSortByOption.label);
          expect(component.selected).toBe(validSortByOption);
          expect(component.formControl.value).toBe(validSortByOption.value);
        });
      });
    });

    describe('and invalid value', () => {
      const defaultSortByValue = SORT_BY.DISTANCE;
      let defaultSortByOption: SelectFormOption<SORT_BY>;

      beforeEach(() => {
        component.value = 'invalid' as SORT_BY;
        fixture.detectChanges();
        defaultSortByOption = component.options.find((option) => option.value === defaultSortByValue);
      });

      it('should set sort by the default value', () => {
        const value: HTMLElement = fixture.debugElement.query(By.css(sortFilterValueLabelSelector)).nativeElement;

        expect(value.textContent).toBe(defaultSortByOption?.label);
      });
    });
  });

  describe('when we choose an option', () => {
    let selectFilterStub: SelectFormStubComponent;

    beforeEach(() => {
      const sortFilterElement: HTMLElement = fixture.debugElement.query(By.directive(NgbDropdown)).nativeElement;
      sortFilterElement.click();
      fixture.detectChanges();
      selectFilterStub = fixture.debugElement.query(By.directive(SelectFormStubComponent)).componentInstance;
    });

    it('should change the value on topbar', () => {
      const lastOption: SelectFormOption<string> = SORT_BY_DEFAULT_OPTIONS[SORT_BY_DEFAULT_OPTIONS.length - 1];
      selectFilterStub.mockClickOption(lastOption);

      fixture.whenStable().then(() => {
        const value: HTMLElement = fixture.debugElement.query(By.css(sortFilterValueLabelSelector)).nativeElement;
        expect(value.textContent).toBe(lastOption.label);
      });
    });

    it('should emit the new value to filter parameter store', () => {
      spyOn(navigator, 'navigate');
      const lastOption: SelectFormOption<string> = SORT_BY_DEFAULT_OPTIONS[SORT_BY_DEFAULT_OPTIONS.length - 1];
      selectFilterStub.mockClickOption(lastOption);

      fixture.detectChanges();

      expect(navigator.navigate).toHaveBeenCalledTimes(1);
      expect(navigator.navigate).toHaveBeenCalledWith([{ key: 'order_by', value: lastOption.value }], FILTERS_SOURCE.QUICK_FILTERS, true);
    });

    it('should send default value (null) if it is the first option', () => {
      spyOn(navigator, 'navigate');
      const lastOption: SelectFormOption<string> = SORT_BY_DEFAULT_OPTIONS[0];
      selectFilterStub.mockClickOption(lastOption);

      fixture.detectChanges();

      expect(navigator.navigate).toHaveBeenCalledTimes(1);
      expect(navigator.navigate).toHaveBeenCalledWith([{ key: 'order_by', value: null }], FILTERS_SOURCE.QUICK_FILTERS, true);
    });
  });
});
