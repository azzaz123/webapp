import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BANNER_TYPES } from '@shared/banner/banner-types.enum';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { WalletSharedErrorActionService } from './../../services/wallet-shared-error-action.service';
import { WalletSharedErrorActionBannerConfigurationInterface } from './../../interfaces/wallet-shared-error-action-banner-configuration.interface';

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

  constructor(
    private errorActionService: WalletSharedErrorActionService,
    private changeDetectionRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  ngOnInit(): void {
    this.subscribe();
  }

  get bannerConfiguration(): WalletSharedErrorActionBannerConfigurationInterface {
    return {
      buttonText: $localize`:@@wallet_shared_error_action_button:Retry`,
      description: $localize`:@@wallet_shared_error_action_message:Service unavailable temporarily. Try it later`,
      dismissible: false,
      type: BANNER_TYPES.DANGER,
    };
  }

  doAction(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl(`${PRIVATE_PATHS.WALLET}/refresh`, { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
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
