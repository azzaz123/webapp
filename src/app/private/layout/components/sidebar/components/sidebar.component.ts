import { Component, Input, OnInit } from '@angular/core';
import { LOCAL_STORAGE_CLICK_PRO_SECTION, UserService } from '@core/user/user.service';
import { User } from '@core/user/user';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewOwnSaleItems } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { UserStats } from '@core/user/user-stats.interface';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { PERMISSIONS } from '@core/user/user-constants';

@Component({
  selector: 'tsl-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public readonly PRIVATE_PATHS = PRIVATE_PATHS;
  public user: User;
  @Input() isProducts: boolean;
  @Input() isProfile: boolean;
  public isProfessional: boolean;
  public readonly PERMISSIONS = PERMISSIONS;

  constructor(
    public userService: UserService,
    public unreadChatMessagesService: UnreadChatMessagesService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.user = this.userService.user;
    this.userService.isProfessional().subscribe((value: boolean) => {
      this.isProfessional = value;
    });
  }

  public trackClickToCatalog(): void {
    if (this.isProfessional) {
      return;
    }
    this.userService.getStats().subscribe((userStats: UserStats) => {
      const event: AnalyticsPageView<ViewOwnSaleItems> = {
        name: ANALYTICS_EVENT_NAMES.ViewOwnSaleItems,
        attributes: {
          screenId: SCREEN_IDS.MyCatalog,
          numberOfItems: userStats.counters.publish,
          proSubscriptionBanner: this.userService.suggestPro(),
        },
      };
      this.analyticsService.trackPageView(event);
    });
  }

  public onSaveProSectionClick(): void {
    localStorage.setItem(`${this.user.id}-${LOCAL_STORAGE_CLICK_PRO_SECTION}`, 'true');
  }
}
