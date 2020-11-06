import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteInfoConfirmationModalComponent } from './delete-info-confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DeleteInfoConfirmationModalComponent', () => {
  let component: DeleteInfoConfirmationModalComponent;
  let fixture: ComponentFixture<DeleteInfoConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [NgbActiveModal],
      declarations: [DeleteInfoConfirmationModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteInfoConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
