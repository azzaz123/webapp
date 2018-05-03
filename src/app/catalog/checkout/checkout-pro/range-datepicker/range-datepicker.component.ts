import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CalendarDates } from './calendar-dates';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;

@Component({
  selector: 'tsl-range-datepicker',
  templateUrl: './range-datepicker.component.html',
  styleUrls: ['./range-datepicker.component.scss']
})
export class RangeDatepickerComponent implements OnInit {

  hoveredDate: NgbDateStruct;
  minDate: NgbDateStruct;
  selectedDates: CalendarDates;

  @Input() bumpType: string;
  @Input() fromDate: NgbDateStruct;
  @Input() toDate: NgbDateStruct;
  @Output() closeCalendar: EventEmitter<any> = new EventEmitter();
  @Output() applyCalendar: EventEmitter<CalendarDates> = new EventEmitter();

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);

  constructor(private calendar: NgbCalendar) {
    this.minDate = { year: calendar.getToday().year, month: calendar.getToday().month, day: calendar.getToday().day };
  }

  ngOnInit() {
  }

  onDateSelection(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
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
    };
    console.log(this.selectedDates);
    this.applyCalendar.emit(this.selectedDates);
  }
}
