import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs/Observer';
import { SplitTestUserInfo } from './split-test.interface';

@Injectable()
export class SplitTestService {

  getVariable(name: string, defaultValue: string): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      Taplytics.variable(name, defaultValue, (value: string) => {
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

}
