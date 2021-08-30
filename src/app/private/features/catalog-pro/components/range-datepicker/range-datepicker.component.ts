import { CalendarDates } from '../../core/calendar-dates';
import { Component, OnInit, Input, EventEmitter, Output, Injectable, LOCALE_ID, Inject } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDatepickerI18n, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { style, animate, transition, trigger } from '@angular/animations';
import { I18nService } from '@core/i18n/i18n.service';
import { APP_LOCALE } from 'configs/subdomains.config';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two
    ? false
    : one.year === two.year
    ? one.month === two.month
      ? one.day === two.day
        ? false
        : one.day < two.day
      : one.month < two.month
    : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two
    ? false
    : one.year === two.year
    ? one.month === two.month
      ? one.day === two.day
        ? false
        : one.day > two.day
      : one.month > two.month
    : one.year > two.year;

const I18N_VALUES = {
  en: {
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  es: {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  },
};
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
  constructor(@Inject(LOCALE_ID) private locale: APP_LOCALE) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this.locale].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this.locale].months[month - 1];
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
  providers: [I18nService, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(150, style({ opacity: 1 }))]),
      transition(':leave', [animate(150, style({ opacity: 0 }))]),
    ]),
  ],
})
export class RangeDatepickerComponent implements OnInit {
  @Input() bumpType: string;
  @Input() selectedDates: CalendarDates;
  @Output() closeCalendar: EventEmitter<any> = new EventEmitter();
  @Output() applyCalendar: EventEmitter<CalendarDates> = new EventEmitter();
  hoveredDate: NgbDateStruct;
  minDate: NgbDateStruct;
  startDate: NgbDateStruct;
  endDate: NgbDateStruct;
  todayDay: NgbDateStruct;
  tomorrowDay: NgbDateStruct;
  model: NgbDateStruct;
  newDates: CalendarDates;

  constructor(private calendar: NgbCalendar, config: NgbDatepickerConfig) {
    config.outsideDays = 'hidden';
    this.minDate = {
      year: calendar.getToday().year,
      month: calendar.getToday().month,
      day: calendar.getToday().day,
    };
  }

  isHovered = (date) =>
    this.startDate && !this.endDate && this.hoveredDate && after(date, this.startDate) && before(date, this.hoveredDate);
  isInside = (date) => after(date, this.startDate) && before(date, this.endDate);
  isFrom = (date) => equals(date, this.startDate);
  isTo = (date) => equals(date, this.endDate);

  ngOnInit() {
    this.todayDay = this.selectedDates.fromDate;
    this.tomorrowDay = this.selectedDates.toDate;
    this.startDate = this.selectedDates.fromDate;
    this.endDate = this.selectedDates.toDate;
    this.newDates = new CalendarDates(this.todayDay, this.tomorrowDay);
  }

  onDateSelection(date: NgbDateStruct) {
    if (!this.startDate && !this.endDate) {
      this.startDate = date;
    } else if (this.startDate && !this.endDate && after(date, this.startDate)) {
      this.endDate = date;
      this.newDates.fromDate = this.startDate;
      this.newDates.toDate = this.endDate;
    } else {
      this.endDate = null;
      this.startDate = date;
    }
  }

  onCancel() {
    this.closeCalendar.emit();
  }

  onApply() {
    this.applyCalendar.emit(this.newDates);
  }
}
