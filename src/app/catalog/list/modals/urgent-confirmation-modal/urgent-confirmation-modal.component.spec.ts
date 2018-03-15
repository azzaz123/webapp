import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrgentConfirmationModalComponent } from './urgent-confirmation-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WindowRef } from '../../../../core/window/window.service';

describe('UrgentConfirmationModalComponent', () => {
  let component: UrgentConfirmationModalComponent;
  let fixture: ComponentFixture<UrgentConfirmationModalComponent>;
  let activeModal: NgbActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrgentConfirmationModalComponent ],
      providers: [
        WindowRef,
        NgbActiveModal
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrgentConfirmationModalComponent);
    activeModal = TestBed.get(NgbActiveModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
