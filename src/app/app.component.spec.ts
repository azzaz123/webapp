import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { DeviceService } from '@core/device/device.service';
import { ExternalCommsService } from '@core/external-comms.service';
import { SessionService } from '@core/session/session.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { MockDeviceService, MOCK_DEVICE_UUID } from '@fixtures/device.fixtures.spec';
import { MockExternalCommsService } from '@fixtures/external-comms-service.fixtures.spec';
import { MockSessionService } from '@fixtures/session-service.fixtures.spec';
import { CookieService } from 'ngx-cookie';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let analyticsService: AnalyticsService;
  let deviceService: DeviceService;
  let externalCommsService: ExternalCommsService;
  let cookieService: CookieService;
  let sessionService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        { provide: ExternalCommsService, useClass: MockExternalCommsService },
        { provide: SessionService, useClass: MockSessionService },
        { provide: DeviceService, useValue: MockDeviceService },
        { provide: CookieService, useValue: MockCookieService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    analyticsService = TestBed.inject(AnalyticsService);
    cookieService = TestBed.inject(CookieService);
    deviceService = TestBed.inject(DeviceService);
    externalCommsService = TestBed.inject(ExternalCommsService);
    sessionService = TestBed.inject(SessionService);
    fixture.detectChanges();
  });

  it('should create app', () => {
    expect(component).toBeTruthy();
  });

  describe('when the app initializes', () => {
    it('should initialize the analytics library', () => {
      spyOn(analyticsService, 'initialize');

      component.ngOnInit();

      expect(analyticsService.initialize).toHaveBeenCalledTimes(1);
    });

    it('should send Open Wallapop if user has a new session', () => {
      spyOn(analyticsService, 'trackEvent');

      component.ngOnInit();

      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        attributes: {
          currentUrl: 'http://localhost/',
          refererUrl: '',
          webDeviceId: MOCK_DEVICE_UUID,
          webPlatformType: 'desktop',
        },
        eventType: ANALYTIC_EVENT_TYPES.Other,
        name: ANALYTICS_EVENT_NAMES.OpenWallapop,
      });
    });

    it('should not send Open Wallapop if has an old session', () => {
      jest.spyOn(sessionService, 'newSession$', 'get').mockReturnValue(undefined);
      spyOn(analyticsService, 'trackEvent');

      component.ngOnInit();

      expect(analyticsService.trackEvent).not.toHaveBeenCalledWith({
        attributes: expect.anything(),
        eventType: ANALYTIC_EVENT_TYPES.Other,
        name: ANALYTICS_EVENT_NAMES.OpenWallapop,
      });
    });

    it('should initialize external Braze communications', () => {
      spyOn(externalCommsService, 'initializeBrazeCommunications');

      component.ngOnInit();

      expect(externalCommsService.initializeBrazeCommunications).toHaveBeenCalledTimes(1);
    });
  });
});
