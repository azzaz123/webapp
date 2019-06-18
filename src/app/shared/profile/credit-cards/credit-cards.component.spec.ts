import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PaymentService } from '../../../core/payments/payment.service';
import { FINANCIAL_CARD } from '../../../../tests/payments.fixtures.spec';
import { I18nService } from '../../../core/i18n/i18n.service';
import { CreditCardsComponent } from './credit-cards.component';

describe('CreditCardsComponent', () => {
  let component: CreditCardsComponent;
  let fixture: ComponentFixture<CreditCardsComponent>;
  let paymentService: PaymentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [CreditCardsComponent],
        providers: [
          I18nService,
          {
            provide: PaymentService, useValue: {
            getFinancialCard() {
              return Observable.of(FINANCIAL_CARD);
            }
          }
          }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    paymentService = TestBed.get(PaymentService);
  });

  describe('ngOnInit', () => {
    it('should get the credit card', () => {
      spyOn(paymentService, 'getFinancialCard').and.callThrough();
      
      component.ngOnInit();
      
      expect(component.financialCard).toEqual(FINANCIAL_CARD);
    });
  });

  describe('onDeleteCard', () => {
    it('should detele the card', () => {
      component.onDeleteCard();
      
      expect(component.financialCard).toBe(null);
    });
    
  });
  
});
