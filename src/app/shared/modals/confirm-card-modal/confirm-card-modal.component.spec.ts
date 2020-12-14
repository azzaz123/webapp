import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmCardModalComponent } from './confirm-card-modal.component';

describe('ConfirmCardModalComponent', () => {
  let component: ConfirmCardModalComponent;
  let fixture: ComponentFixture<ConfirmCardModalComponent>;
  let activeModal: NgbActiveModal;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ConfirmCardModalComponent],
        providers: [
          {
            provide: NgbActiveModal,
            useValue: {
              close() {},
              dismiss() {},
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    activeModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmChange', () => {
    it('should close the modal with a string', () => {
      spyOn(activeModal, 'close');

      component.confirmChange();

      expect(activeModal.close).toHaveBeenCalledWith('changeCardModal');
    });
  });
});
