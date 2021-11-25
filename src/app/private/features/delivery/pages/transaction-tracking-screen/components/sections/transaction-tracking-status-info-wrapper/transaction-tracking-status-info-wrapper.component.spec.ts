import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  MOCK_TRANSACTION_TRACKING_DETAILS,
  MOCK_TRANSACTION_TRACKING_DETAILS_INFO_DEEPLINK_1,
} from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-details.fixtures.spec';
import { TransactionTrackingActionSelectorComponent } from '../../transaction-tracking-action-details/transaction-tracking-action-selector/transaction-tracking-action-selector.component';

import { TransactionTrackingStatusInfoWrapperComponent } from './transaction-tracking-status-info-wrapper.component';

describe('TransactionTrackingStatusInfoWrapperComponent', () => {
  let component: TransactionTrackingStatusInfoWrapperComponent;
  let fixture: ComponentFixture<TransactionTrackingStatusInfoWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingStatusInfoWrapperComponent, TransactionTrackingActionSelectorComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingStatusInfoWrapperComponent);
    component = fixture.componentInstance;
    component.transactionTrackingsStatusInfo = MOCK_TRANSACTION_TRACKING_DETAILS.info;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when getting transaction tracking details...', () => {
    describe('and we get the detail info slots', () => {
      it('should return the transaction tracking details mapped', () => {
        expect(component.transactionTrackingsStatusInfo).toStrictEqual([MOCK_TRANSACTION_TRACKING_DETAILS_INFO_DEEPLINK_1]);
      });
    });

    describe('and we show the slots', () => {
      it('should show the same slots as details', () => {
        const slots = fixture.debugElement.queryAll(By.directive(TransactionTrackingActionSelectorComponent)).length;
        expect(slots).toEqual([MOCK_TRANSACTION_TRACKING_DETAILS_INFO_DEEPLINK_1].length);
      });
    });
  });
});
