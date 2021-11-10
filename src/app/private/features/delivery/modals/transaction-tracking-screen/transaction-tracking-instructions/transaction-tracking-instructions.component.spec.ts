import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTrackingInstructionsComponent } from './transaction-tracking-instructions.component';

describe('TransactionTrackingInstructionsComponent', () => {
  let component: TransactionTrackingInstructionsComponent;
  let fixture: ComponentFixture<TransactionTrackingInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingInstructionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
