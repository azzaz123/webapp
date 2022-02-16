import { NO_ERRORS_SCHEMA } from '@angular/core';
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
import { NotificationComponent } from './notification.component';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let element: HTMLElement;
  let analyticsService: AnalyticsService;
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
      const notificationLabelToggle = fixture.debugElement.query(By.css('.Notification')).nativeNode.childNodes[0];
      notificationLabelToggle.click();
      fixture.detectChanges();
    }));

    const event: AnalyticsEvent<ClickNotificationCard> = {
      name: ANALYTICS_EVENT_NAMES.ClickNotificationCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.NotificationCenter,
        notificationType: NOTIFICATION_VARIANT.GENERAL,
        isPinned: false,
        isUnread: false,
      },
    };

    // it('should call trackViewNotificationCenter when clicks on notification', fakeAsync(() => {
    //   expect(component.trackClickNotification).toHaveBeenCalled();
    //   expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
    // }));
  });
});
