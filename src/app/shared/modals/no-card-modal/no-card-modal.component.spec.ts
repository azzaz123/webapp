import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NoCardModalComponent } from './no-card-modal.component';

describe('NoCardModalComponent', () => {
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
    activeModal = TestBed.inject(NgbActiveModal);
  });

  describe('onDeleteCard', () => {
    it('should close the modal with a string', () => {
      spyOn(activeModal, 'close');

      component.deleteCard();

      expect(activeModal.close).toHaveBeenCalledWith('deleteCardModal');
    });

  });

});
