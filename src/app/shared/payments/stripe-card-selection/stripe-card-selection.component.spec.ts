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
import { I18nService } from '../../../core/i18n/i18n.service';

describe('StripeCardSelectionComponent', () => {
  let component: StripeCardSelectionComponent;
  let fixture: ComponentFixture<StripeCardSelectionComponent>;
  let stripeService: StripeService;
  let eventService: EventService;
  let i18nService: I18nService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbButtonsModule, FormsModule],
      declarations: [ StripeCardSelectionComponent ],
      providers: [
        EventService,
        I18nService,
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
    i18nService = TestBed.get(I18nService);
  });

  describe('ngOnInit', () => {

    it('should get and set financial card and emit true if present', () => {
      spyOn(stripeService, 'getCards').and.returnValue(Observable.of([FINANCIAL_STRIPE_CARD]));
      spyOn(component.hasStripeCard, 'emit');

      component.ngOnInit();

      expect(component.financialCards[0]).toEqual(FINANCIAL_CARD_OPTION[0]);
      expect(component.hasStripeCard.emit).toHaveBeenCalledWith(true);
    });

    it('should get financial card and emit false if not present', () => {
      component.financialCards = undefined;
      spyOn(stripeService, 'getCards').and.returnValue(Observable.throw({}));
      spyOn(component.hasStripeCard, 'emit');

      component.ngOnInit();

      expect(component.financialCards).toBeUndefined();
      expect(component.hasStripeCard.emit).toHaveBeenCalledWith(false);
    });

    it('should ask to i18nService for `noResultsFound` translation', () => {
      spyOn(i18nService, 'getTranslations').and.callThrough();

      component.ngOnInit();

      expect(i18nService.getTranslations).toHaveBeenCalledTimes(1);
      expect(i18nService.getTranslations).toHaveBeenCalledWith('noResultsFound');
    });
  });
});