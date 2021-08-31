import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { WalletSharedErrorActionService } from './../../services/wallet-shared-error-action.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'tsl-wallet-shared-error-action',
  templateUrl: './wallet-shared-error-action.component.html',
  styleUrls: ['./wallet-shared-error-action.component.scss'],
  providers: [WalletSharedErrorActionService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletSharedErrorActionComponent implements OnDestroy, OnInit {
  errorAction: unknown;
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

  private processErrorAction(errorAction: unknown): void {
    this.errorAction = errorAction;
    this.changeDetectionRef.detectChanges();
  }

  private subscribe(): void {
    this.errorActionSubscription = this.errorActionService.errorObserver.subscribe((errorAction: unknown) => {
      this.processErrorAction(errorAction);
    });
  }

  private unsubscribe(): void {
    this.errorActionSubscription?.unsubscribe();
  }
}
