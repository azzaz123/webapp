import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { RangeDatepickerComponent } from './range-datepicker.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MOCK_DATE, MOCK_DATE2, MOCK_SELECTED_DATES } from '../../../../../tests/calendar.fixtures.spec';

describe('RangeDatepickerComponent', () => {
  let component: RangeDatepickerComponent;
  let fixture: ComponentFixture<RangeDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RangeDatepickerComponent],
      providers: [{
        provide: NgbCalendar, useValue: {
          getToday() {
            return MOCK_DATE;
          }
        }
      }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'calculateDateDiff');
    });

    it('should set numberOfDays if init and end dates are selected', () => {
      component.fromDate = MOCK_DATE;
      component.toDate = MOCK_DATE2;
      component.ngOnInit();

      expect(component.calculateDateDiff).toHaveBeenCalled();
    });

    it('should set numberOfDays to 0 if no dates selected', () => {
      component.ngOnInit();

      expect(component.calculateDateDiff).not.toHaveBeenCalled();
      expect(component.fromDate).toBeUndefined();
      expect(component.toDate).toBeUndefined();
      expect(component.numberOfDays).toBe(0);
    });
  });

  describe('onDateSelection', () => {
    beforeEach(() => {
      spyOn(component, 'calculateDateDiff');
    });

    it('should set init date if any date is selected', () => {
      component.onDateSelection(MOCK_DATE);

      expect(component.fromDate).toBe(MOCK_DATE);
      expect(component.toDate).toBeUndefined();
      expect(component.calculateDateDiff).not.toHaveBeenCalled();
    });

    it('should set init date if end date is before init date', () => {
      component.onDateSelection(MOCK_DATE2);
      component.onDateSelection(MOCK_DATE);

      expect(component.fromDate).toBe(MOCK_DATE);
      expect(component.calculateDateDiff).not.toHaveBeenCalled();
    });

    it('should set end date and calculate date diff if init date is before end date', () => {
      component.onDateSelection(MOCK_DATE);
      component.onDateSelection(MOCK_DATE2);

      expect(component.fromDate).toBeDefined();
      expect(component.fromDate).toBe(MOCK_DATE);
      expect(component.toDate).toBe(MOCK_DATE2);
      expect(component.calculateDateDiff).toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should emit closeCalendar event on click cancel', () => {
      spyOn(component.closeCalendar, 'emit');

      component.onCancel();

      expect(component.closeCalendar.emit).toHaveBeenCalled();
    });
  });

  describe('calculateDateDiff', () => {
    it('should calculate the number of days between init and end date', () => {
      component.onDateSelection(MOCK_DATE);
      component.onDateSelection(MOCK_DATE2);
      component.calculateDateDiff();

      expect(component.numberOfDays).toBe(MOCK_SELECTED_DATES.numberOfDays);
    });
  });

  describe('onApply', () => {
    it('should fill selectedDates object with current selection and send applyCalendar event', () => {
      spyOn(component.applyCalendar, 'emit');

      component.onDateSelection(MOCK_DATE);
      component.onDateSelection(MOCK_DATE2);
      component.onApply();

      expect(component.selectedDates.fromDate).toBe(MOCK_DATE);
      expect(component.selectedDates.toDate).toBe(MOCK_DATE2);
      expect(component.applyCalendar.emit).toHaveBeenCalledWith(component.selectedDates);
    });
  });

});
