import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { UserService } from '@core/user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { NavLink } from '@shared/nav-links/nav-link.interface';
import { Subscription } from 'rxjs';
import { DELIVERY_PATHS } from '../delivery-routing-constants';
import { TRXAwarenessModalComponent } from '../modals/trx-awareness-modal/trx-awareness-modal.component';

export const LOCAL_STORAGE_TRX_AWARENESS = 'trx-awareness';
@Component({
  selector: 'tsl-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
})
export class DeliveryComponent implements OnInit, OnDestroy {
  readonly buysNavLink: NavLink = {
    id: `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.BUYS}`,
    display: $localize`:@@you_menu_purchases_label:Purchases`,
  };
  readonly sellsNavLink: NavLink = {
    id: `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.SELLS}`,
    display: $localize`:@@you_menu_sales_label:Sales`,
  };
  readonly completedNavLink: NavLink = {
    id: `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.COMPLETED}`,
    display: $localize`:@@purchases_view_finished_tab_title:Completed`,
  };
  readonly deliveryAddressNavLink: NavLink = {
    id: `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.ADDRESS}`,
    display: $localize`:@@web_delivery_shipping_address:Address`,
  };

  public navLinks: NavLink[] = [this.deliveryAddressNavLink];

  public selectedNavLinkId: string;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private userService: UserService,
    private modalService: NgbModal,
    private featureflagService: FeatureFlagService
  ) {
    this.subscriptions.add(
      router.events.subscribe((e) => {
        if (e instanceof NavigationEnd && this.navLinks) {
          this.selectNavLink(e.url);
        }
      })
    );
  }

  ngOnInit(): void {
    this.showStreamlineWhenDeliveryFeatureFlagEnabled();
    this.showTRXAwarenessModalForFirstTime();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onNavLinkClicked(navLinkId: string): void {
    this.router.navigate([navLinkId]);
  }

  public openTRXAwarenessModal(): void {
    this.modalService.open(TRXAwarenessModalComponent).result.then(
      () => {},
      () => {}
    );
  }

  private showStreamlineWhenDeliveryFeatureFlagEnabled(): void {
    this.subscriptions.add(
      this.featureflagService.getLocalFlag(FEATURE_FLAGS_ENUM.DELIVERY).subscribe((isActive: boolean) => {
        if (isActive) {
          this.navLinks = [this.buysNavLink, this.sellsNavLink, this.completedNavLink, this.deliveryAddressNavLink];
        }
        this.selectNavLink(this.router.url);
      })
    );
  }

  private showTRXAwarenessModalForFirstTime(): void {
    if (this.shouldShowTRXAwarenessModal) {
      this.userService.saveLocalStore(LOCAL_STORAGE_TRX_AWARENESS, Date.now().toString());
      this.openTRXAwarenessModal();
    }
  }

  private get shouldShowTRXAwarenessModal(): boolean {
    return !this.userService.getLocalStore(LOCAL_STORAGE_TRX_AWARENESS);
  }

  private selectNavLink(routeURL: string): void {
    this.selectedNavLinkId = this.navLinks.find((link) => routeURL.startsWith(link.id))?.id;
  }
}
