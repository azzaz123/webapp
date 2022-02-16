import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from '@shared/button/button.component';
import { ChangeStoreLocationModalComponent } from './change-store-location-modal.component';

describe('ChangeStoreLocationModal', () => {
  let component: ChangeStoreLocationModalComponent;
  let fixture: ComponentFixture<ChangeStoreLocationModalComponent>;
  let activeModal: NgbActiveModal;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ChangeStoreLocationModalComponent, ButtonComponent],
        providers: [NgbActiveModal],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeStoreLocationModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal);
    spyOn(activeModal, 'close').and.callThrough();
    spyOn(activeModal, 'dismiss').and.callThrough();
  });

  describe('CTA button', () => {
    it('should close modal', () => {
      const ctaButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;

      ctaButton.click();

      expect(activeModal.close).toHaveBeenCalledTimes(1);
      expect(activeModal.close).toHaveBeenCalledWith();
    });
  });

  describe('secondary button', () => {
    it('should dismiss modal', () => {
      const secondaryButton: HTMLElement = fixture.debugElement.query(By.css('.ChangeStoreLocationModal__secondaryAction')).nativeElement;

      secondaryButton.click();

      expect(activeModal.dismiss).toHaveBeenCalledTimes(1);
      expect(activeModal.dismiss).toHaveBeenCalledWith();
    });
  });

  describe('close button', () => {
    it('should dismiss modal', () => {
      const closeButton: HTMLElement = fixture.debugElement.query(By.css('.ChangeStoreLocationModal__close')).nativeElement;

      closeButton.click();

      expect(activeModal.dismiss).toHaveBeenCalledTimes(1);
      expect(activeModal.dismiss).toHaveBeenCalledWith();
    });
  });
});
