import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { CreditCardInfoComponent } from './credit-card-info.component';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PaymentService } from '../../../core/payments/payment.service';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { FINANCIAL_CARD } from '../../../../tests/payments.fixtures.spec';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from '../../../core/i18n/i18n.service';

describe('CreditCardInfoComponent', () => {
  let component: CreditCardInfoComponent;
  let fixture: ComponentFixture<CreditCardInfoComponent>;
  let paymentService: PaymentService;
  let stripeService: StripeService;
  let modalService: NgbModal;
  let toastrService: ToastrService;
  const componentInstance: any = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreditCardInfoComponent],
      providers: [
        I18nService,
        {
          provide: PaymentService, useValue: {
          getFinancialCard() {
            return Observable.of(FINANCIAL_CARD);
          },
          deleteFinancialCard() {
            return Observable.of({})
          }
        }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: componentInstance
              }
            }
        }
        },
        {
          provide: StripeService, useValue: {
          isPaymentMethodStripe() {
            return true
          },
          deleteCard() {
            return Observable.of({})
          }
        }
        },
        {
          provide: ToastrService, useValue: {
          error() {
          }
        }
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    paymentService = TestBed.get(PaymentService);
    stripeService = TestBed.get(StripeService);
    modalService = TestBed.get(NgbModal);
    toastrService = TestBed.get(ToastrService);
  });

  describe('ngOnInit', () => {
    it('should get if Stripe is used', () => {
      component.ngOnInit();

      expect(component.isStripe).toBe(true);
    });
  });

  describe('deleteCreditCard', () => {

    beforeEach(fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(paymentService, 'deleteFinancialCard').and.callThrough();

      component.deleteCreditCard();
    }));

    it('should open modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent, {
        windowClass: 'modal-prompt'
      });
      expect(componentInstance.type).toBe(4);
    });

    it('should call deleteFinancialCard and rest card', () => {
      expect(paymentService.deleteFinancialCard).toHaveBeenCalled();
      expect(component.financialCard).toBeNull();
    });
  });

  describe('deleteStripeCreditCard', () => {
    let deleteStripeCardButton;
    const event = new MouseEvent('click');
    beforeEach(fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(stripeService, 'deleteCard').and.callThrough();
      spyOn(component.onDeleteStripeCard, 'emit');
      spyOn(component, 'deleteStripeCard').and.callThrough();
      spyOn(event, 'preventDefault');
      deleteStripeCardButton = fixture.debugElement.nativeElement.querySelector('a');
      deleteStripeCardButton.click();
    }));

    it('should open modal', () => {
      component.deleteStripeCard(event);

      expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent, {
        windowClass: 'modal-prompt'
      });
      expect(componentInstance.type).toBe(4);
      expect(component.onDeleteStripeCard.emit).toHaveBeenCalledWith(FINANCIAL_CARD);
    });

    it('should call deleteCard and rest card', () => {
      component.deleteStripeCard(event);

      expect(stripeService.deleteCard).toHaveBeenCalled();
      expect(component.financialCard).toBeNull();
    });
  });

});
