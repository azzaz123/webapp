import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { NavLink } from '@shared/nav-links/nav-link.interface';
import { WALLET_PATHS } from '../wallet-routing-constants';
import { KycInfoModalComponent } from '../modals/kyc-info-modal/kyc-info-modal.component';

@Component({
  selector: 'tsl-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent {
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

  public selectedNavLinkId: string;

  constructor(private router: Router, private modalService: NgbModal) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.selectedNavLinkId = this.navLinks.find((link) => e.url === link.id)?.id || this.getLastLocationIdThatMatch(e);
      }
    });
    this.openKYCSlider();
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
