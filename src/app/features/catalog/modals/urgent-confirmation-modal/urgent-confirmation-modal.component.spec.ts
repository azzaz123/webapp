import { of } from 'rxjs';
import {
  fakeAsync,
  ComponentFixture,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { UrgentConfirmationModalComponent } from './urgent-confirmation-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TrackingService } from '@core/tracking/tracking.service';
import { UserService } from '@core/user/user.service';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { MockTrackingService } from '@fixtures/tracking.fixtures.spec';
import { DecimalPipe } from '@angular/common';
import { CustomCurrencyPipe } from '@shared/pipes';
import { PaymentService } from '@core/payments/payment.service';
import { EventService } from '@core/event/event.service';
import { CreditInfo } from '@core/payments/payment.interface';
import { environment } from 'environments/environment';

describe('UrgentConfirmationModalComponent', () => {
  let component: UrgentConfirmationModalComponent;
  let fixture: ComponentFixture<UrgentConfirmationModalComponent>;
  let activeModal: NgbActiveModal;
  let trackingService: TrackingService;
  let userService: UserService;
  let paymentService: PaymentService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UrgentConfirmationModalComponent, CustomCurrencyPipe],
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
                return of({});
              },
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UrgentConfirmationModalComponent);
    activeModal = TestBed.inject(NgbActiveModal);
    trackingService = TestBed.inject(TrackingService);
    userService = TestBed.inject(UserService);
    paymentService = TestBed.inject(PaymentService);
    component = fixture.componentInstance;
    appboy.initialize(environment.appboy);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    beforeEach(fakeAsync(() => {
      spyOn(trackingService, 'track');
    }));

    it('should send event featured_purchase_success if code == 200', () => {
      component.code = '200';
      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(
        TrackingService.URGENT_PURCHASE_SUCCESS
      );
    });

    it('should send event featured_purchase_error if code != 200', () => {
      component.code = '-1';
      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(
        TrackingService.URGENT_PURCHASE_ERROR,
        {
          error_code: component.code,
        }
      );
    });

    describe('ngOnInit', () => {
      it('should call and set credit info', fakeAsync(() => {
        const creditInfo: CreditInfo = {
          currencyName: 'wallacoins',
          credit: 200,
          factor: 100,
        };
        spyOn(paymentService, 'getCreditInfo').and.returnValue(of(creditInfo));

        component.ngOnInit();
        tick(1000);

        expect(paymentService.getCreditInfo).toHaveBeenCalledWith(false);
        expect(component.withCoins).toBe(true);
        expect(component.creditInfo).toBe(creditInfo);
      }));

      it('should send appboy VisibilityPurchaseSuccess event if code == 200', () => {
        spyOn(appboy, 'logCustomEvent');
        component.code = '200';

        component.ngOnInit();

        expect(appboy.logCustomEvent).toHaveBeenCalledWith(
          'VisibilityPurchaseSuccess',
          {
            platform: 'web',
          }
        );
      });
    });
  });
});