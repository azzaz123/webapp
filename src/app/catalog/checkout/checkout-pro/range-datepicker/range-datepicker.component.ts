import { Component, OnInit, Input, EventEmitter, Output, Injectable } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDatepickerI18n, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { I18nService } from '../../../../core/i18n/i18n.service';
import { CalendarDates } from './calendar-dates';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;

const I18N_VALUES = {
  en: {
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  es: {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  }
};
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private i18nService: I18nService) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this.i18nService.locale].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this.i18nService.locale].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}
@Component({
  selector: 'tsl-range-datepicker',
  templateUrl: './range-datepicker.component.html',
  styleUrls: ['./range-datepicker.component.scss'],
  providers: [I18nService, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }]
})

export class RangeDatepickerComponent implements OnInit {

  hoveredDate: NgbDateStruct;
  minDate: NgbDateStruct;
  startDate: NgbDateStruct;
  endDate: NgbDateStruct;
  todayDay: NgbDateStruct;
  tomorrowDay: NgbDateStruct;
  model;

  @Input() bumpType: string;
  @Input()  selectedDates: CalendarDates;
  @Output() closeCalendar: EventEmitter<any> = new EventEmitter();
  @Output() applyCalendar: EventEmitter<CalendarDates> = new EventEmitter();

  isHovered = date => this.startDate && !this.endDate && this.hoveredDate && after(date, this.startDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.startDate) && before(date, this.endDate);
  isFrom = date => equals(date, this.startDate);
  isTo = date => equals(date, this.endDate);

  constructor(private calendar: NgbCalendar, config: NgbDatepickerConfig) {
    config.outsideDays = 'hidden';
    this.minDate = { year: calendar.getToday().year, month: calendar.getToday().month, day: calendar.getToday().day };
  }

  ngOnInit() {
    this.todayDay = this.selectedDates.fromDate;
    this.tomorrowDay = this.selectedDates.toDate;
    this.startDate = this.selectedDates.fromDate;
    this.endDate = this.selectedDates.toDate;
  }

  onDateSelection(date: NgbDateStruct) {
    if (!this.startDate && !this.endDate) {
      this.startDate = date;
    } else if (this.startDate && !this.endDate && after(date, this.startDate)) {
      this.endDate = date;
      this.selectedDates.fromDate = this.startDate;
      this.selectedDates.toDate = this.endDate;
    } else {
      this.endDate = null;
      this.startDate = date;
    }
  }

  onCancel() {
    this.selectedDates.fromDate = this.todayDay;
    this.selectedDates.toDate = this.tomorrowDay;
    this.closeCalendar.emit();
  }

  onApply() {
    this.applyCalendar.emit(this.selectedDates);
  }

}
