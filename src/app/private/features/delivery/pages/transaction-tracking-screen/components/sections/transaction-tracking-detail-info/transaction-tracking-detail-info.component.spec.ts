import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_TRANSACTION_TRACKING_DETAILS } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-details.fixtures.spec';
import { MOCK_TRANSACTION_DETAILS } from '@fixtures/private/delivery/transactional-tracking-screen/transaction-details.fixtures.spec';
import { TransactionTrackingActionSelectorComponent } from '../../transaction-tracking-action-details/transaction-tracking-action-selector/transaction-tracking-action-selector.component';

import { TransactionTrackingDetailInfoComponent } from './transaction-tracking-detail-info.component';

describe('TransactionTrackingDetailInfoComponent', () => {
  let component: TransactionTrackingDetailInfoComponent;
  let fixture: ComponentFixture<TransactionTrackingDetailInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingDetailInfoComponent, TransactionTrackingActionSelectorComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingDetailInfoComponent);
    component = fixture.componentInstance;
    component.transactionTrackingDetails = MOCK_TRANSACTION_TRACKING_DETAILS.info;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when getting transaction tracking details...', () => {
    describe('and we get the detail info slots', () => {
      it('should return the transaction tracking details mapped', () => {
        expect(component.detailInfoSlots).toStrictEqual(MOCK_TRANSACTION_DETAILS);
      });
    });

    describe('and we show the slots', () => {
      it('should show the same slots as details', () => {
        const slots = fixture.debugElement.queryAll(By.directive(TransactionTrackingActionSelectorComponent)).length;
        expect(slots).toEqual(MOCK_TRANSACTION_DETAILS.length);
      });
    });
  });
});
