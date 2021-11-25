import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTrackingActionDialogComponent } from './transaction-tracking-action-dialog.component';

describe('TransactionTrackingActionDialogComponent', () => {
  let component: TransactionTrackingActionDialogComponent;
  let fixture: ComponentFixture<TransactionTrackingActionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingActionDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
