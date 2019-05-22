import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs';
import { FINANCIAL_CARD } from '../../../../tests/payments.fixtures.spec';
import { StripeCardSelectionComponent } from './stripe-card-selection.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { FINANCIAL_CARD_OPTION } from '../../../../tests/stripe.fixtures.spec';

describe('CardSelectionComponent', () => {
  let component: StripeCardSelectionComponent;
  let fixture: ComponentFixture<StripeCardSelectionComponent>;
  let stripeService: StripeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbButtonsModule, FormsModule],
      declarations: [ StripeCardSelectionComponent ],
      providers: [{
        provide: StripeService, useValue: {
          getCards() {
            return Observable.of([FINANCIAL_CARD]);
          }
        }
      }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeCardSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    stripeService = TestBed.get(StripeService);
  });

  describe('ngOnInit', () => {

    it('should get and set financial card and emit true if present', () => {
      let resp: boolean;
      spyOn(stripeService, 'getCards').and.returnValue(Observable.of([FINANCIAL_CARD]));
      component.hasStripeCard.subscribe((hasCard: boolean) => {
        resp = hasCard;
      });

      component.ngOnInit();

      expect(component.financialCards).toEqual(FINANCIAL_CARD_OPTION);
      expect(resp).toBe(true);
    });

    it('should get financial card and emit false if not present', () => {
      let resp: boolean;
      component.financialCards = undefined;
      spyOn(stripeService, 'getCards').and.returnValue(Observable.throw({}));
      component.hasStripeCard.subscribe((hasCard: boolean) => {
        resp = hasCard;
      });

      component.ngOnInit();

      expect(component.financialCards).toBeUndefined();
      expect(resp).toBe(false);
    });
  });
});
