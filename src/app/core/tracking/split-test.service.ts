import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs/Observer';
import { SplitTestUserInfo } from './split-test.interface';
import { environment } from '../../../environments/environment';

@Injectable()
export class SplitTestService {

  getVariable(name: string, defaultValue): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      Taplytics.variable(name, defaultValue, (value) => {
        observer.next(value);
        observer.complete();
      });
    });
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

  init() {
    Taplytics.init(environment.taplytics);
  }

}
