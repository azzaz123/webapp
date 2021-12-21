import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
import { DELIVERY_PATHS } from '../../delivery-routing-constants';
import { StreamlineTrackingEventsService } from './services/streamline-tracking-events/streamline-tracking-events.service';
import { STREAMLINE_PATHS } from './streamline.routing.constants';

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

  public selectedTabsBarElement: TabsBarElement<STREAMLINE_PATHS>;

  constructor(private router: Router, private streamlineTrackingEventsService: StreamlineTrackingEventsService) {}

  ngOnInit() {
    this.selectedTabsBarElement = this.getSelectedTabByRoute();
    this.streamlineTrackingEventsService.trackViewStreamlineScreen();
  }

  public onTabsBarChange(tabsBarElement: TabsBarElement<STREAMLINE_PATHS>): void {
    this.redirect(tabsBarElement.value);
  }

  private redirect(subroute: STREAMLINE_PATHS): void {
    const route: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.STREAMLINE}/${subroute}`;
    this.router.navigate([route]);
  }

  private getSelectedTabByRoute(): TabsBarElement<STREAMLINE_PATHS> {
    const currentUrlPath = this.router.url.split('?')[0].split('/').pop();

    const selectedTabsBarElement: TabsBarElement<STREAMLINE_PATHS> = this.tabsBarElements.find((t) => t.value === currentUrlPath);
    return selectedTabsBarElement ?? this.tabsBarElements[0];
  }
}
