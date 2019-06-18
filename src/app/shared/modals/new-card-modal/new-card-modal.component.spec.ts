import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StripeService } from '../../../core/stripe/stripe.service';
import { NewCardModalComponent } from './new-card-modal.component';
import { Observable } from 'rxjs/index';
import { FINANCIAL_CARD, PAYMENT_METHOD_DATA } from '../../../../tests/payments.fixtures.spec';

describe('NewCardModalComponent', () => {
  let component: NewCardModalComponent;
  let fixture: ComponentFixture<NewCardModalComponent>;
  let activeModal: NgbActiveModal;
  let stripeService: StripeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [NewCardModalComponent],
        providers: [
          {
            provide: NgbActiveModal, useValue: {
            close() {
            },
            dismiss() {
            }
          }
          },
          {
            provide: StripeService, useValue: {
            mapResponse() {
              return FINANCIAL_CARD
            }
          }
          },
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    activeModal = TestBed.get(NgbActiveModal);
    stripeService = TestBed.get(StripeService);
  });

  describe('onCreateCard', () => {
    it('should close the modal with a FinancialCard', () => {
      spyOn(stripeService, 'mapResponse').and.returnValue(FINANCIAL_CARD);
      spyOn(activeModal, 'close');

      component.onCreateCard(PAYMENT_METHOD_DATA);

      expect(activeModal.close).toHaveBeenCalledWith(FINANCIAL_CARD);
    });

  });


});
