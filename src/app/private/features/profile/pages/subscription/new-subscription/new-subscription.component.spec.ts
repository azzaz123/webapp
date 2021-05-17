import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ErrorsService } from '@core/errors/errors.service';
import { ScrollIntoViewService } from '@core/scroll-into-view/scroll-into-view';
import { StripeService } from '@core/stripe/stripe.service';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MAPPED_SUBSCRIPTIONS, MockSubscriptionService } from '@fixtures/subscriptions.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import { NewSubscriptionComponent } from './new-subscription.component';

describe('NewSubscriptionComponent', () => {
  let component: NewSubscriptionComponent;
  let fixture: ComponentFixture<NewSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewSubscriptionComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: StripeService,
          useValue: {
            init() {},
            getCards() {
              return of([]);
            },
          },
        },
        {
          provide: ErrorsService,
          useValue: {
            show() {},
            i18nError() {},
            i18nSuccess() {},
          },
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
