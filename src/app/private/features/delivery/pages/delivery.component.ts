import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from '@core/user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { NavLink } from '@shared/nav-links/nav-link.interface';
import { Subscription } from 'rxjs';
import { DELIVERY_PATHS } from '../delivery-routing-constants';
import { TRXAwarenessModalComponent } from '../modals/trx-awareness-modal/trx-awareness-modal.component';

export const LOCAL_STORAGE_TRX_AWARENESS = 'trx-awareness';
export const DELIVERY_TRACKING_PATH: string = `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}`;
export const NO_NAV_LINK_SELECTED: string = 'nonSelected';
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

  public navLinks: NavLink[] = [this.buysNavLink, this.sellsNavLink, this.completedNavLink, this.deliveryAddressNavLink];

  public selectedNavLinkId: string;
  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router, private userService: UserService, private modalService: NgbModal) {
    this.subscriptions.add(
      router.events.subscribe((event) => {
        if (event instanceof NavigationEnd && this.navLinks) {
          const defaultUrl: string = this.buysNavLink.id;
          const isDefaultUrlSelected: boolean = event.urlAfterRedirects === defaultUrl;

          this.selectNavLink(isDefaultUrlSelected ? defaultUrl : event.url);
        }
      })
    );
  }

  ngOnInit(): void {
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
    const isTrackingPage: boolean = routeURL.startsWith(DELIVERY_TRACKING_PATH);

    if (isTrackingPage) {
      this.selectedNavLinkId = NO_NAV_LINK_SELECTED;
    } else {
      this.selectedNavLinkId = this.navLinks.find((link) => routeURL.startsWith(link.id))?.id;
    }
  }
}
