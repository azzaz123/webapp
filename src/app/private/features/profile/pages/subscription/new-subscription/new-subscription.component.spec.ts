import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ErrorsService } from '@core/errors/errors.service';
import { ScrollIntoViewService } from '@core/scroll-into-view/scroll-into-view';
import { StripeService } from '@core/stripe/stripe.service';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MockErrorService } from '@fixtures/error.fixtures.spec';
import {
  CARDS_WITHOUT_DEFAULT,
  CARDS_WITH_ONE_DEFAULT,
  createDefaultFinancialCardFixture,
  createFinancialCardFixture,
  MockStripeService,
} from '@fixtures/stripe.fixtures.spec';
import { MockSubscriptionService, MAPPED_SUBSCRIPTIONS } from '@fixtures/subscriptions.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';

import { NewSubscriptionComponent } from './new-subscription.component';

describe('NewSubscriptionComponent', () => {
  let component: NewSubscriptionComponent;
  let fixture: ComponentFixture<NewSubscriptionComponent>;
  let stripeService: StripeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewSubscriptionComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: StripeService,
          useClass: MockStripeService,
        },
        {
          provide: ErrorsService,
          useClass: MockErrorService,
        },
        {
          provide: SubscriptionsService,
          useClass: MockSubscriptionService,
        },
        {
          provide: ScrollIntoViewService,
          useValue: {
            open() {
              return {
                result: Promise.resolve(true),
                componentInstance: {},
              };
            },
          },
        },
        {
          provide: NgbModal,
          useValue: {
            open() {
              return {
                result: Promise.resolve(true),
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
    fixture = TestBed.createComponent(NewSubscriptionComponent);
    component = fixture.componentInstance;
    component.subscription = MAPPED_SUBSCRIPTIONS[0];
    stripeService = TestBed.inject(StripeService);

    fixture.detectChanges();
  });

  describe('NgOnInit', () => {
    describe('Selected card', () => {
      describe('has default card', () => {
        beforeEach(() => {
          spyOn(stripeService, 'getCards').and.returnValue(of(CARDS_WITH_ONE_DEFAULT));
        });
        it('should set default card', () => {
          component.ngOnInit();

          expect(stripeService.getCards).toBeCalledTimes(1);
          expect(stripeService.getCards).toHaveBeenCalledWith(false);
          expect(component.selectedCard).toEqual(CARDS_WITH_ONE_DEFAULT[1]);
        });
      });
      describe('has not default card', () => {
        beforeEach(() => {
          spyOn(stripeService, 'getCards').and.returnValue(of(CARDS_WITHOUT_DEFAULT));
        });
        it('should set first card', () => {
          component.ngOnInit();

          expect(stripeService.getCards).toBeCalledTimes(1);
          expect(stripeService.getCards).toHaveBeenCalledWith(false);
          expect(component.selectedCard).toEqual(CARDS_WITHOUT_DEFAULT[0]);
        });
      });
      describe('has not default card', () => {
        beforeEach(() => {
          spyOn(stripeService, 'getCards').and.returnValue(of([]));
        });
        it('should set first card', () => {
          component.ngOnInit();

          expect(stripeService.getCards).toBeCalledTimes(1);
          expect(stripeService.getCards).toHaveBeenCalledWith(false);
          expect(component.selectedCard).toBeUndefined();
        });
      });
      describe('has error', () => {
        beforeEach(() => {
          spyOn(stripeService, 'getCards').and.returnValue(throwError('error'));
        });
        it('should set undefined', () => {
          component.ngOnInit();

          expect(stripeService.getCards).toBeCalledTimes(1);
          expect(stripeService.getCards).toHaveBeenCalledWith(false);
          expect(component.selectedCard).toBeUndefined();
        });
      });
    });
  });
});
