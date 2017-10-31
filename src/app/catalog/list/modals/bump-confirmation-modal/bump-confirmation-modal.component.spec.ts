import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BumpConfirmationModalComponent } from './bump-confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('BumpConfirmationModalComponent', () => {
  let component: BumpConfirmationModalComponent;
  let fixture: ComponentFixture<BumpConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [NgbActiveModal],
      declarations: [ BumpConfirmationModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BumpConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
