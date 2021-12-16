import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { UserService } from '@core/user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { NavLink } from '@shared/nav-links/nav-link.interface';
import { DELIVERY_PATHS } from '../delivery-routing-constants';
import { TRXAwarenessModalComponent } from '../modals/trx-awareness-modal/trx-awareness-modal.component';

export const LOCAL_STORAGE_TRX_AWARENESS = 'trx-awareness';
@Component({
  selector: 'tsl-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
})
export class DeliveryComponent implements OnInit {
  readonly myShippingsNavLink: NavLink = {
    id: `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.STREAMLINE}`,
    display: $localize`:@@web_delivery_shippings_title:Shippings`,
  };
  readonly deliveryAddressNavLink: NavLink = {
    id: `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.ADDRESS}`,
    display: $localize`:@@web_delivery_shipping_address:Address`,
  };

  public navLinks: NavLink[] = [this.deliveryAddressNavLink];

  public selectedNavLinkId: string;

  constructor(
    private router: Router,
    private userService: UserService,
    private modalService: NgbModal,
    private featureflagService: FeatureFlagService
  ) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.selectedNavLinkId = this.navLinks.find((link) => e.url.startsWith(link.id))?.id;
      }
    });
  }

  ngOnInit(): void {
    this.showMyShippingsWhenDeliveryFeatureFlagEnabled();
    this.showTRXAwarenessModalForFirstTime();
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

  private showMyShippingsWhenDeliveryFeatureFlagEnabled(): void {
    this.featureflagService.getLocalFlag(FEATURE_FLAGS_ENUM.DELIVERY).subscribe((isActive: boolean) => {
      if (isActive) {
        this.navLinks = [this.myShippingsNavLink, this.deliveryAddressNavLink];
      }
    });
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
}
