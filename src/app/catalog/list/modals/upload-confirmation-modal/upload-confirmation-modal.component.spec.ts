import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadConfirmationModalComponent } from './upload-confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UploadConfirmationModalComponent', () => {
  let component: UploadConfirmationModalComponent;
  let fixture: ComponentFixture<UploadConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadConfirmationModalComponent ],
      providers: [
        NgbActiveModal
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
