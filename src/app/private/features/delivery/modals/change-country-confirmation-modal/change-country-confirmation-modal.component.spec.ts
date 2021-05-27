import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ChangeCountryConfirmationModalComponent } from './change-country-confirmation-modal.component';

describe('ChangeCountryConfirmationModalComponent', () => {
  let component: ChangeCountryConfirmationModalComponent;
  let fixture: ComponentFixture<ChangeCountryConfirmationModalComponent>;
  let activeModal: NgbActiveModal;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeCountryConfirmationModalComponent],
      providers: [
        {
          provide: NgbActiveModal,
          useValue: {
            close() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeCountryConfirmationModalComponent);
    activeModal = TestBed.inject(NgbActiveModal);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when clicking the cancel button', () => {
    it('should close modal without response', () => {
      spyOn(activeModal, 'close');

      debugElement.query(By.css('#cancelButton')).nativeElement.click();

      expect(activeModal.close).toHaveBeenCalled();
      expect(activeModal.close).not.toHaveBeenCalledWith(true);
    });
  });

  describe('when clicking the continue button', () => {
    it('should close modal with response', () => {
      spyOn(activeModal, 'close');

      debugElement.query(By.css('.btn-warn')).nativeElement.click();

      expect(activeModal.close).toHaveBeenCalledWith(true);
    });
  });
});
