import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { CommunicationsConsentComponent } from './communications-consent.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { By } from '@angular/platform-browser';
import { mappedCommunicationsConsentGroup } from '@api/fixtures/comunications-consent/communications-consent-group.fixture';
import { CommunicationsConsentApiService } from '@api/communications-consent/communications-consent-api.service';
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

describe('CommunicationsConsentComponent', () => {
  let component: CommunicationsConsentComponent;
  let fixture: ComponentFixture<CommunicationsConsentComponent>;
  let notificationsApiService: CommunicationsConsentApiService;
  let analyticsService: AnalyticsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, NgxPermissionsModule.forRoot()],
        providers: [
          {
            provide: CommunicationsConsentApiService,
            useValue: {
              getCommunicationsConsentSettings() {
                return of(mappedCommunicationsConsentGroup);
              },
              setConsentEnable() {
                return of(null);
              },
              setConsentDisabled() {
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
        declarations: [CommunicationsConsentComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationsConsentComponent);
    component = fixture.componentInstance;
    notificationsApiService = TestBed.inject(CommunicationsConsentApiService);
    analyticsService = TestBed.inject(AnalyticsService);
    fixture.detectChanges();
  });

  describe('init', () => {
    beforeEach(fakeAsync(() => {
      spyOn(component, 'getConsentSettings').and.callThrough();
      spyOn(notificationsApiService, 'getCommunicationsConsentSettings').and.callThrough();
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

    it('should call getConsentSettings when component init and track page view', fakeAsync(() => {
      expect(component.getConsentSettings).toHaveBeenCalled();
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
      spyOn(notificationsApiService, 'setConsentDisabled').and.callThrough();
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
        notificationId: mappedCommunicationsConsentGroup[0].notifications[0].id,
      },
    };

    it('it should disable a enabled notification when clicked and track new event', () => {
      expect(component.handleChange).toHaveBeenCalled();
      expect(notificationsApiService.setConsentDisabled).toHaveBeenCalled();
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
    });
  });

  describe('should enable notification', () => {
    beforeEach(() => {
      spyOn(component, 'handleChange').and.callThrough();
      spyOn(notificationsApiService, 'setConsentEnable').and.callThrough();
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
        notificationId: mappedCommunicationsConsentGroup[0].notifications[0].id,
      },
    };

    it('it should enable a disabled notification when clicked and track new event', () => {
      expect(component.handleChange).toHaveBeenCalled();
      expect(notificationsApiService.setConsentEnable).toHaveBeenCalled();
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
    });
  });
});
