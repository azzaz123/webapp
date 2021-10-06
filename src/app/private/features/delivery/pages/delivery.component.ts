import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { NavLink } from '@shared/nav-links/nav-link.interface';
import { DELIVERY_PATHS } from '../delivery-routing-constants';

@Component({
  selector: 'tsl-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
})
export class DeliveryComponent {
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

  constructor(private router: Router) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.selectedNavLinkId = this.navLinks.find((link) => e.url.startsWith(link.id))?.id;
      }
    });
  }

  public onNavLinkClicked(navLinkId: string): void {
    this.router.navigate([navLinkId]);
  }
}
