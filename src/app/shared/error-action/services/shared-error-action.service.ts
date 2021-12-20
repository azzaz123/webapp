import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

const NotFound: number = 404;

@Injectable()
export class SharedErrorActionService {
  private errorSubject: Subject<unknown> = new Subject<unknown>();

  public get errorObserver(): Observable<unknown> {
    return this.errorSubject.asObservable();
  }

  public show(data?: unknown): void {
    if (this.hasToBeShowed(data)) {
      this.errorSubject.next(data);
    }
  }

  private hasToBeShowed(data: unknown): boolean {
    const status = (!!data && (data as HttpErrorResponse).status) ?? 0;

    return status !== NotFound;
  }
}
