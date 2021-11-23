import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { InvoiceService } from '@core/invoice/invoice.service';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { UserService } from '@core/user/user.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MOCK_INVOICE_HISTORY } from '@fixtures/invoice.fixtures.spec';
import { MockSubscriptionBenefitsService } from '@fixtures/subscription-benefits.fixture';
import { MockSubscriptionService } from '@fixtures/subscriptions.fixtures.spec';
import { MockedUserService } from '@fixtures/user.fixtures.spec';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickProSubscription,
  SCREEN_IDS,
} from 'app/core/analytics/analytics-constants';
import { AnalyticsService } from 'app/core/analytics/analytics.service';
import { SubscriptionsService } from 'app/core/subscriptions/subscriptions.service';
import { CookieService } from 'ngx-cookie';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { of, throwError } from 'rxjs';
import { PRO_PATHS } from '../pro-routing-constants';
import { ProComponent } from './pro.component';
import { SubscriptionsComponent } from './subscription/subscription.component';

@Component({
  selector: 'tsl-test-component',
  template: '',
})
class TestComponent {}

describe('ProComponent', () => {
  let component: ProComponent;
  let fixture: ComponentFixture<ProComponent>;
  let userService: UserService;
  let httpMock: HttpTestingController;
  let analyticsService: AnalyticsService;
  let subscriptionsService: SubscriptionsService;
  let customerHelpService: CustomerHelpService;
  let router: Router;
  let invoiceService: InvoiceService;
  let benefits: SubscriptionBenefitsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          NgxPermissionsModule.forRoot(),
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([
            { path: PRO_PATHS.SUBSCRIPTIONS, component: SubscriptionsComponent },
            { path: PRO_PATHS.BILLING, component: TestComponent },
          ]),
        ],
        declarations: [ProComponent],
        providers: [
          NgxPermissionsService,
          {
            provide: CookieService,
            useValue: {
              value: null,
              put() {},
              get() {
                return this.value;
              },
            },
          },
          FeatureFlagService,
          {
            provide: UserService,
            useClass: MockedUserService,
          },
          {
            provide: SubscriptionsService,
            useClass: MockSubscriptionService,
          },
          {
            provide: AnalyticsService,
            useClass: MockAnalyticsService,
          },
          {
            provide: CustomerHelpService,
            useValue: {
              getPageUrl() {
                return 'fake-url';
              },
            },
          },
          {
            provide: SubscriptionBenefitsService,
            useClass: MockSubscriptionBenefitsService,
          },
          {
            provide: InvoiceService,
            useValue: {
              getInvoiceTransactions() {
                return of([]);
              },
            },
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
      fixture = TestBed.createComponent(ProComponent);
      component = fixture.componentInstance;
      userService = TestBed.inject(UserService);
      httpMock = TestBed.inject(HttpTestingController);
      analyticsService = TestBed.inject(AnalyticsService);
      subscriptionsService = TestBed.inject(SubscriptionsService);
      customerHelpService = TestBed.inject(CustomerHelpService);
      invoiceService = TestBed.inject(InvoiceService);
      router = TestBed.inject(Router);
      benefits = TestBed.inject(SubscriptionBenefitsService);
      fixture.detectChanges();
    })
  );

  describe('when user is not a cardealer', () => {
    describe("and when user clicks in 'Subscriptions' tab", () => {
      let subscriptionTabElement;
      const expectedText = 'Subscriptions';
      beforeEach(() => {
        spyOn(analyticsService, 'trackEvent');
      });

      describe('and there is no free trial', () => {
        beforeEach(() => {
          spyOn(subscriptionsService, 'hasOneTrialSubscription').and.returnValue(false);
          fixture.detectChanges();
        });

        it('should track the event', () => {
          const expectedEvent: AnalyticsEvent<ClickProSubscription> = {
            name: ANALYTICS_EVENT_NAMES.ClickProSubscription,
            eventType: ANALYTIC_EVENT_TYPES.Navigation,
            attributes: {
              screenId: SCREEN_IDS.MyProfile,
              freeTrial: false,
              discount: false,
            },
          };
          subscriptionTabElement = fixture.debugElement
            .queryAll(By.css('a'))
            .find((anchors) => anchors.nativeElement.innerHTML === expectedText).nativeElement;

          subscriptionTabElement.click();

          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });

      describe('and there is free trial', () => {
        beforeEach(() => {
          spyOn(subscriptionsService, 'hasOneTrialSubscription').and.returnValue(true);
          component.ngOnInit();
          fixture.detectChanges();
        });

        it('should track the event', () => {
          const expectedEvent: AnalyticsEvent<ClickProSubscription> = {
            name: ANALYTICS_EVENT_NAMES.ClickProSubscription,
            eventType: ANALYTIC_EVENT_TYPES.Navigation,
            attributes: {
              screenId: SCREEN_IDS.MyProfile,
              freeTrial: true,
              discount: false,
            },
          };
          subscriptionTabElement = fixture.debugElement
            .queryAll(By.css('a'))
            .find((anchors) => anchors.nativeElement.innerHTML === expectedText).nativeElement;

          subscriptionTabElement.click();

          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });

      describe('and there is a discount', () => {
        beforeEach(() => {
          spyOn(subscriptionsService, 'hasSomeSubscriptionDiscount').and.returnValue(true);
          component.ngOnInit();
          fixture.detectChanges();
        });

        it('should track the event', () => {
          const expectedEvent: AnalyticsEvent<ClickProSubscription> = {
            name: ANALYTICS_EVENT_NAMES.ClickProSubscription,
            eventType: ANALYTIC_EVENT_TYPES.Navigation,
            attributes: {
              screenId: SCREEN_IDS.MyProfile,
              freeTrial: false,
              discount: true,
            },
          };
          subscriptionTabElement = fixture.debugElement
            .queryAll(By.css('a'))
            .find((anchors) => anchors.nativeElement.innerHTML === expectedText).nativeElement;

          subscriptionTabElement.click();

          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });
    });
  });
  describe('Faqs', () => {
    describe('and page is loaded', () => {
      beforeEach(() => {
        spyOn(customerHelpService, 'getPageUrl').and.callThrough();
      });
      describe('and is a route with faqs', () => {
        beforeEach(() => {
          jest.spyOn(router, 'url', 'get').mockReturnValue(PRO_PATHS.BILLING);
          component.ngOnInit();
        });
        it('should show faqs', fakeAsync(() => {
          tick();
          fixture.detectChanges();
          const elements = fixture.debugElement.queryAll(By.css('a'));
          const faq = elements.find((element) => element.attributes.href === 'fake-url');

          expect(faq).toBeTruthy();
          expect(customerHelpService.getPageUrl).toHaveBeenCalledWith(CUSTOMER_HELP_PAGE.BILLING_INFO);
        }));
        describe('and navigate to route without faqs', () => {
          it('should not show faqs', fakeAsync(() => {
            router.navigate([PRO_PATHS.SUBSCRIPTIONS]);
            tick();
            fixture.detectChanges();

            const elements = fixture.debugElement.queryAll(By.css('a'));
            const faq = elements.find((element) => element.attributes.href === 'fake-url');

            expect(faq).toBeFalsy();
          }));
        });
      });
      describe('and is not a route with faqs', () => {
        beforeEach(() => {
          jest.spyOn(router, 'url', 'get').mockReturnValue(PRO_PATHS.SUBSCRIPTIONS);
          component.ngOnInit();
        });
        it('should not show faqs', fakeAsync(() => {
          tick();
          fixture.detectChanges();
          const elements = fixture.debugElement.queryAll(By.css('a'));
          const faq = elements.find((element) => element.attributes.href === 'fake-url');

          expect(faq).toBeFalsy();
        }));
        describe('and navigate to route with faqs', () => {
          it('should show faqs', fakeAsync(() => {
            router.navigate([PRO_PATHS.BILLING]);
            tick();
            fixture.detectChanges();

            const elements = fixture.debugElement.queryAll(By.css('a'));
            const faq = elements.find((element) => element.attributes.href === 'fake-url');

            expect(faq).toBeTruthy();
            expect(customerHelpService.getPageUrl).toHaveBeenCalledWith(CUSTOMER_HELP_PAGE.BILLING_INFO);
          }));
        });
      });
    });
  });
  describe('Navigation tabs', () => {
    describe('and is pro user', () => {
      it('should show navigation tabs', () => {
        const nav = fixture.debugElement.query(By.css('nav'));

        expect(nav).toBeTruthy();
      });
      it('should not call invoices', () => {
        spyOn(invoiceService, 'getInvoiceTransactions').and.callThrough();

        component.ngOnInit();

        expect(invoiceService.getInvoiceTransactions).not.toHaveBeenCalled();
      });
    });
    describe('and is not pro user', () => {
      beforeEach(() => {
        jest.spyOn(userService, 'isProUser$', 'get').mockReturnValue(of(false));
      });
      it('should call invoices', () => {
        spyOn(invoiceService, 'getInvoiceTransactions').and.returnValue(of([]));

        component.ngOnInit();

        expect(invoiceService.getInvoiceTransactions).toHaveBeenCalledTimes(1);
        expect(invoiceService.getInvoiceTransactions).toHaveBeenCalledWith();
      });
      describe('and has no invoices', () => {
        beforeEach(() => {
          spyOn(invoiceService, 'getInvoiceTransactions').and.returnValue(of([]));
          component.ngOnInit();
          fixture.detectChanges();
        });
        it('should not show navigation tabs', () => {
          const nav = fixture.debugElement.query(By.css('nav'));

          expect(nav).toBeFalsy();
        });
      });
      describe('and has invoices', () => {
        beforeEach(() => {
          spyOn(invoiceService, 'getInvoiceTransactions').and.returnValue(of(MOCK_INVOICE_HISTORY));
          component.ngOnInit();
          fixture.detectChanges();
        });
        it('should show navigation tabs', () => {
          const nav = fixture.debugElement.query(By.css('nav'));

          expect(nav).toBeTruthy();
        });
      });
      describe('and invoices request fails', () => {
        beforeEach(() => {
          spyOn(invoiceService, 'getInvoiceTransactions').and.returnValue(throwError('error'));
          component.ngOnInit();
          fixture.detectChanges();
        });
        it('should show navigation tabs', () => {
          const nav = fixture.debugElement.query(By.css('nav'));

          expect(nav).toBeTruthy();
        });
      });
    });
  });
  describe('Header', () => {
    describe('and is Pro user', () => {
      beforeEach(() => {
        jest.spyOn(userService, 'isProUser$', 'get').mockReturnValue(of(true));
        fixture.detectChanges();
      });
      it('should not show benefits', () => {
        expectProHeaderBenefitsShown(false);
      });
    });
    describe('and is not Pro user', () => {
      beforeEach(() => {
        jest.spyOn(userService, 'isProUser$', 'get').mockReturnValue(of(false));
      });
      describe('and has not to show benefits', () => {
        beforeEach(() => {
          jest.spyOn(benefits, 'showHeaderBenefits$', 'get').mockReturnValue(of(false));
          fixture.detectChanges();
        });
        it('should not show benefits', () => {
          expectProHeaderBenefitsShown(false);
        });
      });
      describe('and has to show benefits', () => {
        beforeEach(() => {
          jest.spyOn(benefits, 'showHeaderBenefits$', 'get').mockReturnValue(of(true));
          fixture.detectChanges();
        });
        it('should show benefits', () => {
          expectProHeaderBenefitsShown(true);
        });
      });
    });
  });
  function expectProHeaderBenefitsShown(isShown: boolean): void {
    const header = fixture.debugElement.query(By.css('tsl-pro-header'));

    expect(header.nativeNode.showBenefits).toBe(isShown);
  }
});
