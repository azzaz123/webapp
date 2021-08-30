import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { WalletSharedErrorActionInterface } from './../../interfaces/wallet-shared-error-action.interface';
import { WalletSharedErrorActionService } from './../../services/wallet-shared-error-action.service';

import { Subscription } from 'rxjs';
import { WalletSharedErrorActionModel } from '../../models/wallet-shared-error-action.model';

@Component({
  selector: 'tsl-wallet-shared-error-action',
  templateUrl: './wallet-shared-error-action.component.html',
  styleUrls: ['./wallet-shared-error-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletSharedErrorActionComponent implements OnDestroy, OnInit {
  @Input()
  key: string;

  errorAction: WalletSharedErrorActionInterface;
  private errorActionSubscription: Subscription;

  constructor(private errorActionService: WalletSharedErrorActionService, private changeDetectionRef: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  ngOnInit(): void {
    this.subscribe();
  }

  get showContent(): boolean {
    return !this.errorAction;
  }

  get showError(): boolean {
    return !!this.errorAction;
  }

  private processErrorAction(errorAction: WalletSharedErrorActionInterface): void {
    console.log(`Error Action: ${JSON.stringify(errorAction)}`);
    console.log(`Key: ${this.key}`);
    if (!this.key || this.key === errorAction.key) {
      this.errorAction = errorAction;
      this.changeDetectionRef.detectChanges();
    }
  }

  private subscribe(): void {
    this.errorActionSubscription = this.errorActionService.errorObserver.subscribe((errorAction: WalletSharedErrorActionInterface) => {
      this.processErrorAction(errorAction);
    });
  }

  private unsubscribe(): void {
    this.errorActionSubscription?.unsubscribe();
  }
}
