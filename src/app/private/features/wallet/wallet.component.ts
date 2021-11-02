import { ChangeDetectionStrategy, Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import {
  CUSTOMER_HELP_BASE,
  CUSTOMER_HELP_PAGE,
  ITALIAN_CUSTOMER_HELP_PAGE,
} from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { KYCBannerSpecifications } from '@api/core/model/kyc-properties/interfaces/kyc-banner-specifications.interface';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';
import { NavLink } from '@shared/nav-links/nav-link.interface';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { WALLET_PATHS } from './wallet.routing.constants';
import { WalletTrackingEventService } from '@private/features/wallet/services/tracking-event/wallet-tracking-event.service';

import { Observable, Subscription } from 'rxjs';
import { APP_LOCALE } from '@configs/subdomains.config';

const bankDetailsId: string = `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BANK_DETAILS}`;

@Component({
  selector: 'tsl-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletComponent implements OnInit, OnDestroy {
  public KYCProperties$: Observable<KYCProperties>;
  public selectedNavLinkId: string;
  public navLinks: NavLink[] = [
    {
      id: `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BALANCE}`,
      display: $localize`:@@profile_menu_wallet:Wallet`,
    },
    {
      id: bankDetailsId,
      display: $localize`:@@web_delivery_bank_details:Bank details`,
    },
    {
      id: `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.HISTORY}`,
      display: $localize`:@@wallet_view_balance_history_title_web_specific:Movements`,
    },
  ];
  public WALLET_HELP_URL: string;
  private subscriptions: Subscription = new Subscription();

  constructor(
    @Inject(LOCALE_ID) private locale: APP_LOCALE,
    private router: Router,
    private customerHelpService: CustomerHelpService,
    private kycPropertiesService: KYCPropertiesService,
    private walletTrackingEventService: WalletTrackingEventService
  ) {
    this.subscriptions.add(kycPropertiesService.get().subscribe());
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.selectedNavLinkId = this.navLinks.find((link) => e.url === link.id)?.id || this.getLastLocationIdThatMatch(e);
      }
    });
  }

  ngOnInit() {
    this.KYCProperties$ = this.kycPropertiesService.KYCProperties$;
    this.WALLET_HELP_URL = this.getHelpURL();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public KYCBannerSpecifications$(properties: KYCProperties): Observable<KYCBannerSpecifications> {
    return this.kycPropertiesService.getBannerSpecificationsFromProperties(properties);
  }

  public onNavLinkClicked(navLinkId: string): void {
    this.trackClickBankDetails(navLinkId);
    this.router.navigate([navLinkId]);
  }

  public trackClickHelpWallet(): void {
    this.walletTrackingEventService.trackClickHelpWallet();
  }

  private getLastLocationIdThatMatch(e: NavigationEnd): string {
    return this.navLinks
      .filter((link) => e.url.startsWith(link.id))
      ?.slice(-1)
      .pop()?.id;
  }

  private trackClickBankDetails(navLinkId: string): void {
    if (navLinkId !== bankDetailsId) {
      return;
    }
    this.walletTrackingEventService.trackClickBankDetails();
  }

  private getHelpURL(): string {
    const isItalianSite = this.locale === 'it';
    return isItalianSite
      ? this.customerHelpService.getPageUrl(ITALIAN_CUSTOMER_HELP_PAGE.WALLET_HELP, CUSTOMER_HELP_BASE.ITALIAN_SITE)
      : this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.WALLET_HELP);
  }
}
