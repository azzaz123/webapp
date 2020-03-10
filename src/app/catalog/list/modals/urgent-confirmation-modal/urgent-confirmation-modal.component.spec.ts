import { async, fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { UrgentConfirmationModalComponent } from './urgent-confirmation-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WindowRef } from '../../../../core/window/window.service';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { UserService } from '../../../../core/user/user.service';
import { Observable } from 'rxjs';
import { MOCK_USER } from '../../../../../tests/user.fixtures.spec';
import { MockTrackingService } from '../../../../../tests/tracking.fixtures.spec';
import { DecimalPipe } from '@angular/common';
import { CustomCurrencyPipe } from '../../../../shared/pipes';
import { PaymentService } from '../../../../core/payments/payment.service';
import { EventService } from '../../../../core/event/event.service';
import { CreditInfo } from '../../../../core/payments/payment.interface';

describe('UrgentConfirmationModalComponent', () => {
  let component: UrgentConfirmationModalComponent;
  let fixture: ComponentFixture<UrgentConfirmationModalComponent>;
  let activeModal: NgbActiveModal;
  let trackingService: TrackingService;
  let userService: UserService;
  let paymentService: PaymentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrgentConfirmationModalComponent, CustomCurrencyPipe],
      providers: [
        WindowRef,
        NgbActiveModal,
        DecimalPipe,
        EventService,
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: UserService, useValue: {
            me() {
              return Observable.of(MOCK_USER);
            }
          }
        },
        {
          provide: PaymentService, useValue: {
          getCreditInfo() {
            return Observable.of({});
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrgentConfirmationModalComponent);
    activeModal = TestBed.get(NgbActiveModal);
    trackingService = TestBed.get(TrackingService);
    userService = TestBed.get(UserService);
    paymentService = TestBed.get(PaymentService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    beforeEach(fakeAsync(() => {
      spyOn(trackingService, 'track');
    }));

    it('should send event featured_purchase_success if code == 200', () => {
      component.code = '200';
      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.URGENT_PURCHASE_SUCCESS);
    });

    it('should send event featured_purchase_error if code != 200', () => {
      component.code = '-1';
      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.URGENT_PURCHASE_ERROR, { error_code: component.code });
    });

    describe('ngOnInit', () => {
      it('should call and set credit info', fakeAsync(() => {
        const creditInfo: CreditInfo = {
          currencyName: 'wallacoins',
          credit: 200,
          factor: 100
        };
        spyOn(paymentService, 'getCreditInfo').and.returnValue(Observable.of(creditInfo));

        component.ngOnInit();
        tick(1000);

        expect(paymentService.getCreditInfo).toHaveBeenCalledWith(false);
        expect(component.withCoins).toBe(true);
        expect(component.creditInfo).toBe(creditInfo);
      }));
    });
  });
});
