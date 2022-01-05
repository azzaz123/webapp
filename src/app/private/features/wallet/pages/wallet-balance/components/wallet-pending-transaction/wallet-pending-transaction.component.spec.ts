import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletPendingTransactionComponent } from './wallet-pending-transaction.component';
import { MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_SELLER } from '@api/fixtures/core/model/delivery/deliveries/ongoing/delivery-pending-transactions-and-requests.fixtures.spec';

describe('GIVEN WalletPendingTransactionComponent', () => {
  let component: WalletPendingTransactionComponent;
  let fixture: ComponentFixture<WalletPendingTransactionComponent>;
  const pendingTransaction = MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_SELLER.transactions[0];
  const pendingTransactionItemAmountSelector = '.WalletPendingTransaction__amount';
  const pendingTransactionItemImageSelector = '.WalletPendingTransaction__image';
  const pendingTransactionItemTitleSelector = '.WalletPendingTransaction__title';
  let spyMoneyToString;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletPendingTransactionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletPendingTransactionComponent);
    component = fixture.componentInstance;
    component.walletPendingTransaction = pendingTransaction;
    spyMoneyToString = spyOn(component.walletPendingTransaction.moneyAmount, 'toString').and.callThrough();
    fixture.detectChanges();
  });

  describe('WHEN displaying the pending transaction item', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('should show the item title', () => {
      const target = fixture.debugElement.query(By.css(pendingTransactionItemTitleSelector)).nativeElement;
      expect(target).toBeTruthy();
      expect(target.innerHTML).toBe(pendingTransaction.item.title);
    });
    it('should display the item image', () => {
      const target = fixture.debugElement.query(By.css(pendingTransactionItemImageSelector)).nativeElement;
      expect(target.style['background-image']).toBe(`url(${pendingTransaction.item.imageUrl})`);
    });
    it('should show the item amount', () => {
      const target = fixture.debugElement.query(By.css(pendingTransactionItemAmountSelector)).nativeElement;

      expect(target).toBeTruthy();
      expect(target.innerHTML).toBe(pendingTransaction.moneyAmount.toString());
      expect(spyMoneyToString).toHaveBeenCalledWith(true);
    });
  });
});
