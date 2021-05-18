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
import { SELECT_FORM_OPTIONS_CONFIG } from './sort-filter.config';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchQueryStringService } from '@core/search/search-query-string.service';
import { QueryStringLocationService } from '@core/search/query-string-location.service';
import { CookieService } from 'ngx-cookie';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { SearchNavigatorService } from '@core/search/search-navigator.service';

@Component({
  selector: 'tsl-select-form',
  template: '',
})
class SelectFormStubComponent {
  @Input() options: SelectFormOption<string>;
  @Input() formControl: FormControl;
  @Output() ngModelChange: EventEmitter<string> = new EventEmitter<string>();

  mockClickOption(option: SelectFormOption<string>): void {
    this.ngModelChange.emit(option.value);
  }
}

describe('SortFilterComponent', () => {
  let fixture: ComponentFixture<SortFilterComponent>;
  let component: SortFilterComponent;
  let navigator: SearchNavigatorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
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
        { provide: 'SUBDOMAIN', useValue: 'es' },
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortFilterComponent);
    navigator = TestBed.inject(SearchNavigatorService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnInit', () => {
    it('should set sort by distance', () => {
      const value: HTMLElement = fixture.debugElement.query(By.css('.SortFilter__value')).nativeElement;

      expect(value.textContent).toBe(SELECT_FORM_OPTIONS_CONFIG[0].label);
    });

    it('should buble be closed', () => {
      const dropdown: NgbDropdown = component.dropdown;

      expect(dropdown.isOpen()).toBe(false);
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
      const lastOption: SelectFormOption<string> = SELECT_FORM_OPTIONS_CONFIG[SELECT_FORM_OPTIONS_CONFIG.length - 1];
      selectFilterStub.mockClickOption(lastOption);

      fixture.detectChanges();

      const value: HTMLElement = fixture.debugElement.query(By.css('.SortFilter__value')).nativeElement;
      expect(value.textContent).toBe(lastOption.label);
    });

    it('should emit the new value to filter parameter store', () => {
      spyOn(navigator, 'navigate');
      const lastOption: SelectFormOption<string> = SELECT_FORM_OPTIONS_CONFIG[SELECT_FORM_OPTIONS_CONFIG.length - 1];
      selectFilterStub.mockClickOption(lastOption);

      fixture.detectChanges();

      expect(navigator.navigate).toHaveBeenCalledTimes(1);
      expect(navigator.navigate).toHaveBeenCalledWith([{ key: 'order_by', value: lastOption.value }], true);
    });

    it('should send default value (null) if it is the first option', () => {
      spyOn(navigator, 'navigate');
      const lastOption: SelectFormOption<string> = SELECT_FORM_OPTIONS_CONFIG[0];
      selectFilterStub.mockClickOption(lastOption);

      fixture.detectChanges();

      expect(navigator.navigate).toHaveBeenCalledTimes(1);
      expect(navigator.navigate).toHaveBeenCalledWith([{ key: 'order_by', value: null }], true);
    });
  });
});
