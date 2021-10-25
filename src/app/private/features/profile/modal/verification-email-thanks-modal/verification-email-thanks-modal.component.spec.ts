import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { VerificationEmailThanksModalComponent } from './verification-email-thanks-modal.component';

@Component({
  selector: 'tsl-button',
  template: '',
})
class MockButtonComponent {}

@Component({
  selector: 'tsl-svg-icon',
  template: '',
})
class MockSvgIconComponent {}

describe('VerificationEmailThanksModalComponent', () => {
  let component: VerificationEmailThanksModalComponent;
  let fixture: ComponentFixture<VerificationEmailThanksModalComponent>;
  let activeModal: NgbActiveModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerificationEmailThanksModalComponent, MockSvgIconComponent, MockButtonComponent],
      providers: [NgbActiveModal],
    }).compileComponents();
    activeModal = TestBed.inject(NgbActiveModal);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationEmailThanksModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(activeModal, 'dismiss').and.callThrough();
    spyOn(activeModal, 'close').and.callThrough();
  });

  describe('when accept button is clicked', () => {
    it('should close modal', () => {
      const acceptButton: HTMLElement = fixture.debugElement.query(By.directive(MockButtonComponent)).nativeElement;

      acceptButton.click();

      expect(activeModal.close).toHaveBeenCalled();
    });
  });

  describe('when close button is clicked', () => {
    it('should dismiss modal', () => {
      const closeButton: HTMLElement = fixture.debugElement.query(By.css('.VerificationEmailThanksModal__close')).nativeElement;

      closeButton.click();

      expect(activeModal.dismiss).toHaveBeenCalled();
    });
  });
});
