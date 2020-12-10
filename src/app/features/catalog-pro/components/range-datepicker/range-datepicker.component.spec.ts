import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbCalendar, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { RangeDatepickerComponent } from './range-datepicker.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MOCK_DATE,
  MOCK_DATE2,
  MOCK_DATE3,
  MOCK_SELECTED_DATES,
} from '@fixtures/calendar.fixtures.spec';

describe('RangeDatepickerComponent', () => {
  let component: RangeDatepickerComponent;
  let fixture: ComponentFixture<RangeDatepickerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [BrowserAnimationsModule],
        declarations: [RangeDatepickerComponent],
        providers: [
          NgbDatepickerConfig,
          {
            provide: NgbCalendar,
            useValue: {
              getToday() {
                return MOCK_DATE;
              },
            },
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeDatepickerComponent);
    component = fixture.componentInstance;
    component.selectedDates = MOCK_SELECTED_DATES;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set today date and tomorrow date', () => {
      component.ngOnInit();

      expect(component.todayDay).toBe(MOCK_DATE);
      expect(component.tomorrowDay).toBe(MOCK_DATE2);
    });

    it('should set calendar start and end dates', () => {
      component.ngOnInit();

      expect(component.startDate).toBe(MOCK_DATE);
      expect(component.startDate).toBe(component.todayDay);
      expect(component.endDate).toBe(MOCK_DATE2);
      expect(component.endDate).toBe(component.tomorrowDay);
    });
  });

  describe('onDateSelection', () => {
    it('should set init date if any date is selected', () => {
      component.onDateSelection(MOCK_DATE);

      expect(component.startDate).toBe(MOCK_DATE);
    });

    it('should set end date if end date is after init date', () => {
      component.onDateSelection(MOCK_DATE);
      component.onDateSelection(MOCK_DATE2);

      expect(component.startDate).toBe(MOCK_DATE);
      expect(component.endDate).toBe(MOCK_DATE2);
    });

    it('should set only init date if end date is before init date', () => {
      component.onDateSelection(MOCK_DATE2);
      component.onDateSelection(MOCK_DATE);

      expect(component.startDate).toBe(MOCK_DATE);
      expect(component.endDate).toBeNull();
    });

    it('should calculate the number of days between init and end date', () => {
      component.onDateSelection(MOCK_DATE);
      component.onDateSelection(MOCK_DATE2);

      expect(component.selectedDates.numberOfDays).toBe(
        MOCK_SELECTED_DATES.numberOfDays
      );
    });
  });

  describe('onCancel', () => {
    it('should emit closeCalendar event on click cancel', () => {
      component.onDateSelection(MOCK_DATE2);
      component.onDateSelection(MOCK_DATE3);
      spyOn(component.closeCalendar, 'emit');

      component.onCancel();

      expect(component.selectedDates.fromDate).toBe(MOCK_DATE);
      expect(component.selectedDates.toDate).toBe(MOCK_DATE2);
      expect(component.closeCalendar.emit).toHaveBeenCalled();
    });
  });

  describe('onApply', () => {
    it('should fill selectedDates object with current selection and send applyCalendar event', () => {
      spyOn(component.applyCalendar, 'emit');

      component.onDateSelection(MOCK_DATE);
      component.onDateSelection(MOCK_DATE2);
      component.onApply();

      expect(component.startDate).toBe(MOCK_DATE);
      expect(component.endDate).toBe(MOCK_DATE2);
      expect(component.selectedDates.fromDate).toBe(MOCK_DATE);
      expect(component.selectedDates.toDate).toBe(MOCK_DATE2);
      expect(component.applyCalendar.emit).toHaveBeenCalledWith(
        component.selectedDates
      );
    });
  });
});
