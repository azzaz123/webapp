import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TooManyItemsModalComponent } from './too-many-items-modal.component';
import { ButtonComponent } from '../../../button/button.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SUBSCRIPTION_TYPES } from '../../../../core/subscriptions/subscriptions.service';
import { By } from '@angular/platform-browser';
import { AnalyticsService } from '../../../../core/analytics/analytics.service';
import { MockAnalyticsService } from '../../../../../tests/analytics.fixtures.spec';
import {
  AnalyticsEvent,
  ClickSubscriptionLimitReached,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS
} from '../../../../core/analytics/analytics-constants';

describe('TooManyItemsModalComponent', () => {
  let component: TooManyItemsModalComponent;
  let fixture: ComponentFixture<TooManyItemsModalComponent>;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        RouterTestingModule
      ],
      declarations: [
        TooManyItemsModalComponent,
        ButtonComponent
      ],
      providers: [
        NgbActiveModal,
        {
          provide: AnalyticsService, useClass: MockAnalyticsService
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TooManyItemsModalComponent);
    component = fixture.componentInstance;
    component.type =  SUBSCRIPTION_TYPES.stripe;
    fixture.detectChanges();

    analyticsService = TestBed.get(AnalyticsService);
    spyOn(analyticsService, 'trackEvent');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('trackClickGoToSubscriptions', () => {
    it('should send event to analytics', () => {
      const expectedEvent: AnalyticsEvent<ClickSubscriptionLimitReached> = {
        name: ANALYTICS_EVENT_NAMES.ClickSubscriptionLimitReached,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          screenId: SCREEN_IDS.MyCatalog,
        }
      };

      component.trackClickGoToSubscriptions();

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });

});
