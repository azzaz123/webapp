import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardModalComponent } from './credit-card-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FINANCIAL_CARD } from '../../../../../tests/payments.fixtures.spec';

describe('CreditCardModalComponent', () => {
  let component: CreditCardModalComponent;
  let fixture: ComponentFixture<CreditCardModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [NgbActiveModal],
      declarations: [CreditCardModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardModalComponent);
    component = fixture.componentInstance;
    component.financialCard = FINANCIAL_CARD;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
