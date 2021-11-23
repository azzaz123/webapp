import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from '@shared/button/button.component';

import { EmailThanksModalComponent } from './email-thanks-modal.component';

@Component({
  selector: 'tsl-svg-icon',
  template: '',
})
class MockSvgIconComponent {}

describe('EmailThanksModalComponent', () => {
  let component: EmailThanksModalComponent;
  let fixture: ComponentFixture<EmailThanksModalComponent>;
  let activeModal: NgbActiveModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailThanksModalComponent, MockSvgIconComponent, ButtonComponent],
      providers: [NgbActiveModal],
    }).compileComponents();
    activeModal = TestBed.inject(NgbActiveModal);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailThanksModalComponent);
    component = fixture.componentInstance;
    component.copies = {
      title: 'title',
      description: 'description',
      button: 'ok',
    };
    spyOn(activeModal, 'dismiss').and.callThrough();
    spyOn(activeModal, 'close').and.callThrough();
    fixture.detectChanges();
  });

  describe('when accept button is clicked', () => {
    it('should close modal', () => {
      const acceptButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;

      acceptButton.click();

      expect(activeModal.close).toHaveBeenCalled();
    });
  });

  describe('when close button is clicked', () => {
    it('should dismiss modal', () => {
      const closeButton: HTMLElement = fixture.debugElement.query(By.css('.EmailThanksModal__close')).nativeElement;

      closeButton.click();

      expect(activeModal.dismiss).toHaveBeenCalled();
    });
  });

  describe('when modal is loaded', () => {
    it('should shown the copies', () => {
      const title: HTMLElement = fixture.debugElement.query(By.css('.EmailThanksModal__title')).nativeElement;
      const description: HTMLElement = fixture.debugElement.query(By.css('.EmailThanksModal__subtitle')).nativeElement;
      const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;

      expect(title.innerHTML).toEqual('title');
      expect(description.innerHTML).toEqual('description');
      expect(button.textContent).toBe('ok');
    });
  });
});
