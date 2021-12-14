import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
  public navLinks: NavLink[] = [
    {
      id: `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.STREAMLINE}`,
      display: $localize`:@@web_delivery_streamline_title:Shippings`,
    },
    {
      id: `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.ADDRESS}`,
      display: $localize`:@@web_delivery_shipping_address:Address`,
    },
  ];

  public selectedNavLinkId: string;

  constructor(private router: Router, private userService: UserService, private modalService: NgbModal) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.selectedNavLinkId = this.navLinks.find((link) => e.url.startsWith(link.id))?.id;
      }
    });
  }

  ngOnInit(): void {
    if (this.shouldShowTRXAwarenessModal) {
      this.userService.saveLocalStore(LOCAL_STORAGE_TRX_AWARENESS, Date.now().toString());
      this.openTRXAwarenessModal();
    }
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

  private get shouldShowTRXAwarenessModal(): boolean {
    return !this.userService.getLocalStore(LOCAL_STORAGE_TRX_AWARENESS);
  }
}
