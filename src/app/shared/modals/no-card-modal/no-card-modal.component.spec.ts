import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StripeService } from '../../../core/stripe/stripe.service';
import { NoCardModalComponent } from './no-card-modal.component';
import { FINANCIAL_CARD } from '../../../../tests/payments.fixtures.spec';

describe('NewCardModalComponent', () => {
  let component: NoCardModalComponent;
  let fixture: ComponentFixture<NoCardModalComponent>;
  let activeModal: NgbActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [NoCardModalComponent],
        providers: [
          {
            provide: NgbActiveModal, useValue: {
              close() {
              },
              dismiss() {
              }
            }
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    activeModal = TestBed.get(NgbActiveModal);
  });

  describe('onCreateCard', () => {
    it('should close the modal with a string', () => {
      spyOn(activeModal, 'close');

      component.openChangeCardModal();

      expect(activeModal.close).toHaveBeenCalledWith('changeCardModal');
    });

  });

});
