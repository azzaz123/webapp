import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { CreditCardInfoComponent } from './credit-card-info.component';
import { PaymentService } from '../../core/payments/payment.service';
import { Observable } from 'rxjs/Observable';
import { FINANCIAL_CARD } from '../../../tests/payments.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CreditCardInfoComponent', () => {
  let component: CreditCardInfoComponent;
  let fixture: ComponentFixture<CreditCardInfoComponent>;
  let paymentService: PaymentService;
  let modalService: NgbModal;
  const componentInstance: any = {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreditCardInfoComponent],
      providers: [
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
        }
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
    modalService = TestBed.get(NgbModal);
  });

  describe('ngOnInit', () => {
    it('should call getFinancialCard and set it', () => {
      spyOn(paymentService, 'getFinancialCard').and.callThrough();

      component.ngOnInit();

      expect(paymentService.getFinancialCard).toHaveBeenCalled();
      expect(component.financialCard).toEqual(FINANCIAL_CARD);
    });
  });

  describe('deleteCreditCard', () => {

    beforeEach(fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(paymentService, 'deleteFinancialCard').and.callThrough();

      component.deleteCreditCard();
    }));

    it('should open modal', () => {
      expect(modalService.open).toHaveBeenCalled();
      expect(componentInstance.type).toBe(4);
    });

    it('should call deleteFinancialCard and rest card', () => {
      expect(paymentService.deleteFinancialCard).toHaveBeenCalled();
      expect(component.financialCard).toBeNull();
    });
  });
});
