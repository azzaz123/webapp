import { Injectable } from '@angular/core';

import { WalletSharedErrorActionInterface } from './../interfaces/wallet-shared-error-action.interface';
import { WalletSharedErrorActionKeyEnum } from './../enums/wallet-shared-error-action-key.enum';
import { WalletSharedErrorActionModel } from './../models/wallet-shared-error-action.model';

import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WalletSharedErrorActionService {
  private errorSubject: Subject<WalletSharedErrorActionInterface> = new Subject<WalletSharedErrorActionInterface>();

  public get errorObserver(): Observable<WalletSharedErrorActionInterface> {
    return this.errorSubject.asObservable();
  }

  public show(key: WalletSharedErrorActionKeyEnum, value?: unknown): void {
    this.errorSubject.next(new WalletSharedErrorActionModel(key, value));
  }
}
