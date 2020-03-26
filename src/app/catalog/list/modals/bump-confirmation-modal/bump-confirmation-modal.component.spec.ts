
import {of as observableOf,  Observable } from 'rxjs';
import { fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { BumpConfirmationModalComponent } from './bump-confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { UserService } from '../../../../core/user/user.service';
import { MockTrackingService } from '../../../../../tests/tracking.fixtures.spec';
import { MOCK_USER } from '../../../../../tests/user.fixtures.spec';
import { PaymentService } from '../../../../core/payments/payment.service';
import { CustomCurrencyPipe } from '../../../../shared/pipes';
import { DecimalPipe } from '@angular/common';
import { EventService } from '../../../../core/event/event.service';
import { CreditInfo } from '../../../../core/payments/payment.interface';

let component: BumpConfirmationModalComponent;
let fixture: ComponentFixture<BumpConfirmationModalComponent>;
let trackingService: TrackingService;
let userService: UserService;
let paymentService: PaymentService;
let eventService: EventService;
const CURRENCY = 'wallacoins';
const CREDITS = 1000;
const CREDIT_INFO: CreditInfo = {
  currencyName: CURRENCY,
  credit: CREDITS,
  factor: 100
};

describe('BumpConfirmationModalComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [BumpConfirmationModalComponent, CustomCurrencyPipe],
        providers: [
          NgbActiveModal,
          DecimalPipe,
          EventService,
          {provide: TrackingService, useClass: MockTrackingService},
          {
            provide: UserService, useValue: {
            me() {
              return observableOf(MOCK_USER);
            }
          }
          },
          {
            provide: PaymentService, useValue: {
              getCreditInfo() {
                return observableOf(CREDIT_INFO);
              }
            }
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(BumpConfirmationModalComponent);
    component = fixture.componentInstance;
    trackingService = TestBed.get(TrackingService);
    userService = TestBed.get(UserService);
    paymentService = TestBed.get(PaymentService);
    eventService = TestBed.get(EventService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(trackingService, 'track');
    });

    it('should send event featured_purchase_success if code == 200', () => {
      component.code = '200';

      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.FEATURED_PURCHASE_SUCCESS);
    });

    it('should send event featured_purchase_error if code != 200', () => {
      component.code = '-1';

      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.FEATURED_PURCHASE_ERROR, { error_code: component.code });
    });

    it('should call getCreditInfo and set currency and coins total', fakeAsync (() => {
      spyOn(paymentService, 'getCreditInfo').and.callThrough();
      spyOn(eventService, 'emit');

      component.ngOnInit();
      tick(1000);

      expect(paymentService.getCreditInfo).toHaveBeenCalled();
      expect(component.withCoins).toBe(true);
      expect(component.creditInfo).toBe(CREDIT_INFO);
      expect(eventService.emit).toHaveBeenCalledWith(EventService.TOTAL_CREDITS_UPDATED, CREDITS);
    }));
  });

});
