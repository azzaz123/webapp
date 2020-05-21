/* angular2-moment (c) 2015, 2016 Uri Shaked / MIT Licence */

import {Pipe, ChangeDetectorRef, PipeTransform, OnDestroy, NgZone} from '@angular/core';
import * as moment from 'moment';

// under systemjs, moment is actually exported as the default export, so we account for that
const momentConstructor: (value?: any) => moment.Moment = (<any>moment).default || moment;

@Pipe({name: 'amCountdown', pure: false})
export class CountdownPipe implements PipeTransform, OnDestroy {
	private currentTimer: number;

	private lastTime: number;
	private lastValue: moment.Duration;
	private lastOmitSuffix: boolean;
	private lastText: string;

	constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone) {
	}

	transform(value: Date | moment.Moment, omitSuffix?: boolean): string {
		if (this.hasChanged(value, omitSuffix)) {
			this.lastTime = this.getTime(value);
			this.lastValue = moment.duration(this.lastTime - new Date().getTime(), 'milliseconds');
			this.lastOmitSuffix = omitSuffix;
			this.removeTimer();
			this.createTimer();
			if (this.lastValue.asHours() < 0) {
				this.lastText = '00h 00m 00s';
			} else {
				this.lastText =  this.formatText(this.lastValue);
			}
		} else {
			this.createTimer();
		}

		return this.lastText;
	}

	ngOnDestroy(): void {
		this.removeTimer();
	}

	private pad(value: number): string {
		if (value < 10) {
			return '0' + value;
		}
		return value.toString();
	}

	private formatText(value: moment.Duration) {
	  let text = '';
	  let days = Math.floor(this.lastValue.asDays());
	  let hours = this.lastValue.hours();
	  let minutes = this.lastValue.minutes();
	  let seconds = this.lastValue.seconds();
    if (days > 0) {
      text += this.pad(days) + 'd ';
    }
    text += this.pad(hours) + 'h ';
    text += this.pad(minutes) + 'm ';
    text += this.pad(seconds) + 's';
    return text;
  }


	private createTimer() {
		if (this.currentTimer) {
			return;
		}
		this.currentTimer = this.ngZone.runOutsideAngular(() => {
			if (typeof window !== 'undefined') {
				return window.setTimeout(() => {
					this.lastValue = moment.duration(this.lastValue.asMilliseconds() - 1000, 'milliseconds');
					if (this.lastText === '00h 00m 00s') {
						this.removeTimer();
					} else {
						this.lastText = this.formatText(this.lastValue);
					}
					this.currentTimer = null;
					this.ngZone.run(() => this.cdRef.markForCheck());
				}, 1000);
			}
		});
	}


	private removeTimer() {
		if (this.currentTimer) {
			window.clearTimeout(this.currentTimer);
			this.currentTimer = null;
		}
	}

	private hasChanged(value: Date | moment.Moment, omitSuffix?: boolean) {
		return this.getTime(value) !== this.lastTime || omitSuffix !== this.lastOmitSuffix;
	}

	private getTime(value: Date | moment.Moment) {
		if (moment.isDate(value)) {
			return value.getTime();
		} else if (moment.isMoment(value)) {
			return value.valueOf();
		} else {
			return momentConstructor(value).valueOf();
		}
	}
}
