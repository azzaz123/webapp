import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaliciousConversationModalComponent } from './malicious-conversation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from 'app/shared/button/button.component';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MaliciousConversationModalComponent', () => {
  let component: MaliciousConversationModalComponent;
  let activeModal: NgbActiveModal;
  let fixture: ComponentFixture<MaliciousConversationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonComponent, MaliciousConversationModalComponent ],
      providers: [ NgbActiveModal ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaliciousConversationModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when clicking on main button', () => {
    it('should close the modal', () => {
      spyOn(activeModal, 'close');
      const CTAButtonElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;

      CTAButtonElement.click();

      expect(activeModal.close).toHaveBeenCalledWith(true);
    });
  });

  describe('when clicking on cross button', () => {
    it('should dismiss the modal', () => {
      spyOn(activeModal, 'dismiss');
      const closeButtonElement = fixture.debugElement.query(By.css('.MaliciousConversationModal__close')).nativeElement;

      closeButtonElement.click();

      expect(activeModal.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  // TODO: TNS-946 - https://wallapop.atlassian.net/browse/TNS-946
  describe('Analytics', () => {
    describe('when displaying modal', () => {
      it('should track modal was viewed', () => {});
    });
  });
});
