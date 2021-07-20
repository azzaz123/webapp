import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { NavLink } from '@shared/nav-links/nav-link.interface';
import { Observable } from 'rxjs';
import { KYCBannerSpecifications } from './interfaces/kyc/kyc-banner.interface';
import { KYCBannerService } from './services/kyc-banner/kyc-banner.service';
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

  //FIXME: These will be moved into a service
  public zendeskWalletHelpArticleId: number = 360017172677;
  public zendeskWalletHelpURL = `https://ayuda.wallapop.com/hc/es-es/articles/${this.zendeskWalletHelpArticleId}`;

  constructor(private router: Router, private kycBannerService: KYCBannerService) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.selectedNavLinkId = this.navLinks.find((link) => e.url === link.id)?.id || this.getLastLocationIdThatMatch(e);
      }
    });
  }

  ngOnInit() {
    this.kycBannerSpecifications$ = this.kycBannerService.getSpecifications();
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
