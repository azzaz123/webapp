import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmationModalComponent } from './confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { COLORS } from '@core/colors/colors-constants';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

describe('ConfirmationModalComponent', () => {
  const cancelButtonSelector = '#cancelButton';
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;
  let i18nService: I18nService;
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
    i18nService = TestBed.inject(I18nService);
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

  describe('when the cancel message is indicated...', () => {
    beforeEach(() => {
      spyOn(i18nService, 'translate');
      component.properties.cancelMessage = 'Laia';

      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not call the translation service', () => {
      expect(i18nService.translate).not.toHaveBeenCalled();
    });
    it('should show the custom message on the cancel button', () => {
      const cancelButton = debugElement.query(By.css(cancelButtonSelector)).nativeNode;
      expect(cancelButton.innerHTML).toBe('Laia');
    });
  });

  describe('when the cancel message is NOT indicated...', () => {
    beforeEach(() => {
      spyOn(i18nService, 'translate').and.returnValue('Delete');
      component.properties.cancelMessage = null;

      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should call the translation service', () => {
      expect(i18nService.translate).toHaveBeenCalledWith(TRANSLATION_KEY.CANCEL_BUTTON);
      expect(i18nService.translate).toHaveBeenCalledTimes(1);
    });
    it('should show the default message on the cancel button', () => {
      const cancelButton = debugElement.query(By.css(cancelButtonSelector)).nativeNode;
      expect(cancelButton.innerHTML).toBe('Delete');
    });
  });
});
