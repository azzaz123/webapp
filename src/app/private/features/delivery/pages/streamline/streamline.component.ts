import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { STREAMLINE_PATHS } from '@private/features/delivery/pages/streamline/streamline.routing.constants';
import { StreamlineTrackingEventsService } from '@private/features/delivery/pages/streamline/services/streamline-tracking-events/streamline-tracking-events.service';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';

@Component({
  selector: 'tsl-streamline',
  templateUrl: './streamline.component.html',
  styleUrls: ['./streamline.component.scss'],
})
export class StreamlineComponent implements OnInit {
  public tabsBarElements: TabsBarElement<STREAMLINE_PATHS>[] = [
    { value: STREAMLINE_PATHS.ONGOING, label: $localize`:@@purchases_view_ongoing_tab_title:On going` },
    { value: STREAMLINE_PATHS.COMPLETED, label: $localize`:@@purchases_view_finished_tab_title:Completed` },
  ];

  public currentUrl: string;
  public retryUrl: string;
  public selectedTabsBarElement: TabsBarElement<STREAMLINE_PATHS>;

  constructor(private router: Router, private streamlineTrackingEventsService: StreamlineTrackingEventsService) {}

  ngOnInit() {
    this.assignUrls();
    this.selectedTabsBarElement = this.getSelectedTabByRoute();
    this.streamlineTrackingEventsService.trackViewStreamlineScreen();
  }

  public onTabsBarChange(tabsBarElement: TabsBarElement<STREAMLINE_PATHS>): void {
    this.assignUrls();
    this.redirect(tabsBarElement.value);
  }

  private assignUrls(): void {
    this.currentUrl = `${PRIVATE_PATHS.DELIVERY}/${this.isBuysPath ? DELIVERY_PATHS.BUYS : DELIVERY_PATHS.SELLS}`;
    this.retryUrl = `${PRIVATE_PATHS.DELIVERY}/${!this.isBuysPath ? DELIVERY_PATHS.BUYS : DELIVERY_PATHS.SELLS}`;
  }

  private getSelectedTabByRoute(): TabsBarElement<STREAMLINE_PATHS> {
    const currentUrlPath = this.router.url.split('?')[0].split('/').pop();

    const selectedTabsBarElement: TabsBarElement<STREAMLINE_PATHS> = this.tabsBarElements.find((t) => t.value === currentUrlPath);
    return selectedTabsBarElement ?? this.tabsBarElements[0];
  }

  private redirect(subroute: STREAMLINE_PATHS): void {
    const route: string = `${this.currentUrl}/${subroute}`;
    this.router.navigate([route]);
  }

  private get isBuysPath(): boolean {
    return this.router.url.indexOf(`/${DELIVERY_PATHS.BUYS}`) >= 0;
  }
}
