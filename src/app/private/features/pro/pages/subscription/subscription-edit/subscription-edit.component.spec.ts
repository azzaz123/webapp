import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickSubscriptionPlanDone,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { SUBSCRIPTION_CATEGORIES } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MockManageSubscriptionService } from '@fixtures/manage-subscription.fixtures.spec';
import { MockSubscriptionBenefitsService } from '@fixtures/subscription-benefits.fixture';
import {
  MockSubscriptionService,
  MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED,
  CAN_SUBSCRIPTION_BE_EDITED_FAIL,
  CAN_SUBSCRIPTION_BE_EDITED_OK,
} from '@fixtures/subscriptions.fixtures.spec';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionPurchaseSuccessComponent } from '@private/features/pro/components/subscription-purchase-success/subscription-purchase-success.component';
import { CategoryListingModalComponent } from '@private/features/pro/modal/category-listing-modal/category-listing-modal.component';
import { ManageSubscriptionService } from '@private/features/pro/services/manage-subscription.service';
import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';
import { modalConfig, PRO_MODAL_TYPE } from '@shared/modals/pro-modal/pro-modal.constants';
import { REDIRECT_TYPE } from '@shared/modals/pro-modal/pro-modal.interface';
import { of, throwError } from 'rxjs';
import { SubscriptionPurchaseHeaderComponent } from '../subscription-purchase-header/subscription-purchase-header.component';
import { PAYMENT_SUCCESSFUL_CODE, SubscriptionEditComponent } from './subscription-edit.component';

describe('SubscriptionEditComponent', () => {
  let component: SubscriptionEditComponent;
  let fixture: ComponentFixture<SubscriptionEditComponent>;
  let toastService: ToastService;
  let subscriptionsService: SubscriptionsService;
  let benefitsService: SubscriptionBenefitsService;
  let analyticsService: AnalyticsService;
  let modalService: NgbModal;
  let manageSubscriptionServiceSpy: jasmine.Spy;
  let customerHelpService: CustomerHelpService;
  let manageSubscriptionService: ManageSubscriptionService;
  const componentInstance: any = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionEditComponent, SubscriptionPurchaseSuccessComponent, SubscriptionPurchaseHeaderComponent],
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
                result: Promise.resolve(),
                componentInstance: componentInstance,
              };
            },
          },
        },
        {
          provide: AnalyticsService,
          useClass: MockAnalyticsService,
        },
        {
          provide: ManageSubscriptionService,
          useClass: MockManageSubscriptionService,
        },
        {
          provide: CustomerHelpService,
          useValue: {
            getPageUrl() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionEditComponent);
    component = fixture.componentInstance;
    component.subscription = MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED;
    component.user = MOCK_USER;
    toastService = TestBed.inject(ToastService);
    subscriptionsService = TestBed.inject(SubscriptionsService);
    analyticsService = TestBed.inject(AnalyticsService);
    modalService = TestBed.inject(NgbModal);
    benefitsService = TestBed.inject(SubscriptionBenefitsService);
    customerHelpService = TestBed.inject(CustomerHelpService);
    manageSubscriptionService = TestBed.inject(ManageSubscriptionService);
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
      manageSubscriptionServiceSpy = spyOn(manageSubscriptionService, 'cancelSubscription').and.callThrough();
      spyOn(component.editSuccesful, 'emit').and.callThrough();
    });
    it('should call cancel service', () => {
      component.cancelSubscription();

      expect(manageSubscriptionService.cancelSubscription).toHaveBeenCalledTimes(1);
      expect(manageSubscriptionService.cancelSubscription).toHaveBeenCalledWith(component.subscription);
    });
    describe('and click CTA', () => {
      describe('and request is successful', () => {
        it('should emit event', () => {
          component.cancelSubscription();

          expect(component.editSuccesful.emit).toHaveBeenCalledTimes(1);
          expect(component.editSuccesful.emit).toHaveBeenCalledWith();
        });
      });
      describe('and request fails', () => {
        beforeEach(() => {
          manageSubscriptionServiceSpy.and.returnValue(throwError('error'));
        });
        it('should not emit event', () => {
          component.cancelSubscription();

          expect(component.editSuccesful.emit).not.toHaveBeenCalled();
        });
      });
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
      describe('and tier can be selected', () => {
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
      describe('and tier can not be selected', () => {
        beforeEach(() => {
          spyOn(subscriptionsService, 'canUpdateTier').and.returnValue(of(CAN_SUBSCRIPTION_BE_EDITED_FAIL));
          spyOn(modalService, 'open').and.callThrough();
          spyOn(customerHelpService, 'getPageUrl').and.returnValue('link');
        });
        it('should not show success page', () => {
          component.onPurchaseButtonClick();
          fixture.detectChanges();

          const successPage = fixture.debugElement.query(By.directive(SubscriptionPurchaseSuccessComponent));
          expect(successPage).toBeFalsy();
        });

        it('should error modal', () => {
          component['modalRef'] = <any>{
            componentInstance: componentInstance,
          };

          component.onPurchaseButtonClick();
          fixture.detectChanges();

          expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
            windowClass: 'pro-modal',
          });
          expect(component['modalRef'].componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.error_downgrade]);
          expect(component['modalRef'].componentInstance.modalConfig.buttons.secondary.redirect).toEqual({
            type: REDIRECT_TYPE.href,
            url: 'link',
          });
          expect(component['modalRef'].componentInstance.modalConfig.text2).toContain(CAN_SUBSCRIPTION_BE_EDITED_OK.renewalDate);
          expect(customerHelpService.getPageUrl).toBeCalledWith(CUSTOMER_HELP_PAGE.CANNOT_CHANGE_PRO_SUBSCRIPTION);
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
  describe('Categories modal', () => {
    describe('and click open modal', () => {
      it('should open modal', () => {
        spyOn(modalService, 'open').and.callThrough();
        const header = fixture.debugElement.query(By.directive(SubscriptionPurchaseHeaderComponent));

        header.componentInstance.clickLink.emit();

        expect(modalService.open).toHaveBeenCalledWith(CategoryListingModalComponent, {
          windowClass: 'category-listing',
        });
      });
    });
  });
  describe('Faqs', () => {
    const articleUrl = 'articleUrl';
    beforeEach(() => {
      spyOn(customerHelpService, 'getPageUrl').and.returnValue(articleUrl);
      component.ngOnInit();
      fixture.detectChanges();
    });
    it('should show link', () => {
      const link = fixture.debugElement.query(By.css('a'));

      expect(link).toBeTruthy();
    });
    it('link should open a new tab', () => {
      const link = fixture.debugElement.query(By.css('a'));

      expect(link.attributes.target).toEqual('_blank');
    });
    it('link should redirect to articleId', () => {
      const link = fixture.debugElement.query(By.css('a'));

      expect(link.attributes.href).toEqual(articleUrl);
      expect(customerHelpService.getPageUrl).toHaveBeenCalledWith(CUSTOMER_HELP_PAGE.CHANGE_PRO_SUBSCRIPTION);
    });
  });
});
