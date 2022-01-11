import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { WalletPendingTransactionComponent } from '../wallet-pending-transaction/wallet-pending-transaction.component';
import { WalletPendingTransactionsListComponent } from './wallet-pending-transactions-list.component';
import { MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_SELLER } from '@api/fixtures/core/model/delivery/deliveries/ongoing/delivery-pending-transactions-and-requests.fixtures.spec';

describe('GIVEN WalletPendingTransactionsListComponent', () => {
  let component: WalletPendingTransactionsListComponent;
  let fixture: ComponentFixture<WalletPendingTransactionsListComponent>;
  const svgIconSelector = 'tsl-svg-icon';
  const walletPendingTransactionsAnimationSelector = '.WalletPendingTransactionsList__transactions--animated';
  const walletPendingTransactionSelector = 'tsl-wallet-pending-transaction';
  const walletPendingTransactionsExpandableButtonSelector = '.WalletPendingTransactionsList__expandable-button';
  const walletPendingTransactionsExpandableButtonRotatedSelector = `${walletPendingTransactionsExpandableButtonSelector}--rotated`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletPendingTransactionComponent, WalletPendingTransactionsListComponent, SvgIconComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletPendingTransactionsListComponent);
    component = fixture.componentInstance;
    component.pendingTransactions = MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_SELLER.transactions;
    fixture.detectChanges();
  });

  describe('WHEN displaying the transaction list', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('should not have an animation', () => {
      const target = fixture.debugElement.query(By.css(walletPendingTransactionsAnimationSelector));

      expect(target).toBeFalsy();
    });
    it('should set a specific height for the outer container', () => {
      const expected = { height: '0px' };
      const target = component.transactionsWrapperStyle;

      expect(target).toEqual(expected);
    });
    it('should show as many wallet pending transactions as there are pending transactions', () => {
      const expected = MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_SELLER.transactions.length;
      const target = fixture.debugElement.queryAll(By.css(walletPendingTransactionSelector));

      expect(target.length).toEqual(expected);
    });
    it('should not have an expandable button when there is only one pending transaction', () => {
      const target = fixture.debugElement.query(By.css(walletPendingTransactionsExpandableButtonSelector));

      expect(target).toBeFalsy();
    });
    it('should not have an expandable button when there is only two pending transactions', () => {
      const target = fixture.debugElement.query(By.css(walletPendingTransactionsExpandableButtonSelector));

      expect(target).toBeFalsy();
    });
    it('should activate the animation when the view is fully visible', () => {
      component.ngAfterViewInit();
      const target = fixture.debugElement.query(By.css(walletPendingTransactionsAnimationSelector));

      expect(target).toBeTruthy();
    });

    describe('GIVEN more than two pending transactions', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(WalletPendingTransactionsListComponent);
        component = fixture.componentInstance;
        const MOCK_TRANSACTION = MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_SELLER.transactions[0];
        component.pendingTransactions = [MOCK_TRANSACTION, MOCK_TRANSACTION, MOCK_TRANSACTION];
        fixture.detectChanges();
      });
      it('should show an expandable button container', () => {
        const target = fixture.debugElement.query(By.css(walletPendingTransactionsExpandableButtonSelector));

        expect(target).toBeTruthy();
      });
      it('should show an expandable button', () => {
        const target = fixture.debugElement.queryAll(By.css(svgIconSelector));
        const expected = 1;

        expect(target.length).toBe(expected);
      });
      it('should show the expandable button without apply rotation', () => {
        const target = fixture.debugElement.query(By.css(walletPendingTransactionsExpandableButtonRotatedSelector));

        expect(target).toBeFalsy();
      });
      it('should show the expandable button with rotation applied', () => {
        component.toggleShowAllTransactions();
        const target = fixture.debugElement.query(By.css(walletPendingTransactionsExpandableButtonRotatedSelector));

        expect(target).toBeTruthy();
      });
    });
    describe.each([
      [false, 0, true],
      [false, 1, true],
      [false, 2, false],
      [true, 0, true],
      [true, 1, true],
      [true, 2, true],
    ])('GIVEN the transaction list collapsed/expanded', (isExpanded, index, expected) => {
      it('should show or not show the corresponding transaction', () => {
        component.isExpanded = isExpanded;
        const result = component.isPendingTransactionVisible(index);

        expect(result).toBe(expected);
      });
    });
  });
});
