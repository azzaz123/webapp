import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadModalComponent } from './upload-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UploadModalComponent', () => {
  let component: UploadModalComponent;
  let fixture: ComponentFixture<UploadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        NgbActiveModal
      ],
      declarations: [UploadModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
