import { LOCALE_ID } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickConfirmCloseSubscription,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { SUBSCRIPTION_CATEGORIES } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MockSubscriptionService, MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED } from '@fixtures/subscriptions.fixtures.spec';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';
import { modalConfig, PRO_MODAL_TYPE } from '@shared/modals/pro-modal/pro-modal.constants';
import { MODAL_ACTION } from '@shared/modals/pro-modal/pro-modal.interface';
import { of, throwError } from 'rxjs';

import { ManageSubscriptionService } from './manage-subscription.service';

describe('ManageSubscriptionService', () => {
  let service: ManageSubscriptionService;
  let modalService: NgbModal;
  let modalSpy: jasmine.Spy;
  let analyticsService: AnalyticsService;
  let subscriptionsService: SubscriptionsService;
  let toastService: ToastService;
  let i18nService: I18nService;
  const componentInstance = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ManageSubscriptionService,
        {
          provide: AnalyticsService,
          useClass: MockAnalyticsService,
        },
        {
          provide: SubscriptionsService,
          useClass: MockSubscriptionService,
        },
        I18nService,
        {
          provide: LOCALE_ID,
          useValue: 'es',
        },
        {
          provide: NgbModal,
          useValue: {
            open() {
              return {
                componentInstance: componentInstance,
              };
            },
          },
        },
      ],
    });
    service = TestBed.inject(ManageSubscriptionService);
    toastService = TestBed.inject(ToastService);
    subscriptionsService = TestBed.inject(SubscriptionsService);
    analyticsService = TestBed.inject(AnalyticsService);
    i18nService = TestBed.inject(I18nService);
    modalService = TestBed.inject(NgbModal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('When user cancel a subscription', () => {
    beforeEach(() => {
      modalSpy = spyOn(modalService, 'open').and.callThrough();
    });
    it('should open cancellation modal', () => {
      service['modalRef'] = {
        componentInstance: componentInstance,
      };

      service.cancelSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED).subscribe();

      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
        windowClass: 'pro-modal',
      });
      expect(service['modalRef'].componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.cancel_subscription]);
    });
    describe('and click CTA', () => {
      beforeEach(() => {
        modalSpy.and.returnValue({ result: Promise.resolve(MODAL_ACTION.PRIMARY_BUTTON), componentInstance: {} });
        spyOn(analyticsService, 'trackEvent').and.callThrough();
      });
      it('should track event', fakeAsync(() => {
        const expectedEvent: AnalyticsEvent<ClickConfirmCloseSubscription> = {
          name: ANALYTICS_EVENT_NAMES.ClickConfirmCloseSubscription,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            subscription: MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED.category_id as SUBSCRIPTION_CATEGORIES,
            tier: MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED.selected_tier_id,
            screenId: SCREEN_IDS.ProfileSubscription,
          },
        };

        service.cancelSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED).subscribe();
        tick();

        expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      }));
      it('should make the request', fakeAsync(() => {
        spyOn(subscriptionsService, 'cancelSubscription').and.callThrough();

        service.cancelSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED).subscribe();
        tick();

        expect(subscriptionsService.cancelSubscription).toHaveBeenCalledWith(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED.selected_tier_id);
      }));

      describe('and request is successful', () => {
        beforeEach(() => {
          spyOn(toastService, 'show').and.callThrough();
        });
        it('should emit completed', fakeAsync(() => {
          let isCompleted = false;
          service.cancelSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED).subscribe(
            () => {},
            () => {},
            () => {
              isCompleted = true;
            }
          );
          tick();

          expect(isCompleted).toBe(true);
        }));
        it('should show success toast', fakeAsync(() => {
          service.cancelSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED).subscribe();
          tick();

          expect(toastService.show).toHaveBeenCalledTimes(1);
          expect(toastService.show).toHaveBeenCalledWith({
            title: `${i18nService.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CANCEL_SUCCESS_TITLE)}`,
            text: `${i18nService.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CANCEL_SUCCESS_BODY)}`,
            type: TOAST_TYPES.SUCCESS,
          });
        }));
      });

      describe('and request fail', () => {
        beforeEach(() => {
          spyOn(subscriptionsService, 'cancelSubscription').and.returnValue(throwError('error'));
          spyOn(toastService, 'show').and.callThrough();
        });
        it('should emit error', fakeAsync(() => {
          let hasError = false;
          service.cancelSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED).subscribe(
            () => {},
            () => {
              hasError = true;
            },
            () => {}
          );
          tick();

          expect(hasError).toBe(true);
        }));
        it('should show error toast', fakeAsync(() => {
          service.cancelSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED).subscribe(
            () => {},
            () => {}
          );
          tick();

          expect(toastService.show).toHaveBeenCalledTimes(1);
          expect(toastService.show).toHaveBeenCalledWith({
            title: `${i18nService.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CANCEL_ERROR_TITLE)}`,
            text: `${i18nService.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CANCEL_ERROR_BODY)}`,
            type: TOAST_TYPES.ERROR,
          });
        }));
      });
    });
    describe('and click secondary button', () => {
      beforeEach(() => {
        modalSpy.and.returnValue({ result: Promise.resolve(MODAL_ACTION.SECONDARY_BUTON), componentInstance: {} });
        spyOn(analyticsService, 'trackEvent').and.callThrough();
      });
      it('should not track event', fakeAsync(() => {
        service.cancelSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED).subscribe(
          () => {},
          () => {}
        );
        tick();

        expect(analyticsService.trackEvent).not.toHaveBeenCalled();
      }));
      it('should emit error', fakeAsync(() => {
        let error = false;
        service.cancelSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED).subscribe(
          () => {},
          () => {
            error = true;
          }
        );
        tick();

        expect(error).toBe(true);
      }));
    });
  });

  describe('When user reactivates a subscription', () => {
    beforeEach(() => {
      modalSpy = spyOn(modalService, 'open').and.callThrough();
    });
    it('should open reactivation modal', () => {
      service['modalRef'] = {
        componentInstance: componentInstance,
      };

      service.continueSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED).subscribe();

      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
        windowClass: 'pro-modal',
      });
      expect(service['modalRef'].componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.continue_subscription]);
    });
    describe('and click CTA', () => {
      beforeEach(() => {
        modalSpy.and.returnValue({ result: Promise.resolve(MODAL_ACTION.PRIMARY_BUTTON), componentInstance: {} });
      });
      it('should make the request', fakeAsync(() => {
        spyOn(subscriptionsService, 'continueSubscription').and.callThrough();

        service.continueSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED).subscribe();
        tick();

        expect(subscriptionsService.continueSubscription).toHaveBeenCalledWith(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED.selected_tier_id);
      }));

      describe('and request is successful', () => {
        beforeEach(() => {
          spyOn(toastService, 'show').and.callThrough();
        });
        it('should emit completed', fakeAsync(() => {
          let isCompleted = false;
          service.continueSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED).subscribe(
            () => {},
            () => {},
            () => {
              isCompleted = true;
            }
          );
          tick();

          expect(isCompleted).toBe(true);
        }));
        it('should show success toast', fakeAsync(() => {
          service.continueSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED).subscribe();
          tick();

          expect(toastService.show).toHaveBeenCalledTimes(1);
          expect(toastService.show).toHaveBeenCalledWith({
            title: $localize`:@@web_pro_subscription_continue_success_title:Success`,
            text: $localize`:@@web_pro_subscription_continue_success_body:Your subscription is active again`,
            type: TOAST_TYPES.SUCCESS,
          });
        }));
      });

      describe('and request fail', () => {
        beforeEach(() => {
          spyOn(subscriptionsService, 'continueSubscription').and.returnValue(throwError('error'));
          spyOn(toastService, 'show').and.callThrough();
        });
        it('should emit error', fakeAsync(() => {
          let hasError = false;
          service.continueSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED).subscribe(
            () => {},
            () => {
              hasError = true;
            },
            () => {}
          );
          tick();

          expect(hasError).toBe(true);
        }));
        it('should show error toast', fakeAsync(() => {
          service.continueSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED).subscribe(
            () => {},
            () => {}
          );
          tick();

          expect(toastService.show).toHaveBeenCalledTimes(1);
          expect(toastService.show).toHaveBeenCalledWith({
            title: $localize`:@@web_pro_subscription_continue_error_title:There was an error`,
            text: $localize`:@@web_pro_subscription_continue_error_body:We could not proceed with your request.`,
            type: TOAST_TYPES.ERROR,
          });
        }));
      });
    });
    describe('and click secondary button', () => {
      beforeEach(() => {
        modalSpy.and.returnValue({ result: Promise.resolve(MODAL_ACTION.SECONDARY_BUTON), componentInstance: {} });
      });
      it('should emit error', fakeAsync(() => {
        let error = false;
        service.continueSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED).subscribe(
          () => {},
          () => {
            error = true;
          }
        );
        tick();

        expect(error).toBe(true);
      }));
    });
  });
});
