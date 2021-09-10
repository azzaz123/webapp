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

  ngOnInit(): void {
    this.subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  public get bannerConfiguration(): WalletSharedErrorActionBannerConfigurationInterface {
    return {
      buttonText: $localize`:@@wallet_view_snackbar_generic_error_retry_button:Retry`,
      description: $localize`:@@wallet_view_snackbar_generic_error_description:¡Oops! Something has gone wrong. Please try again.`,
      dismissible: false,
      iconPath: '/assets/images/wallet/error-action/icon.svg',
      imagePath: '/assets/images/wallet/error-action/error.svg',
      type: BANNER_TYPES.DANGER,
    };
  }

  public doAction(): void {
    this.errorAction = null;
    const currentUrl = this.router.url;
    this.router.navigateByUrl(`${PRIVATE_PATHS.WALLET}/refresh`, { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  public get showContent(): boolean {
    return !this.errorAction;
  }

  public get showError(): boolean {
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
    this.errorActionSubscription = null;
  }
}
