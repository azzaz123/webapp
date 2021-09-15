import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickSubscriptionPlanDone,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { SUBSCRIPTION_CATEGORIES } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MockSubscriptionBenefitsService } from '@fixtures/subscription-benefits.fixture';
import { MockSubscriptionService, MAPPED_SUBSCRIPTIONS } from '@fixtures/subscriptions.fixtures.spec';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionPurchaseSuccessComponent } from '@private/features/pro/components/subscription-purchase-success/subscription-purchase-success.component';
import { CancelSubscriptionModalComponent } from '@private/features/pro/modal/cancel-subscription/cancel-subscription-modal.component';
import { ModalStatuses } from '@private/features/pro/modal/modal.statuses.enum';
import { of, throwError } from 'rxjs';
import { PAYMENT_SUCCESSFUL_CODE, SubscriptionEditComponent } from './subscription-edit.component';

describe('SubscriptionEditComponent', () => {
  let component: SubscriptionEditComponent;
  let fixture: ComponentFixture<SubscriptionEditComponent>;
  let toastService: ToastService;
  let subscriptionsService: SubscriptionsService;
  let benefitsService: SubscriptionBenefitsService;
  let analyticsService: AnalyticsService;
  let modalService: NgbModal;
  let modalSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionEditComponent, SubscriptionPurchaseSuccessComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: SubscriptionsService,
          useClass: MockSubscriptionService,
        },
        {
          provide: SubscriptionBenefitsService,
          useClass: MockSubscriptionBenefitsService,
        },
        {
          provide: NgbModal,
          useValue: {
            open() {
              return {
                result: Promise.resolve(ModalStatuses.SUCCESS),
                componentInstance: {},
              };
            },
          },
        },
        {
          provide: AnalyticsService,
          useClass: MockAnalyticsService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionEditComponent);
    component = fixture.componentInstance;
    component.subscription = MAPPED_SUBSCRIPTIONS[2];
    component.user = MOCK_USER;
    toastService = TestBed.inject(ToastService);
    subscriptionsService = TestBed.inject(SubscriptionsService);
    analyticsService = TestBed.inject(AnalyticsService);
    modalService = TestBed.inject(NgbModal);
    benefitsService = TestBed.inject(SubscriptionBenefitsService);
    fixture.detectChanges();
  });

  describe('NgOnInit', () => {
    describe('when user has a subscribed tier', () => {
      it('should set subscribed tier', () => {
        expect(component.selectedTier).toEqual(
          component.subscription.tiers.find((tier) => tier.id === component.subscription.selected_tier_id)
        );
      });
      it('should set selected tier', () => {
        expect(component.selectedTier).toEqual(component.subscribedTier);
        expect(component.isEqualTier).toBe(true);
      });
      it('should set available tiers', () => {
        expect(component.availableTiers).toEqual(
          component.subscription.tiers.filter((tier) => tier.id !== component.subscription.selected_tier_id)
        );
      });
      it('should selected tier be the same that subscribed tier', () => {
        expect(component.isEqualTier).toBe(true);
      });
    });
    describe('Benefits', () => {
      describe('when subscription has benefits', () => {
        it('should set benefits', () => {
          const benefits = ['benefit1', 'benefit2'];
          spyOn(benefitsService, 'getBenefitsByCategory').and.returnValue(benefits);
          component.ngOnInit();

          expect(component.benefits).toEqual(benefits);
        });
      });
    });
  });
  describe('When user cancel a subscription', () => {
    beforeEach(() => {
      modalSpy = spyOn(modalService, 'open').and.callThrough();
      spyOn(component.editSuccesful, 'emit').and.callThrough();
    });
    it('should open modal', () => {
      component.cancelSubscription();

      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(CancelSubscriptionModalComponent, {
        windowClass: 'review',
      });
    });
    describe('and modal return success', () => {
      it('should emit successful', fakeAsync(() => {
        component.cancelSubscription();

        tick();
        fixture.detectChanges;

        expect(component.editSuccesful.emit).toHaveBeenCalledTimes(1);
        expect(component.editSuccesful.emit).toHaveBeenLastCalledWith();
      }));
    });
    describe('and modal not return success', () => {
      it('should emit successful', fakeAsync(() => {
        modalSpy.and.returnValue({ result: Promise.resolve(ModalStatuses.FAIL), componentInstance: {} });
        component.cancelSubscription();

        tick();
        fixture.detectChanges;

        expect(component.editSuccesful.emit).not.toHaveBeenCalled();
      }));
    });
  });
  describe('Edit subscription', () => {
    describe('when click on confirm button', () => {
      it('should track event', () => {
        spyOn(analyticsService, 'trackEvent').and.callThrough();
        const expectedEvent: AnalyticsEvent<ClickSubscriptionPlanDone> = {
          name: ANALYTICS_EVENT_NAMES.ClickSubscriptionPlanDone,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            subscription: component.subscription.category_id as SUBSCRIPTION_CATEGORIES,
            previousTier: component.subscribedTier.id,
            newTier: component.selectedTier.id,
            screenId: SCREEN_IDS.SubscriptionManagement,
          },
        };
        component.onPurchaseButtonClick();

        expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      });
      describe('and subscription was edited succesfully', () => {
        it('should show success page', () => {
          spyOn(subscriptionsService, 'editSubscription').and.returnValue(of({ status: PAYMENT_SUCCESSFUL_CODE }));

          component.onPurchaseButtonClick();
          fixture.detectChanges();

          const successPage = fixture.debugElement.query(By.directive(SubscriptionPurchaseSuccessComponent));
          expect(successPage).toBeTruthy();
        });
        describe('and has to redirect', () => {
          it('should redirect', () => {
            spyOn(component.editSuccesful, 'emit').and.callThrough();

            component.onRedirectTo('test');

            expect(component.editSuccesful.emit).toHaveBeenCalledTimes(1);
            expect(component.editSuccesful.emit).toHaveBeenLastCalledWith('test');
          });
        });
      });

      describe('and subscription was not edited succesfully', () => {
        beforeEach(() => {
          spyOn(toastService, 'show').and.callThrough();
        });
        describe('and response returns code different of 202', () => {
          beforeEach(() => {
            spyOn(subscriptionsService, 'editSubscription').and.returnValue(of({ status: 204 }));
          });
          it('should not show success page', () => {
            component.onPurchaseButtonClick();
            fixture.detectChanges();

            const successPage = fixture.debugElement.query(By.directive(SubscriptionPurchaseSuccessComponent));
            expect(successPage).toBeFalsy();
          });

          it('should error toast', () => {
            component.onPurchaseButtonClick();
            fixture.detectChanges();

            expect(toastService.show).toHaveBeenCalledTimes(1);
          });
        });
        describe('and response fails', () => {
          beforeEach(() => {
            spyOn(subscriptionsService, 'editSubscription').and.returnValues(throwError('error'));
          });
          it('should not show success page', () => {
            component.onPurchaseButtonClick();
            fixture.detectChanges();

            const successPage = fixture.debugElement.query(By.directive(SubscriptionPurchaseSuccessComponent));
            expect(successPage).toBeFalsy();
          });

          it('should error toast', () => {
            component.onPurchaseButtonClick();
            fixture.detectChanges();

            expect(toastService.show).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });
  describe('Click back button', () => {
    it('should emit change subscription', () => {
      spyOn(component.unselectSubscription, 'emit');

      component.onClearSubscription();

      expect(component.unselectSubscription.emit).toHaveBeenCalledTimes(1);
      expect(component.unselectSubscription.emit).toHaveBeenCalledWith();
    });
  });
});
