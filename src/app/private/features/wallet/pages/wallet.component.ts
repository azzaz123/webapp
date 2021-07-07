import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { NavLink } from '@shared/nav-links/nav-link.interface';
import { Observable } from 'rxjs';
import { KYCBannerSpecifications } from '../interfaces/kyc/kyc-banner.interface';
import { KycBannerService } from '../services/kyc-banner/kyc-banner.service';
import { WALLET_PATHS } from '../wallet-routing-constants';
import { KycInfoModalComponent } from '../modals/kyc-info-modal/kyc-info-modal.component';

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
      id: `/${PRIVATE_PATHS.WALLET}`,
      display: $localize`:@@profile_menu_wallet:Wallet`,
    },
    {
      id: `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BANK_DETAILS}`,
      display: $localize`:@@web_delivery_bank_details:Bank details`,
    },
  ];

  constructor(private router: Router, private modalService: NgbModal, private kycBannerService: KycBannerService) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.selectedNavLinkId = this.navLinks.find((link) => e.url === link.id)?.id || this.getLastLocationIdThatMatch(e);
      }
    });
  }

  ngOnInit() {
    this.kycBannerSpecifications$ = this.kycBannerService.getSpecifications();
  }

  public openKYCSlider(): void {
    this.modalService.open(KycInfoModalComponent).result.then(() => {});
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
