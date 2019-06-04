import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PAYMENT_METHOD_CARD_RESPONSE } from '../../../../tests/payments.fixtures.spec';
import { StripeCardElementComponent } from './stripe-card-element.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';

describe('StripeCardElementComponent', () => {
  let component: StripeCardElementComponent;
  let fixture: ComponentFixture<StripeCardElementComponent>;
  let stripeService: StripeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [StripeCardElementComponent],
        imports:      [
          ReactiveFormsModule,
          FormsModule
        ],
        providers:    [
          I18nService,
          {
            provide: StripeService, useValue: {
              createStripeCard() {
                return PAYMENT_METHOD_CARD_RESPONSE;
              }
          }
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeCardElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    stripeService = TestBed.get(StripeService);
  });

});