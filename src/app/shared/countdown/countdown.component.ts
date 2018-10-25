import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs/observable';
import { interval } from 'rxjs/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { I18nService } from '../../core/i18n/i18n.service';
import 'rxjs/add/operator/startWith';

@Component({
  selector: 'tsl-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {

  @Input() value: moment.MomentInput;
  @Input() format: string | 'listingFee'; // accept custom format and moment format: https://momentjs.com/docs/#/parsing/string-format

  public message: string;
  private counter$: Observable<number>;
  private counterSubscription: Subscription;

  constructor(
    private i18n: I18nService
  ) {
  }

  ngOnInit() {
    const lastTime = moment(this.value);
    let refreshRate = 1000;

    switch (this.format) {
      case 'listingFee':
        const duration = this.getDuration(lastTime);
        if (duration.asHours() > 1) {
          refreshRate = 60 * 1000;
        }
    }

    this.counter$ = interval(refreshRate)
      .startWith(0)
      .map(() => {
        const currentTime = moment();
        return lastTime.diff(currentTime);
      });

    this.counterSubscription = this.counter$.subscribe((diffTime) => {
      switch (this.format) {
        case 'listingFee':
          this.message = this.getListingFeeCountDownText(diffTime);
          break;

        default:
          this.message = moment.utc(diffTime).format(this.format);
      }

      if (this.counterSubscription && diffTime <= 0) {
        this.counterSubscription.unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    this.counterSubscription.unsubscribe();
  }

  private getDuration(lastValue: moment.MomentInput): moment.Duration {
    return moment.duration( moment(lastValue).valueOf() - new Date().getTime(), 'milliseconds');
  }

  private getListingFeeCountDownText (diffTime: number) {
    if (diffTime <= 0) { return ''; }

    const locale = this.i18n.locale;
    const duration = moment.duration(diffTime);
    let timeText = '';
    const durationDays = Math.floor(duration.asDays());
    const durationHours = Math.floor(duration.asHours());
    const durationMinutes = Math.floor(duration.asMinutes());
    if (durationDays >= 1) {
      timeText = `${durationDays} ${this.i18n.getTranslations('day')}${durationDays === 1 ? '' : 's' }`;
    } else if (durationHours >= 1) {
      timeText = `${durationHours} ${this.i18n.getTranslations('hour')}${durationHours === 1 ? '' : 's' }`;
    } else {
      timeText = `${durationMinutes} ${this.i18n.getTranslations('minute')}${durationMinutes === 1 ? '' : 's' }`;
    }
    return locale === 'en' ? `${timeText} ${this.i18n.getTranslations('left')}` : `${this.i18n.getTranslations('left')} ${timeText}`;
  }
}
