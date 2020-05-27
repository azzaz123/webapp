import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy, NgZone } from '@angular/core';
import * as moment from 'moment';
import { interval, Subscription } from 'rxjs';

@Pipe({ name: 'dateCountdown', pure: false })
export class CountdownPipe implements PipeTransform, OnDestroy {
  private subscription: Subscription;

  constructor(changeDetectorRef: ChangeDetectorRef) {
    if (this.subscription) {
      return;
    }

    this.subscription = interval(1000).subscribe(() => {
      changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public transform(deadlineInMs: number): string {
    return this.formatRemainingTime(deadlineInMs);
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
