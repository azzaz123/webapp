import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AnalyticsPageView, ViewNotificationCenter, ANALYTICS_EVENT_NAMES, SCREEN_IDS } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NOTIFICATION_VARIANT } from '../../core/enums/notification-variant.enum';
import { Notification } from '@api/core/model/notification/notification.interface';
import { NotificationsInboxComponent } from './notifications-inbox.component';
import { NotificationApiService } from '@api/notification/notification-api.service';
import { BehaviorSubject } from 'rxjs';

describe('NotificationsInboxComponent', () => {
  let component: NotificationsInboxComponent;
  let fixture: ComponentFixture<NotificationsInboxComponent>;
  let analyticsService: AnalyticsService;
  let element: HTMLElement;

  const notifications: Notification[] = [
    {
      variant: NOTIFICATION_VARIANT.GENERAL,
      productStatus: undefined,
      isRead: true,
      date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 60000),
      title: 'My general notification',
      description: 'Cupidatat ad nostrud cillum',
      image: 'https://picsum.photos/200/300',
      url: 'https://es.wallapop.com',
      id: 'id',
    },
  ];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, NgxPermissionsModule.forRoot()],
        providers: [
          {
            provide: AnalyticsService,
            useValue: {
              trackPageView: () => {},
              trackEvent: () => {},
            },
          },
          {
            provide: NotificationApiService,
            useValue: {
              notifications$: new BehaviorSubject(notifications).asObservable(),
              notificationsCount: 1,
              unreadNotificationsCount: 0,
              refreshNotifications: () => {},
              logContentCardsDisplayed: () => {},
            },
          },
        ],
        declarations: [NotificationsInboxComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsInboxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    analyticsService = TestBed.inject(AnalyticsService);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('init', () => {
    beforeEach(fakeAsync(() => {
      spyOn(component, 'trackViewNotificationCenter').and.callThrough();
      spyOn(analyticsService, 'trackPageView').and.callThrough();
      component.ngOnInit();
      tick();
      fixture.detectChanges();
      tick(2000);
    }));

    const event: AnalyticsPageView<ViewNotificationCenter> = {
      name: ANALYTICS_EVENT_NAMES.ViewNotificationCenter,
      attributes: {
        screenId: SCREEN_IDS.NotificationCenter,
        numberOfTotalNotifications: notifications.length,
        numberOfUnreadNotifications: notifications.filter((notification) => !notification.isRead).length,
      },
    };

    it('should call trackViewNotificationCenter when component init and track page view', fakeAsync(() => {
      expect(component.trackViewNotificationCenter).toHaveBeenCalled();
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(event);
    }));

    describe(`If receive notifications`, () => {
      it('should render at least one notification component', () => {
        const notification: DebugElement = fixture.debugElement.query(By.css('tsl-notification'));
        expect(notification).toBeTruthy();
      });
    });
  });
});
