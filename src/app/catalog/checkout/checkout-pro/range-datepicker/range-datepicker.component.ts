import { Component, OnInit, Input, EventEmitter, Output, Injectable } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { I18nService } from '../../../../core/i18n/i18n.service';
import { SelectedDates } from './selected-dates.interface';

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
  selectedDates: SelectedDates;
  numberOfDays;
  model;

  @Input() bumpType: string;
  @Input() fromDate: NgbDateStruct;
  @Input() toDate: NgbDateStruct;
  @Output() closeCalendar: EventEmitter<any> = new EventEmitter();
  @Output() applyCalendar: EventEmitter<SelectedDates> = new EventEmitter();

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);

  constructor(private calendar: NgbCalendar) {
    this.minDate = { year: calendar.getToday().year, month: calendar.getToday().month, day: calendar.getToday().day };
  }

  ngOnInit() {
    if (this.fromDate && this.toDate) {
      this.calculateDateDiff();
    } else {
      this.numberOfDays = 0;
    }
  }

  onDateSelection(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
      this.calculateDateDiff();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  onCancel() {
    this.closeCalendar.emit();
  }

  onApply() {
    this.selectedDates = {
      fromDate: this.fromDate,
      formattedFromDate: new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day).toLocaleDateString(),
      toDate: this.toDate,
      formattedToDate: new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day).toLocaleDateString(),
      numberOfDays: this.numberOfDays
    };
    this.applyCalendar.emit(this.selectedDates);
  }

  calculateDateDiff() {
    const dateFrom = new Date(this.fromDate.year, this.fromDate.month, this.fromDate.day);
    const dateTo = new Date(this.toDate.year, this.toDate.month, this.toDate.day);
    const timeDiff = Math.abs(dateTo.getTime() - dateFrom.getTime());
    this.numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
}
