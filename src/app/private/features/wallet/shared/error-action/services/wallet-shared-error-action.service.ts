import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

@Injectable()
export class WalletSharedErrorActionService {
  private errorSubject: Subject<unknown> = new Subject<unknown>();

  public get errorObserver(): Observable<unknown> {
    return this.errorSubject.asObservable();
  }

  public show(data?: unknown): void {
    this.errorSubject.next(data);
  }
}
