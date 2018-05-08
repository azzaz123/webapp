import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutExtrasProComponent } from './checkout-extras-pro.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PaymentService } from '../../../core/payments/payment.service';
import { Observable } from 'rxjs/Observable';
import { createPacksFixture, PREPARED_PACKS } from '../../../../tests/payments.fixtures.spec';


describe('CheckoutExtrasProComponent', () => {
  let component: CheckoutExtrasProComponent;
  let fixture: ComponentFixture<CheckoutExtrasProComponent>;
  let paymentService: PaymentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutExtrasProComponent ],
      providers: [
        {
          provide: PaymentService, useValue: {
            getPacks() {
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
    fixture = TestBed.createComponent(CheckoutExtrasProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    paymentService = TestBed.get(PaymentService);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(paymentService, 'getPacks').and.returnValue(Observable.of(createPacksFixture()));

      component.ngOnInit();
    });

    it('should call paymentsService getPacks method and return packs array', () => {
      expect(paymentService.getPacks).toHaveBeenCalled();
    });

    it('should preparePacks and return a understanding format', () => {
      expect(component.packs).toEqual(PREPARED_PACKS);
    });
  });
});
