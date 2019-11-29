import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs/Observer';
import { SplitTestUserInfo } from './split-test.interface';
import { environment } from '../../../environments/environment';

export enum WEB_PAYMENT_EXPERIMENT_TYPE {
  sabadell = 0,
  stripeV1 = 1,
  stripeV2 = 2
}

export const WEB_PAYMENT_EXPERIMENT_NAME = 'WebPaymentMethod';
export const WEB_PAYMENT_EXPERIMENT_PAGEVIEW_EVENT = 'StripeCheckoutPageView';
export const WEB_PAYMENT_EXPERIMENT_CLICK_EVENT = 'StripeCheckoutClick';
export const WEB_PAYMENT_EXPERIMENT_SUCCESSFUL_EVENT = 'StripeCheckoutSucessful';

@Injectable()
export class SplitTestService {

  getVariable<T = any>(name: string, defaultValue): Observable<any> {
    let experimentValue = this.isExperimentSet(name);
    
    if (experimentValue) {
      return Observable.of(experimentValue);
    } else {
      return Observable.create((observer: Observer<T>) => {
        Taplytics.variable(name, defaultValue, (value) => {
          sessionStorage.setItem(name, value);
          observer.next(value);
          observer.complete();
        });
      });
    }
  }

  getCodeBlock(name: string): Observable<void> {
    return Observable.create((observer: Observer<void>) => {
      Taplytics.codeBlock(name, () => {
        observer.next(null);
        observer.complete();
      });
    });
  }

  identify(userInfo: SplitTestUserInfo) {
    Taplytics.identify(userInfo);
  }

  reset() {
    Taplytics.reset();
  }

  track(eventName: string, value?: number, attributes?: any) {
    Taplytics.track(eventName, value, attributes);
  }

  private isExperimentSet(name: string): string {
    return sessionStorage.getItem(name);
  }

  init() {
    Taplytics.init(environment.taplytics);
  }

}
