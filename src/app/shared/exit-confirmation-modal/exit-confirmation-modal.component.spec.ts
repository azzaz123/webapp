import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitConfirmationModalComponent } from './exit-confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_ITEM } from '../../../tests/item.fixtures.spec';

describe('ExitConfirmationModalComponent', () => {
  let component: ExitConfirmationModalComponent;
  let fixture: ComponentFixture<ExitConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExitConfirmationModalComponent],
      providers: [NgbActiveModal],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitConfirmationModalComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
