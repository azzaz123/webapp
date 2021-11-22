import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { TransactionTrackingActionsService } from '@private/features/delivery/services/transaction-tracking/transaction-tracking-actions/transaction-tracking-actions.service';
import { TransactionDetailComponent } from '../../transaction-detail/transaction-detail.component';
import { mapTransactionsTrackingInfo } from '../../../mappers/transaction-tracking-info.mapper';
import { TransactionTrackingStatusInfoComponent } from './transaction-tracking-status-info.component';

describe('TransactionTrackingStatusInfoComponent', () => {
  const MOCK_STATUS_INFO = MOCK_TRANSACTION_TRACKING.statusInfo;
  let component: TransactionTrackingStatusInfoComponent;
  let fixture: ComponentFixture<TransactionTrackingStatusInfoComponent>;
  let transactionTrackingActionsService: TransactionTrackingActionsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingStatusInfoComponent, TransactionDetailComponent],
      providers: [{ provide: TransactionTrackingActionsService, useValue: { manageAction() {} } }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingStatusInfoComponent);
    component = fixture.componentInstance;
    transactionTrackingActionsService = TestBed.inject(TransactionTrackingActionsService);
    component.transactionTrackingStatusInfo = MOCK_STATUS_INFO;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when getting transaction tracking status info...', () => {
    it('should have the same transaction tracking detail info as slots', () => {
      const detailInfoSlots = fixture.debugElement.queryAll(By.directive(TransactionDetailComponent));
      expect(detailInfoSlots.length).toEqual(component.transactionTrackingStatusInfo.length);
    });

    describe('and we get the detail info slots', () => {
      it('should return the transaction tracking status info mapped', () => {
        expect(component.detailInfoSlots).toStrictEqual(mapTransactionsTrackingInfo(MOCK_STATUS_INFO));
      });
    });

    MOCK_STATUS_INFO.forEach((action, index) => {
      describe('and we click on the slot', () => {
        it('should manage the provided action', () => {
          spyOn(transactionTrackingActionsService, 'manageAction');
          const slot: DebugElement = fixture.debugElement.queryAll(By.directive(TransactionDetailComponent))[index];

          slot.triggerEventHandler('actionClick', component.transactionTrackingStatusInfo[index].action);

          expect(transactionTrackingActionsService.manageAction).toHaveBeenCalledTimes(1);
          expect(transactionTrackingActionsService.manageAction).toHaveBeenCalledWith(action.action);
        });
      });
    });
  });
});
