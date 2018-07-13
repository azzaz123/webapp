import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSelectionComponent } from './card-selection.component';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PaymentService } from '../../../core/payments/payment.service';
import { Observable } from 'rxjs/Observable';
import { FINANCIAL_CARD } from '../../../../tests/payments.fixtures.spec';

describe('CardSelectionComponent', () => {
  let component: CardSelectionComponent;
  let fixture: ComponentFixture<CardSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbButtonsModule, FormsModule],
      declarations: [ CardSelectionComponent ],
      providers: [{
        provide: PaymentService, useValue: {
          getFinancialCard() {
            return Observable.of(FINANCIAL_CARD);
          }
        }
      }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
