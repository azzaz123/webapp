import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FilterParameterStoreService } from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';

import { SortFilterComponent } from './sort-filter.component';
import { SELECT_FORM_OPTIONS_CONFIG } from './sort-filter.config';

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
  let filterParameterStoreServiceMock;

  beforeEach(async () => {
    filterParameterStoreServiceMock = {
      setParameters: (filterParameters: FilterParameter[]) => {},
    };

    await TestBed.configureTestingModule({
      imports: [NgbDropdownModule],
      declarations: [SortFilterComponent, SelectFormStubComponent],
      providers: [
        {
          provide: FilterParameterStoreService,
          useValue: filterParameterStoreServiceMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortFilterComponent);
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
      spyOn(filterParameterStoreServiceMock, 'setParameters');
      const lastOption: SelectFormOption<string> = SELECT_FORM_OPTIONS_CONFIG[SELECT_FORM_OPTIONS_CONFIG.length - 1];
      selectFilterStub.mockClickOption(lastOption);

      fixture.detectChanges();

      expect(filterParameterStoreServiceMock.setParameters).toHaveBeenCalledTimes(1);
      expect(filterParameterStoreServiceMock.setParameters).toHaveBeenCalledWith([{ key: 'order_by', value: lastOption.value }]);
    });

    it('should send default value (null) if it is the first option', () => {
      spyOn(filterParameterStoreServiceMock, 'setParameters');
      const lastOption: SelectFormOption<string> = SELECT_FORM_OPTIONS_CONFIG[0];
      selectFilterStub.mockClickOption(lastOption);

      fixture.detectChanges();

      expect(filterParameterStoreServiceMock.setParameters).toHaveBeenCalledTimes(1);
      expect(filterParameterStoreServiceMock.setParameters).toHaveBeenCalledWith([{ key: 'order_by', value: null }]);
    });
  });
});
