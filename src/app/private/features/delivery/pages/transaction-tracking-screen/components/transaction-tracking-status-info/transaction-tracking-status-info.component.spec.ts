import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTrackingStatusInfoComponent } from './transaction-tracking-status-info.component';

describe('TransactionTrackingStatusInfoComponent', () => {
  let component: TransactionTrackingStatusInfoComponent;
  let fixture: ComponentFixture<TransactionTrackingStatusInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingStatusInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingStatusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
