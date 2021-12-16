import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BANNER_TYPES } from '@shared/banner/banner-types.enum';
import { SharedErrorActionService } from '@shared/error-action/services/shared-error-action.service';
import { SharedErrorActionBannerConfigurationInterface } from '@shared/error-action/interfaces/shared-error-action-banner-configuration.interface';

import { Subscription } from 'rxjs';

@Component({
  selector: 'tsl-shared-error-action',
  templateUrl: './shared-error-action.component.html',
  styleUrls: ['./shared-error-action.component.scss'],
  providers: [SharedErrorActionService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedErrorActionComponent implements OnDestroy, OnInit {
  @Input() retryUrl: string;

  errorAction: unknown;
  private errorActionSubscription: Subscription;

  constructor(
    private errorActionService: SharedErrorActionService,
    private changeDetectionRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  public get bannerConfiguration(): SharedErrorActionBannerConfigurationInterface {
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
    const root: string = currentUrl.split('/').filter(Boolean).reverse().pop();
    const retryUrl: string = this.retryUrl ?? root;

    this.router.navigateByUrl(retryUrl, { skipLocationChange: true }).then(() => {
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
    debugger;
    this.errorActionSubscription = this.errorActionService.errorObserver.subscribe((errorAction: unknown) => {
      this.processErrorAction(errorAction);
    });
  }

  private unsubscribe(): void {
    debugger;
    this.errorActionSubscription?.unsubscribe();
    this.errorActionSubscription = null;
  }
}
