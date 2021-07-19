import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '@core/user/user.service';
import { User } from '@core/user/user';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewOwnSaleItems } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { UserStats } from '@core/user/user-stats.interface';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { PERMISSIONS } from '@core/user/user-constants';
import { PRO_PATHS } from '@private/features/pro/pro-routing-constants';

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
  public readonly PRO_PATHS = PRO_PATHS;
  public isClickedProSection: boolean;

  constructor(
    private userService: UserService,
    public unreadChatMessagesService: UnreadChatMessagesService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.user = this.userService.user;
    this.userService.isProfessional().subscribe((value: boolean) => {
      this.isProfessional = value;
    });
    this.isClickedProSection = this.userService.isClickedProSection;
  }

  public onClickedProSection(): void {
    this.userService.setClickedProSection();
    this.isClickedProSection = true;
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
}
