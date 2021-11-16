import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { TransactionTrackingActionsService } from '@private/features/delivery/services/transaction-tracking/transaction-tracking-actions/transaction-tracking-actions.service';

import { TransactionTrackingStatusInfoComponent } from './transaction-tracking-status-info.component';

describe('TransactionTrackingStatusInfoComponent', () => {
  let component: TransactionTrackingStatusInfoComponent;
  let fixture: ComponentFixture<TransactionTrackingStatusInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingStatusInfoComponent],
      providers: [{ provide: TransactionTrackingActionsService, useValue: { manageAction() {} } }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingStatusInfoComponent);
    component = fixture.componentInstance;
    component.transactionTrackingStatusInfo = MOCK_TRANSACTION_TRACKING.statusInfo;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
