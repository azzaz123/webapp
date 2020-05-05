import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelSubscriptionModalComponent } from './cancel-subscription-modal.component';
import { MAPPED_SUBSCRIPTIONS } from '../../../../tests/subscriptions.fixtures.spec';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from '../../../core/i18n/i18n.service';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { Observable, of } from 'rxjs';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import { MockAnalyticsService } from '../../../../tests/analytics.fixtures.spec';
import {
  AnalyticsEvent,
  ClickConfirmCloseSubscription,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS
} from '../../../core/analytics/analytics-constants';
import { SUBSCRIPTION_CATEGORIES } from '../../../core/subscriptions/subscriptions.interface';

describe('CancelSubscriptionModalComponent', () => {
  let component: CancelSubscriptionModalComponent;
  let fixture: ComponentFixture<CancelSubscriptionModalComponent>;
  let activeModal: NgbActiveModal;
  let subscriptionsService: SubscriptionsService;
  let analyticsService: AnalyticsService;
  let toastrService: ToastrService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelSubscriptionModalComponent ],
      providers: [
        {
          provide: NgbActiveModal, useValue: {
            close() {
            }
          }
        },
        {
          provide: ToastrService, useValue: {
            error() {
            },
            success() {
            },
            i18nError() {
            },
            i18nSuccess() {
            }
          }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: {}
              };
            }
          }
        },
        {
          provide: SubscriptionsService, useValue: {
            cancelSubscription() {
              return of(202);
            }
          }
        },
        I18nService,
        {
          provide: AnalyticsService, useClass: MockAnalyticsService
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelSubscriptionModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.get(NgbActiveModal);
    toastrService = TestBed.get(ToastrService);
    subscriptionsService = TestBed.get(SubscriptionsService);
    analyticsService = TestBed.get(AnalyticsService);
    component.subscription = MAPPED_SUBSCRIPTIONS[2];
    fixture.detectChanges();
  });

  describe('cancelSubscription', () => {
    const tier = MAPPED_SUBSCRIPTIONS[2].selected_tier;

    it('should call the cancelsubscription service', () => {
      spyOn(subscriptionsService, 'cancelSubscription').and.returnValue(of({status: 202}));

      component.cancelSubscription();
      
      expect(component.subscriptionsService.cancelSubscription).toHaveBeenCalledWith(tier.id);
      expect(component.loading).toBe(false);
    });

    it('should send the event', () => {
      spyOn(subscriptionsService, 'cancelSubscription').and.returnValue(of({status: 202}));
      spyOn(analyticsService, 'trackEvent');
      const expectedEvent: AnalyticsEvent<ClickConfirmCloseSubscription> = {
        name: ANALYTICS_EVENT_NAMES.ClickConfirmCloseSubscription,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          subscription: component.subscription.category_id as SUBSCRIPTION_CATEGORIES,
          tier: component.subscription.selected_tier_id,
          screenId: SCREEN_IDS.ProfileSubscription
        }
      };

      component.cancelSubscription();

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });

});