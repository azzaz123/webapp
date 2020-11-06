import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeProModalComponent } from './become-pro-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('BecomeProModalComponent', () => {
  let component: BecomeProModalComponent;
  let fixture: ComponentFixture<BecomeProModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BecomeProModalComponent],
      providers: [NgbActiveModal],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeProModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
