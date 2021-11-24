import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { mapTransactionsDetail } from '../../../mappers/transaction-detail.mapper';
import { TransactionTrackingStatusInfoComponent } from './transaction-tracking-status-info.component';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { TransactionDetailSelectorComponent } from '../../transaction-details/transaction-detail-selector/transaction-detail-selector.component';

describe('TransactionTrackingStatusInfoComponent', () => {
  const MOCK_STATUS_INFO = MOCK_TRANSACTION_TRACKING.statusInfo;
  let component: TransactionTrackingStatusInfoComponent;
  let fixture: ComponentFixture<TransactionTrackingStatusInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingStatusInfoComponent, TransactionDetailSelectorComponent],
      imports: [ImageFallbackModule],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingStatusInfoComponent);
    component = fixture.componentInstance;
    component.transactionTrackingStatusInfo = MOCK_STATUS_INFO;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when getting transaction tracking status info...', () => {
    it('should have the same transaction tracking detail info as slots', () => {
      const detailInfoSlots = fixture.debugElement.queryAll(By.directive(TransactionDetailSelectorComponent));
      expect(detailInfoSlots.length).toEqual(component.transactionTrackingStatusInfo.length);
    });

    describe('and we get the detail info slots', () => {
      it('should return the transaction tracking status info mapped', () => {
        expect(component.detailInfoSlots).toStrictEqual(mapTransactionsDetail(MOCK_STATUS_INFO));
      });
    });
  });
});
