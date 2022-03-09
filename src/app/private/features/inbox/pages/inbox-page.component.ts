import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';

@Component({
  selector: 'tsl-inbox-page',
  templateUrl: './inbox-page.component.html',
  styleUrls: ['./inbox-page.component.scss'],
})
export class InboxPageComponent implements OnInit {
  public tabsBarElements: TabsBarElement<PRIVATE_PATHS>[] = [
    { value: PRIVATE_PATHS.CHAT, label: $localize`:@@web_to_clean_messages:Messages` },
    { value: PRIVATE_PATHS.NOTIFICATIONS, label: $localize`:@@inbox_view_notifications_tab_label:Notifications` },
  ];
  public selectedTabsBarElement: TabsBarElement<PRIVATE_PATHS>;

  constructor(public router: Router, public featureFlagService: FeatureFlagService) {}

  public ngOnInit() {
    this.selectedTabsBarElement = this.tabsBarElements[0];
  }

  public onTabsBarChange(event: TabsBarElement<PRIVATE_PATHS>) {
    const route = event.value === PRIVATE_PATHS.CHAT ? PRIVATE_PATHS.CHAT : `${PRIVATE_PATHS.CHAT}/${event.value}`;
    this.router.navigate([route]);
  }
}
