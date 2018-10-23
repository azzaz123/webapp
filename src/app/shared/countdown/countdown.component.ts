import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs/observable';
import { interval } from 'rxjs/observable/interval';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'tsl-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {

  @Input() value: moment.MomentInput;
  @Input() format: string;

  public countdownText: string;
  private counter$: Observable<moment.Duration>;
  private counterSubscription: Subscription;

  constructor() {
  }

  ngOnInit() {
    this.counter$ = interval(1000).map(() => {
      return this.getDuration(this.value);
    });

    this.counterSubscription = this.counter$.subscribe((duration) => {
      if (duration.asMilliseconds() <= 0) {
        this.counterSubscription.unsubscribe();
      }
      switch (this.format) {
        case 'listingFee':
          this.countdownText = this.getListingFeeDurationFormat(duration);
          break;
      }
    });
  }

  ngOnDestroy() {
    this.counterSubscription.unsubscribe();
  }

  private getDuration(lastValue: moment.MomentInput): moment.Duration {
    return moment.duration( moment(lastValue).valueOf() - new Date().getTime(), 'milliseconds');
  }

  private getListingFeeDurationFormat(duration: moment.Duration): string {
    const durationDays = Math.floor(duration.asDays());
    if (durationDays > 0) {
      return `Quedan ${durationDays} dias`;
    } else {
      const durationHours = duration.hours();
      const durationMinutes = duration.minutes();
      return `Quedan ${durationHours}h ${durationMinutes}m`;
    }
  }

}
