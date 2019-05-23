import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs';
import { FINANCIAL_CARD, FINANCIAL_STRIPE_CARD } from '../../../../tests/payments.fixtures.spec';
import { StripeCardSelectionComponent } from './stripe-card-selection.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { FINANCIAL_CARD_OPTION } from '../../../../tests/stripe.fixtures.spec';
import { EventService } from '../../../core/event/event.service';

describe('StripeCardSelectionComponent', () => {
  let component: StripeCardSelectionComponent;
  let fixture: ComponentFixture<StripeCardSelectionComponent>;
  let stripeService: StripeService;
  let eventService: EventService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbButtonsModule, FormsModule],
      declarations: [ StripeCardSelectionComponent ],
      providers: [
        EventService,
        {
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
    eventService = TestBed.get(EventService);
  });

  describe('ngOnInit', () => {

    it('should get and set financial card and emit true if present', () => {
      spyOn(stripeService, 'getCards').and.returnValue(Observable.of([FINANCIAL_STRIPE_CARD]));
      spyOn(component.hasStripeCard, 'emit');


      component.ngOnInit();

      expect(component.financialCards[0]).toEqual(FINANCIAL_CARD_OPTION[0]);
      expect(component.hasStripeCard.emit).toHaveBeenCalledWith(!!component.financialCards);
    });

    it('should get financial card and emit false if not present', () => {
      component.financialCards = undefined;
      spyOn(stripeService, 'getCards').and.returnValue(Observable.throw({}));
      spyOn(component.hasStripeCard, 'emit');

      component.ngOnInit();

      expect(component.financialCards).toBeUndefined();
      expect(component.hasStripeCard.emit).toHaveBeenCalledWith(false);
    });
  });
});
