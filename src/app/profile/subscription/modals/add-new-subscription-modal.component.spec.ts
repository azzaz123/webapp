import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSubscriptionModalComponent } from './add-new-subscription-modal.component';
import { UserService } from '../../core/user/user.service';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CUSTOM_REASON, MOCK_USER, REASONS, SELECTED_REASON } from '../../../../tests/user.fixtures.spec';
import { EventService } from '../../../core/event/event.service';
import { environment } from '../../../../environments/environment';
import { AccessTokenService } from '../../../core/http/access-token.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { PaymentService } from '../../../core/payments/payment.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { StripeService } from '../../../core/stripe/stripe.service';

describe('AddNewSubscriptionModalComponent', () => {
  let component: AddNewSubscriptionModalComponent;
  let fixture: ComponentFixture<AddNewSubscriptionModalComponent>;
  let userService: UserService;
  let activeModal: NgbActiveModal;
  let accessTokenService: AccessTokenService;
  let event: EventService;
  let paymentService: PaymentService;
  let eventService: EventService;
  let errorService: ErrorsService;
  let modalSpy: jasmine.Spy;
  let stripeService: StripeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewSubscriptionModalComponent],
      providers: [
        {
          provide: UserService, useValue: {
          getUnsubscribeReasons() {
            return Observable.of(REASONS);
          },
          unsubscribe() {
            return Observable.of({});
          },
          me() {
            return Observable.of(MOCK_USER);
          },
          getMotorPlan() {
            return Observable.of();
          }
        }
        },
        {
          provide: NgbActiveModal, useValue: {
            close() {
            }
        }
        },
        {
          provide: AccessTokenService, useValue: {
          deleteAccessToken() {
          }
        }
        },
        {
          provide: EventService, useValue: {
            emit() {
            }
        }
        },
        {
            provide: ErrorsService, useValue: {
              show() {
                return Observable.of({});
              },
              i18nError() {
              }
            }
          },
          {
            provide: StripeService, useValue: {
              isPaymentMethodStripe$() {
                return Observable.of(true);
              }
          }
          },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewSubscriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userService = TestBed.get(UserService);
    activeModal = TestBed.get(NgbActiveModal);
    accessTokenService = TestBed.get(AccessTokenService);
    event = TestBed.get(EventService);
  });


});