import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AnalyticsPageView, ViewNotificationCenter, ANALYTICS_EVENT_NAMES, SCREEN_IDS } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NotificationsInboxComponent } from './notifications-inbox.component';

describe('NotificationsInboxComponent', () => {
  let component: NotificationsInboxComponent;
  let fixture: ComponentFixture<NotificationsInboxComponent>;
  let analyticsService: AnalyticsService;
  let element: HTMLElement;
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
    }));

    const event: AnalyticsPageView<ViewNotificationCenter> = {
      name: ANALYTICS_EVENT_NAMES.ViewNotificationCenter,
      attributes: {
        screenId: SCREEN_IDS.NotificationCenter,
        numberOfTotalNotifications: 0,
        numberOfUnreadNotifications: 0,
      },
    };

    it('should call trackViewNotificationCenter when component init and track page view', fakeAsync(() => {
      expect(component.trackViewNotificationCenter).toHaveBeenCalled();
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(event);
    }));
  });
});
