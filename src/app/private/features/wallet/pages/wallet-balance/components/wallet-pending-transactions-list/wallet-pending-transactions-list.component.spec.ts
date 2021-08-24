import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MOCK_PENDING_TRANSACTIONS } from '@api/fixtures/bff/delivery/requests-and-transactions/pending-as-seller/pending-transactions-fixtures.spec';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { WalletPendingTransactionComponent } from '../wallet-pending-transaction/wallet-pending-transaction.component';
import { WalletPendingTransactionsListComponent } from './wallet-pending-transactions-list.component';

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
    component.pendingTransactions = MOCK_PENDING_TRANSACTIONS;
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
      const expected = MOCK_PENDING_TRANSACTIONS.length;
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
        component.pendingTransactions = [...MOCK_PENDING_TRANSACTIONS, ...MOCK_PENDING_TRANSACTIONS, ...MOCK_PENDING_TRANSACTIONS];
        fixture.detectChanges();
      });
      it('should show an expandable button container when there are more than two pending transactions', () => {
        const target = fixture.debugElement.query(By.css(walletPendingTransactionsExpandableButtonSelector));

        expect(target).toBeTruthy();
      });
      it('should show an expandable button when there are more than two pending transactions', () => {
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
    describe('GIVEN the transaction list collapsed', () => {
      beforeEach(() => {
        component.isExpanded = false;
      });
      it('should show the first transaction', () => {
        const result = component.isPendingTransactionVisible(0);

        expect(result).toBe(true);
      });
      it('should show the second transaction', () => {
        const result = component.isPendingTransactionVisible(1);

        expect(result).toBe(true);
      });
      it('should not show the third transaction', () => {
        const result = component.isPendingTransactionVisible(2);

        expect(result).toBe(false);
      });
    });
    describe('GIVEN the transaction list expanded', () => {
      beforeEach(() => {
        component.isExpanded = true;
      });
      it('should show the first transaction', () => {
        const result = component.isPendingTransactionVisible(0);

        expect(result).toBe(true);
      });
      it('should show the second transaction', () => {
        const result = component.isPendingTransactionVisible(1);

        expect(result).toBe(true);
      });
      it('should show the third transaction', () => {
        const result = component.isPendingTransactionVisible(2);

        expect(result).toBe(true);
      });
    });
  });
});
