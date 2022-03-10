import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import { NotificationApiService } from '@api/notification/notification-api.service';
import { Subscription } from 'rxjs';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';

@Component({
  selector: 'tsl-inbox-page',
  templateUrl: './inbox-page.component.html',
  styleUrls: ['./inbox-page.component.scss'],
})
export class InboxPageComponent implements OnInit, OnDestroy {
  public tabsBarElements: TabsBarElement<PRIVATE_PATHS>[] = [
    { value: PRIVATE_PATHS.CHAT, label: $localize`:@@web_to_clean_messages:Messages`, hasBullet: false },
    {
      value: PRIVATE_PATHS.NOTIFICATIONS,
      label: $localize`:@@inbox_view_notifications_tab_label:Notifications`,
      hasBullet: false,
    },
  ];

  public selectedTabsBarElement: TabsBarElement<PRIVATE_PATHS>;

  private componentSubscriptions: Subscription[] = [];

  constructor(
    public router: Router,
    public featureFlagService: FeatureFlagService,
    private unreadChatMessagesService: UnreadChatMessagesService,
    private notificationApiService: NotificationApiService
  ) {}

  public ngOnInit() {
    this.selectedTabsBarElement = this.getCurrentTabBar();
    this.componentSubscriptions.push(
      this.unreadChatMessagesService.totalUnreadMessages$.subscribe((unreadMessages) => {
        const hasBullet: boolean = !!unreadMessages;
        let messagesTab = this.tabsBarElements.find((t) => t.value === PRIVATE_PATHS.CHAT);
        messagesTab.hasBullet = hasBullet;
        this.tabsBarElements = [...this.tabsBarElements];
      })
    );

    this.componentSubscriptions.push(
      this.notificationApiService.unreadNotificationsCount$.subscribe((unreadNotifications) => {
        const hasBullet: boolean = !!unreadNotifications;
        let notificationsTab = this.tabsBarElements.find((t) => t.value === PRIVATE_PATHS.NOTIFICATIONS);
        notificationsTab.hasBullet = hasBullet;
        this.tabsBarElements = [...this.tabsBarElements];
      })
    );
  }

  public onTabsBarChange(event: TabsBarElement<PRIVATE_PATHS>) {
    const route = event.value === PRIVATE_PATHS.CHAT ? PRIVATE_PATHS.CHAT : `${PRIVATE_PATHS.CHAT}/${event.value}`;
    this.router.navigate([route]);
  }

  ngOnDestroy(): void {
    this.componentSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  private getCurrentTabBar(): TabsBarElement<PRIVATE_PATHS> {
    const isNotifications = this.router.url.includes(this.tabsBarElements[1].value);
    return isNotifications ? this.tabsBarElements[1] : this.tabsBarElements[0];
  }
}
