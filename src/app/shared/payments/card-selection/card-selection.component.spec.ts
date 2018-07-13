import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSelectionComponent } from './card-selection.component';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PaymentService } from '../../../core/payments/payment.service';
import { Observable } from 'rxjs/Observable';
import { FINANCIAL_CARD } from '../../../../tests/payments.fixtures.spec';

describe('CardSelectionComponent', () => {
  let component: CardSelectionComponent;
  let fixture: ComponentFixture<CardSelectionComponent>;
  let paymentService: PaymentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbButtonsModule, FormsModule],
      declarations: [ CardSelectionComponent ],
      providers: [{
        provide: PaymentService, useValue: {
          getFinancialCard() {
            return Observable.of(FINANCIAL_CARD);
          }
        }
      }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    paymentService = TestBed.get(PaymentService);
  });

  describe('ngOnInit', () => {

    it('should get and set financial card and emit true if present', () => {
      let resp: boolean;
      spyOn(paymentService, 'getFinancialCard').and.returnValue(Observable.of(FINANCIAL_CARD));
      component.hasCard.subscribe((hasCard: boolean) => {
        resp = hasCard;
      });

      component.ngOnInit();

      expect(component.financialCard).toEqual(FINANCIAL_CARD);
      expect(resp).toBe(true);
    });

    it('should get financial card and emit false if not present', () => {
      let resp: boolean;
      component.financialCard = undefined;
      spyOn(paymentService, 'getFinancialCard').and.returnValue(Observable.throw({}));
      component.hasCard.subscribe((hasCard: boolean) => {
        resp = hasCard;
      });

      component.ngOnInit();

      expect(component.financialCard).toBeUndefined();
      expect(resp).toBe(false);
    });
  });
});
