import { of } from 'rxjs';
import { fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { BumpConfirmationModalComponent } from './bump-confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserService } from '@core/user/user.service';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { PaymentService } from '@core/payments/payment.service';
import { CustomCurrencyPipe } from '@shared/pipes';
import { DecimalPipe } from '@angular/common';
import { EventService } from '@core/event/event.service';
import { CreditInfo } from '@core/payments/payment.interface';
import { environment } from 'environments/environment';

let component: BumpConfirmationModalComponent;
let fixture: ComponentFixture<BumpConfirmationModalComponent>;
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

describe('BumpConfirmationModalComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BumpConfirmationModalComponent, CustomCurrencyPipe],
      providers: [
        NgbActiveModal,
        DecimalPipe,
        EventService,
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
    fixture = TestBed.createComponent(BumpConfirmationModalComponent);
    component = fixture.componentInstance;
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
    it('should call getCreditInfo and set currency and coins total', fakeAsync(() => {
      spyOn(paymentService, 'getCreditInfo').and.callThrough();
      spyOn(eventService, 'emit');

      component.ngOnInit();
      tick(1000);

      expect(paymentService.getCreditInfo).toHaveBeenCalled();
      expect(component.withCoins).toBe(true);
      expect(component.creditInfo).toBe(CREDIT_INFO);
      expect(eventService.emit).toHaveBeenCalledWith(EventService.TOTAL_CREDITS_UPDATED, CREDITS);
    }));

    it('should send appboy VisibilityPurchaseSuccess event', () => {
      spyOn(appboy, 'logCustomEvent');
      component.code = '200';

      component.ngOnInit();

      expect(appboy.logCustomEvent).toHaveBeenCalledWith('VisibilityPurchaseSuccess', { platform: 'web' });
    });
  });
});
