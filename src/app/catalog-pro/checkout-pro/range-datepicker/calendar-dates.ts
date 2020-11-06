import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class CalendarDates {
  constructor(
    private _fromDate?: NgbDateStruct,
    private _toDate?: NgbDateStruct
  ) {}

  get fromDate(): NgbDateStruct {
    return this._fromDate;
  }

  set fromDate(value: NgbDateStruct) {
    this._fromDate = value;
  }

  get toDate(): NgbDateStruct {
    return this._toDate;
  }

  set toDate(value: NgbDateStruct) {
    this._toDate = value;
  }

  get formattedFromDate() {
    return new Date(
      this.fromDate.year,
      this.fromDate.month - 1,
      this.fromDate.day
    ).toLocaleDateString();
  }

  get formattedToDate() {
    return new Date(
      this.toDate.year,
      this.toDate.month - 1,
      this.toDate.day
    ).toLocaleDateString();
  }

  get numberOfDays() {
    return this.calculateDateDiff();
  }

  calculateDateDiff() {
    const dateFrom = new Date(
      this.fromDate.year,
      this.fromDate.month - 1,
      this.fromDate.day
    );
    const dateTo = new Date(
      this.toDate.year,
      this.toDate.month - 1,
      this.toDate.day
    );
    const timeDiff = Math.abs(dateTo.getTime() - dateFrom.getTime());
    const numOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return numOfDays;
  }
}
