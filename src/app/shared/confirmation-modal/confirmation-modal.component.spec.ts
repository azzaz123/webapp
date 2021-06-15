import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmationModalComponent } from './confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { COLORS } from '@core/colors/colors-constants';
import { I18nService } from '@core/i18n/i18n.service';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;
  let activeModal: NgbActiveModal;
  let debugElement: DebugElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [NgbActiveModal, I18nService],
        declarations: [ConfirmationModalComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal);
    debugElement = fixture.debugElement;
    component.properties = {
      title: 'Title',
      description: 'Description',
      confirmMessage: 'Confirm',
      confirmColor: COLORS.NEGATIVE_MAIN,
    };

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('when clicking the cancel button', () => {
    it('should close modal without response', () => {
      spyOn(activeModal, 'close');
      spyOn(activeModal, 'dismiss');

      debugElement.query(By.css('#cancelButton')).nativeElement.click();

      expect(activeModal.dismiss).toHaveBeenCalled();
      expect(activeModal.close).not.toHaveBeenCalled();
    });
  });

  describe('when clicking the continue button', () => {
    it('should close modal with response', () => {
      spyOn(activeModal, 'close');
      spyOn(activeModal, 'dismiss');

      debugElement.query(By.css('#confirmButton')).nativeElement.click();

      expect(activeModal.close).toHaveBeenCalled();
      expect(activeModal.dismiss).not.toHaveBeenCalled();
    });
  });
});
