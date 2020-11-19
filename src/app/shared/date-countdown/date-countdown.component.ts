import { format } from 'libphonenumber-js/custom';
import { Component, Input, OnInit } from '@angular/core';

import * as moment from 'moment';
import { interval, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'tsl-date-countdown',
  templateUrl: 'date-countdown.component.html',
  styleUrls: ['./date-countdown.component.scss'],
})
export class DateCountDownComponent implements OnInit {
  @Input() dateEndTimestamp: number;

  countDown$: Observable<string>;

  ngOnInit(): void {
    this.countDown$ = interval(1000).pipe(
      startWith(0),
      map(() => this.formatRemainingTime(this.dateEndTimestamp))
    );
  }

  private formatRemainingTime(deadlineInMs: number): string {
    let remainingMilliseconds = deadlineInMs - Date.now();
    if (remainingMilliseconds < 0) {
      remainingMilliseconds = 0;
    }
    const output = [];
    const duration = moment.duration(remainingMilliseconds, 'milliseconds');
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    if (days > 0) {
      output.push(`${this.pad(days)}d`);
    }
    output.push(`${this.pad(hours)}h`);
    output.push(`${this.pad(minutes)}m`);
    output.push(`${this.pad(seconds)}s`);

    return output.join(' ');
  }

  private pad(value: number): string {
    if (value < 10) {
      return `0${value}`;
    }
    return value.toString();
  }
}
