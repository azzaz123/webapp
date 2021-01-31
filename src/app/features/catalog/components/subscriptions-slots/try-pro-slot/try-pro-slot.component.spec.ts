import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import {
  AnalyticsEvent,
  ClickCatalogManagement,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { TryProSlotComponent } from './try-pro-slot.component';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { MockSubscriptionService } from '@fixtures/subscriptions.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { MockedUserService } from '@fixtures/user.fixtures.spec';
import { Router } from '@angular/router';

describe('TryProSlotItemComponent', () => {
  let component: TryProSlotComponent;
  let analyticsService: AnalyticsService;
  let fixture: ComponentFixture<TryProSlotComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [TryProSlotComponent],
        providers: [
          { provide: AnalyticsService, useClass: MockAnalyticsService },
          { provide: SubscriptionsService, useClass: MockSubscriptionService },
          { provide: UserService, useClass: MockedUserService },
          {
            provide: Router,
            useValue: {
              navigate() {},
            },
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TryProSlotComponent);
    component = fixture.componentInstance;
    analyticsService = TestBed.inject(AnalyticsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
