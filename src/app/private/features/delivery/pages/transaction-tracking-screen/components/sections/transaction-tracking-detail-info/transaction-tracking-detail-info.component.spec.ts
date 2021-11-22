import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_TRANSACTION_TRACKING_DETAILS } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-details.fixtures.spec';
import { MOCK_TRANSACTION_TRACKING_DETAILS_TO_TRANSACTIONS_DETAIL } from '@fixtures/private/delivery/transactional-tracking-screen/transaction-details.fixtures.spec';
import { TransactionTrackingActionsService } from '@private/features/delivery/services/transaction-tracking/transaction-tracking-actions/transaction-tracking-actions.service';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { mapTransactionsDetail } from '../../../mappers/transaction-detail.mapper';
import { TransactionDetailComponent } from '../../transaction-detail/transaction-detail.component';

import { TransactionTrackingDetailInfoComponent } from './transaction-tracking-detail-info.component';

describe('TransactionTrackingDetailInfoComponent', () => {
  let component: TransactionTrackingDetailInfoComponent;
  let fixture: ComponentFixture<TransactionTrackingDetailInfoComponent>;
  let transactionTrackingActionsService: TransactionTrackingActionsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingDetailInfoComponent, TransactionDetailComponent],
      imports: [ImageFallbackModule],
      providers: [{ provide: TransactionTrackingActionsService, useValue: { manageAction() {} } }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingDetailInfoComponent);
    component = fixture.componentInstance;
    transactionTrackingActionsService = TestBed.inject(TransactionTrackingActionsService);
    component.transactionTrackingDetails = MOCK_TRANSACTION_TRACKING_DETAILS;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when getting transaction tracking details...', () => {
    it('should have the same transaction tracking detail info as slots', () => {
      const detailInfoSlots = fixture.debugElement.queryAll(By.directive(TransactionDetailComponent));
      expect(detailInfoSlots.length).toEqual(MOCK_TRANSACTION_TRACKING_DETAILS.info.length);
    });

    describe('and we get the detail info slots', () => {
      it('should return the transaction tracking status info mapped', () => {
        expect(component.detailInfoSlots).toStrictEqual(MOCK_TRANSACTION_TRACKING_DETAILS_TO_TRANSACTIONS_DETAIL);
      });
    });

    MOCK_TRANSACTION_TRACKING_DETAILS.info.forEach((action, index) => {
      describe('and we click on the slot', () => {
        it('should manage the provided action', () => {
          spyOn(transactionTrackingActionsService, 'manageAction');
          const slot: DebugElement = fixture.debugElement.queryAll(By.directive(TransactionDetailComponent))[index];

          slot.nativeElement.click();

          expect(transactionTrackingActionsService.manageAction).toHaveBeenCalledTimes(1);
          expect(transactionTrackingActionsService.manageAction).toHaveBeenCalledWith(action.action);
        });
      });
    });
  });
});
