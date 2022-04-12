import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { UserService } from '@core/user/user.service';
import { User } from '@core/user/user';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickWallet,
  SCREEN_IDS,
  ViewOwnSaleItems,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { UserStats } from '@core/user/user-stats.interface';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { PERMISSIONS } from '@core/user/user-constants';
import { PRO_PATHS } from '@private/features/pro/pro-routing-constants';
import { SidebarService } from '../core/services/sidebar.service';
import { Observable } from 'rxjs';
import { DeviceService } from '@core/device/device.service';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { NotificationApiService } from '@api/notification/notification-api.service';
import { SidebarNavigationProfileElement } from '../interfaces/sidebar-navigation-profile-element.interface';

@Component({
  selector: 'tsl-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  @Input() isProducts: boolean;
  @Input() isProfile: boolean;

  public readonly PRIVATE_PATHS = PRIVATE_PATHS;
  public user: User;
  public isProfessional: boolean;
  public readonly PERMISSIONS = PERMISSIONS;
  public readonly PRO_PATHS = PRO_PATHS;
  public readonly collapsed$: Observable<boolean> = this.sidebarService.sidebarCollapsed$;
  public readonly isTouchDevice: boolean = this.deviceService.isTouchDevice();
  public readonly helpUrl = this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.HOME);
  public isClickedProSection: boolean;

  public readonly profileNavigationElement$: Observable<SidebarNavigationProfileElement> = this.sidebarService.profileNavigationElement$;

  constructor(
    private sidebarService: SidebarService,
    private userService: UserService,
    public unreadChatMessagesService: UnreadChatMessagesService,
    public notificationApiService: NotificationApiService,
    private analyticsService: AnalyticsService,
    private deviceService: DeviceService,
    private customerHelpService: CustomerHelpService
  ) {}

  ngOnInit() {
    this.user = this.userService.user;
    this.userService.isProfessional().subscribe((value: boolean) => {
      this.isProfessional = value;
    });
    this.isClickedProSection = this.userService.isClickedProSection;
  }

  public toggleCollapse(): void {
    this.sidebarService.toggleCollapse();
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
          isPro: this.userService.isPro,
        },
      };
      this.analyticsService.trackPageView(event);
    });
  }

  public trackClickToWallet(): void {
    const event: AnalyticsEvent<ClickWallet> = {
      name: ANALYTICS_EVENT_NAMES.ClickWallet,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.MyProfileMenu,
      },
    };
    this.analyticsService.trackEvent(event);
  }
}
