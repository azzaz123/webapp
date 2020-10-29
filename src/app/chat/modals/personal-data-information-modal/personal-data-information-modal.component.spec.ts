import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from 'app/shared/button/button.component';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PersonalDataInformationModal } from './personal-data-information-modal.component';

describe('MaliciousConversationModalComponent', () => {
  let component: PersonalDataInformationModal;
  let activeModal: NgbActiveModal;
  let fixture: ComponentFixture<PersonalDataInformationModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonComponent, PersonalDataInformationModal ],
      providers: [ NgbActiveModal ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDataInformationModal);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when clicking on main button', () => {
    it('should dismiss the modal', () => {
      spyOn(activeModal, 'dismiss');
      const mainButton = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;

      mainButton.click();

      expect(activeModal.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('when clicking on cross button', () => {
    it('should close the modal', () => {
      spyOn(activeModal, 'close');
      const closeButtonElement = fixture.debugElement.query(By.css('.close')).nativeElement;

      closeButtonElement.click();

      expect(activeModal.close).toHaveBeenCalledWith(true);
    });
  });
});
