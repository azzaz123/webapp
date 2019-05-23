import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FINANCIAL_STRIPE_CARD } from '../../../../tests/payments.fixtures.spec';
import { I18nService } from '../../../core/i18n/i18n.service';
import { StripeCardsComponent } from './stripe-cards.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from '../../../core/errors/errors.service';

describe('StripeCardsComponent', () => {
  let component: StripeCardsComponent;
  let fixture: ComponentFixture<StripeCardsComponent>;
  let stripeService: StripeService;
  let modalService: NgbModal;
  let errorsService: ErrrorsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [StripeCardsComponent],
        providers: [
          ErrorsService,
          I18nService,
          {
            provide: StripeService, useValue: {
            getCards() {
              return Observable.of([FINANCIAL_STRIPE_CARD]);
            }
          }
          },
          {
            provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(true)
              };
            }
          }
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    stripeService = TestBed.get(StripeService);
    modalService = TestBed.get(NgbModal);
    errorsService = TestBed.get(ErrorsService);
  });

  describe('ngOnInit', () => {
    it('should get the credit cards', () => {
    });
  });

  describe('onDeleteCard', () => {
    it('should delete the card', () => {
    });

  });

  describe('onAddNewCard', () => {
    it('should add the card', () => {
    });

  });

});
