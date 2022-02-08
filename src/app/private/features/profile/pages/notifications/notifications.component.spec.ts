import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { NotificationsComponent } from './notifications.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { By } from '@angular/platform-browser';
import { mappedNotificationsSettings } from '@api/fixtures/notifications/notifications.fixture';
import { NotificationsApiService } from '@api/notifications/notifications-api.service';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { FormsModule } from '@angular/forms';
import {
  AnalyticsPageView,
  ViewNotificationSettings,
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS,
  AnalyticsEvent,
  ANALYTIC_EVENT_TYPES,
  UpdateNotificationSetting,
} from '@core/analytics/analytics-constants';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let notificationsApiService: NotificationsApiService;
  let analyticsService: AnalyticsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, NgxPermissionsModule.forRoot()],
        providers: [
          {
            provide: NotificationsApiService,
            useValue: {
              getMyNotificationsSettings() {
                return of(mappedNotificationsSettings);
              },
              setNotificationEnable() {
                return of(null);
              },
              setNotificationDisabled() {
                return of(null);
              },
            },
          },
          {
            provide: AnalyticsService,
            useValue: {
              trackPageView: () => {},
              trackEvent: () => {},
            },
          },
        ],
        declarations: [NotificationsComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    notificationsApiService = TestBed.inject(NotificationsApiService);
    analyticsService = TestBed.inject(AnalyticsService);
    fixture.detectChanges();
  });

  describe('init', () => {
    beforeEach(fakeAsync(() => {
      spyOn(component, 'getMyNotificationsSettings').and.callThrough();
      spyOn(notificationsApiService, 'getMyNotificationsSettings').and.callThrough();
      spyOn(analyticsService, 'trackPageView').and.callThrough();
      component.ngOnInit();
      tick();
      fixture.detectChanges();
    }));

    const event: AnalyticsPageView<ViewNotificationSettings> = {
      name: ANALYTICS_EVENT_NAMES.ViewNotificationSettings,
      attributes: {
        screenId: SCREEN_IDS.NotificationSettings,
      },
    };

    it('should call getMyNotificationsSettings when component init and track page view', fakeAsync(() => {
      expect(component.getMyNotificationsSettings).toHaveBeenCalled();
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(event);
    }));

    it('and should render list of notifications settings', fakeAsync(() => {
      let notificationsList = fixture.debugElement.query(By.css('.NotificationsContainer')).nativeNode;
      expect(notificationsList.childNodes.length).toBeGreaterThan(0);
    }));
  });

  describe('should disable notification', () => {
    beforeEach(fakeAsync(() => {
      spyOn(component, 'handleChange').and.callThrough();
      spyOn(notificationsApiService, 'setNotificationDisabled').and.callThrough();
      spyOn(analyticsService, 'trackEvent').and.callThrough();
      const notificationLabelToggle = fixture.debugElement.query(By.css('.NotificationsSettings__details_toggle')).nativeNode.childNodes[0];
      notificationLabelToggle.click();
      fixture.detectChanges();
    }));

    const event: AnalyticsEvent<UpdateNotificationSetting> = {
      name: ANALYTICS_EVENT_NAMES.UpdateNotificationSetting,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        screenId: SCREEN_IDS.NotificationSettings,
        consent: false,
        notificationId: mappedNotificationsSettings[0].notifications[0].id,
      },
    };

    it('it should disable a enabled notification when clicked and track new event', () => {
      expect(component.handleChange).toHaveBeenCalled();
      expect(notificationsApiService.setNotificationDisabled).toHaveBeenCalled();
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
    });
  });

  describe('should enable notification', () => {
    beforeEach(() => {
      spyOn(component, 'handleChange').and.callThrough();
      spyOn(notificationsApiService, 'setNotificationEnable').and.callThrough();
      spyOn(analyticsService, 'trackEvent').and.callThrough();
      const notificationLabelToggle = fixture.debugElement.query(By.css('.NotificationsSettings__details_toggle')).nativeNode.childNodes[0];
      notificationLabelToggle.click();
      fixture.detectChanges();
    });

    const event: AnalyticsEvent<UpdateNotificationSetting> = {
      name: ANALYTICS_EVENT_NAMES.UpdateNotificationSetting,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        screenId: SCREEN_IDS.NotificationSettings,
        consent: true,
        notificationId: mappedNotificationsSettings[0].notifications[0].id,
      },
    };

    it('it should enable a disabled notification when clicked and track new event', () => {
      expect(component.handleChange).toHaveBeenCalled();
      expect(notificationsApiService.setNotificationEnable).toHaveBeenCalled();
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
    });
  });
});
