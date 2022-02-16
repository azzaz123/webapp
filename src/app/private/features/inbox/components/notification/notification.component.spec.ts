import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  AnalyticsEvent,
  ClickNotificationCard,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NOTIFICATION_VARIANT } from '../../core/enums/notification-variant.enum';
import { Notification } from '../../core/interfaces/notification.interface';
import { NotificationComponent } from './notification.component';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let element: HTMLElement;
  let analyticsService: AnalyticsService;

  const highlightedNotification: Notification = {
    variant: NOTIFICATION_VARIANT.HIGHLIGHTED,
    productStatus: undefined,
    isRead: true,
    date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 6000000),
    title: 'Highlighted card',
    description:
      'Cillum ipsum ullamco adipisicing laborum excepteur id tempor laborum. Aliqua nisi incididunt culpa voluptate culpa minim ad eiusmod. Ad voluptate mollit officia sunt reprehenderit.',
    image: 'https://picsum.photos/200/300',
  };

  const pinnedNotification: Notification = {
    variant: NOTIFICATION_VARIANT.PINNED,
    productStatus: undefined,
    isRead: false,
    date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 60000),
    title: 'Pinned card',
    description:
      'Cillum ipsum ullamco adipisicing laborum excepteur id tempor laborum. Aliqua nisi incididunt culpa voluptate culpa minim ad eiusmod. Ad voluptate mollit officia sunt reprehenderit.',
    image: 'https://picsum.photos/200/300',
  };

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
        ],
        declarations: [NotificationComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, NgxPermissionsModule.forRoot()],
        declarations: [NotificationComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
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
      spyOn(component, 'trackClickNotification').and.callThrough();
      spyOn(analyticsService, 'trackEvent').and.callThrough();
      component.notification = highlightedNotification;
      fixture.detectChanges();
    }));

    const event: AnalyticsEvent<ClickNotificationCard> = {
      name: ANALYTICS_EVENT_NAMES.ClickNotificationCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.NotificationCenter,
        notificationType: NOTIFICATION_VARIANT.HIGHLIGHTED,
        isPinned: false,
        isUnread: false,
      },
    };

    it('should call trackViewNotificationCenter when clicks on notification', fakeAsync(() => {
      const notification = fixture.debugElement.query(By.css('.Notification')).nativeNode.childNodes[0];
      notification.click();
      fixture.detectChanges();
      expect(component.trackClickNotification).toHaveBeenCalled();
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
    }));
  });

  describe(`If receive highlighted notification`, () => {
    beforeEach(() => {
      component.notification = highlightedNotification;
      fixture.detectChanges();
    });

    it('should render a highlighted notification', () => {
      const highlightedNotification: DebugElement = fixture.debugElement.query(By.css('.Notification--highlighted'));
      expect(highlightedNotification).toBeTruthy();
    });
  });

  describe(`If receive pinned notification`, () => {
    beforeEach(() => {
      component.notification = pinnedNotification;
      fixture.detectChanges();
    });

    it('should render a highlighted notification', () => {
      const pinnedNotification: DebugElement = fixture.debugElement.query(By.css('.Notification--pinned'));
      expect(pinnedNotification).toBeTruthy();
    });
  });

  describe(`If pinned notification is not readed`, () => {
    beforeEach(() => {
      component.notification = pinnedNotification;
      fixture.detectChanges();
    });

    it('should render red bullet', () => {
      const notificationBullet: DebugElement = fixture.debugElement.query(By.css('.Notification__bullet'));
      expect(notificationBullet).toBeTruthy();
    });
  });
});
