import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDetailWithoutActionComponent } from './transaction-detail-without-action.component';

describe('TransactionDetailWithoutActionComponent', () => {
  let component: TransactionDetailWithoutActionComponent;
  let fixture: ComponentFixture<TransactionDetailWithoutActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionDetailWithoutActionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailWithoutActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
