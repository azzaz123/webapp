import { of } from 'rxjs';
import {
  fakeAsync,
  ComponentFixture,
  TestBed,
  tick,
} from '@angular/core/testing';
import { WallacoinsDisabledModalComponent } from './wallacoins-disabled-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackingService } from '@core/tracking/tracking.service';
import { UserService } from '@core/user/user.service';
import { MockTrackingService } from '@fixtures/tracking.fixtures.spec';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { PaymentService } from '@core/payments/payment.service';
import { CustomCurrencyPipe } from '@shared/pipes';
import { DecimalPipe } from '@angular/common';
import { EventService } from '@core/event/event.service';
import { CreditInfo } from '@core/payments/payment.interface';
import { environment } from 'environments/environment';

let component: WallacoinsDisabledModalComponent;
let fixture: ComponentFixture<WallacoinsDisabledModalComponent>;
let trackingService: TrackingService;
let userService: UserService;
let paymentService: PaymentService;
let eventService: EventService;
const CURRENCY = 'wallacoins';
const CREDITS = 1000;
const CREDIT_INFO: CreditInfo = {
  currencyName: CURRENCY,
  credit: CREDITS,
  factor: 100,
};

describe('WallacoinsDisabledModalComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WallacoinsDisabledModalComponent, CustomCurrencyPipe],
      providers: [
        NgbActiveModal,
        DecimalPipe,
        EventService,
        { provide: TrackingService, useClass: MockTrackingService },
        {
          provide: UserService,
          useValue: {
            me() {
              return of(MOCK_USER);
            },
          },
        },
        {
          provide: PaymentService,
          useValue: {
            getCreditInfo() {
              return of(CREDIT_INFO);
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(WallacoinsDisabledModalComponent);
    component = fixture.componentInstance;
    trackingService = TestBed.inject(TrackingService);
    userService = TestBed.inject(UserService);
    paymentService = TestBed.inject(PaymentService);
    eventService = TestBed.inject(EventService);
    appboy.initialize(environment.appboy);
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

      expect(trackingService.track).toHaveBeenCalledWith(
        TrackingService.FEATURED_PURCHASE_SUCCESS
      );
    });

    it('should send event featured_purchase_error if code != 200', () => {
      component.code = '-1';

      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(
        TrackingService.FEATURED_PURCHASE_ERROR,
        {
          error_code: component.code,
        }
      );
    });

    it('should call getCreditInfo and set currency and coins total', fakeAsync(() => {
      spyOn(paymentService, 'getCreditInfo').and.callThrough();
      spyOn(eventService, 'emit');

      component.ngOnInit();
      tick(1000);

      expect(paymentService.getCreditInfo).toHaveBeenCalled();
      expect(component.withCoins).toBe(true);
      expect(component.creditInfo).toBe(CREDIT_INFO);
      expect(eventService.emit).toHaveBeenCalledWith(
        EventService.TOTAL_CREDITS_UPDATED,
        CREDITS
      );
    }));

    it('should send appboy VisibilityPurchaseSuccess event', () => {
      spyOn(appboy, 'logCustomEvent');
      component.code = '200';

      component.ngOnInit();

      expect(
        appboy.logCustomEvent
      ).toHaveBeenCalledWith('VisibilityPurchaseSuccess', { platform: 'web' });
    });
  });
});
