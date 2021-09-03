import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { KYCBannerSpecifications } from '@api/core/model/kyc-properties/kyc-banner-specifications.interface';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { NavLink } from '@shared/nav-links/nav-link.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WALLET_PATHS } from './wallet.routing.constants';

@Component({
  selector: 'tsl-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  public kycBannerSpecifications$: Observable<KYCBannerSpecifications>;
  public selectedNavLinkId: string;
  public navLinks: NavLink[] = [
    {
      id: `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BALANCE}`,
      display: $localize`:@@profile_menu_wallet:Wallet`,
    },
    {
      id: `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BANK_DETAILS}`,
      display: $localize`:@@web_delivery_bank_details:Bank details`,
    },
  ];
  public ZENDESK_WALLET_HELP_URL: string = this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.WALLET_HELP);

  constructor(private router: Router, private kycStatusService: KYCPropertiesService, private customerHelpService: CustomerHelpService) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.selectedNavLinkId = this.navLinks.find((link) => e.url === link.id)?.id || this.getLastLocationIdThatMatch(e);
      }
    });
  }

  ngOnInit() {
    this.kycBannerSpecifications$ = this.kycStatusService.getBannerSpecifications();
  }

  public onNavLinkClicked(navLinkId: string): void {
    this.router.navigate([navLinkId]);
  }

  private getLastLocationIdThatMatch(e: NavigationEnd): string {
    return this.navLinks
      .filter((link) => e.url.startsWith(link.id))
      ?.slice(-1)
      .pop()?.id;
  }
}
