import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PaymentSuccessModalComponent } from './payment-success-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

describe('PaymentSuccessModalComponent', () => {
  let component: PaymentSuccessModalComponent;
  let fixture: ComponentFixture<PaymentSuccessModalComponent>;
  let activeModal: NgbActiveModal;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSuccessModalComponent ],
      providers: [
        {
          provide: NgbActiveModal, useValue: {
            close() {
            }
          }
        },
        {
          provide: Router, useValue: {
            navigate() {
            }
          }
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSuccessModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.get(NgbActiveModal);
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  describe('close', () => {
    it('should close the modal and redirect to the profile', () => {
      spyOn(activeModal, 'close');
      spyOn(router, 'navigate');

      component.close();

      expect(activeModal.close).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['profile/info']);
    })
  })
});