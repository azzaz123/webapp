import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';

import { MOCK_PENDING_TRANSACTIONS } from '@api/fixtures/core/pending-transactions-fixtures.spec';
import { PendingTransaction } from '@api/core/model';
import { RequestsAndTransactionsPendingAsSellerService } from '@api/bff/delivery/requests-and-transactions/pending-as-seller/requests-and-transactions-pending-as-seller.service';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { WalletPendingTransactionComponent } from '../wallet-pending-transaction/wallet-pending-transaction.component';
import { WalletPendingTransactionsComponent } from './wallet-pending-transactions.component';
import { WalletPendingTransactionsListComponent } from '../wallet-pending-transactions-list/wallet-pending-transactions-list.component';
import { WalletSharedErrorActionService } from '@private/features/wallet/shared/error-action';

import { By } from '@angular/platform-browser';
import { Observable, of, throwError } from 'rxjs';

describe('GIVEN the WalletPendingTransactionsComponent', () => {
  let component: WalletPendingTransactionsComponent;
  let errorActionService: WalletSharedErrorActionService;
  let fixture: ComponentFixture<WalletPendingTransactionsComponent>;
  let mockPendingTransactions$: Observable<PendingTransaction[]> = of(MOCK_PENDING_TRANSACTIONS);
  let service: RequestsAndTransactionsPendingAsSellerService;
  let spyTransactionsPendingService;
  const walletPendingTransactionsSelector = '.WalletPendingTransactions';
  const walletPendingTransactionsLabelSelector = `${walletPendingTransactionsSelector}__label`;
  const walletPendingTransactionsLabelAmountSelector = `${walletPendingTransactionsLabelSelector} span:nth-child(2)`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WalletPendingTransactionComponent,
        WalletPendingTransactionsListComponent,
        WalletPendingTransactionsComponent,
        SvgIconComponent,
      ],
      providers: [
        {
          provide: RequestsAndTransactionsPendingAsSellerService,
          useValue: {
            get walletPendingTransactions$() {
              return mockPendingTransactions$;
            },
          },
        },
        {
          provide: WalletSharedErrorActionService,
          useValue: {
            show(data?: unknown): void {},
          },
        },
      ],
    }).compileComponents();
    service = TestBed.inject(RequestsAndTransactionsPendingAsSellerService);
    errorActionService = TestBed.inject(WalletSharedErrorActionService);
  });

  beforeEach(() => {
    spyTransactionsPendingService = jest.spyOn(service, 'walletPendingTransactions$', 'get');
    fixture = TestBed.createComponent(WalletPendingTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('WHEN displaying the wallet pending transactions', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
    });
    it('should call to the service to retrieve the list of pending transactions', () => {
      expect(spyTransactionsPendingService).toHaveBeenCalledTimes(1);
    });

    describe('WHEN there are some pending transactions', () => {
      it('should retrieve the list of pending transactions', () => {
        service.walletPendingTransactions$.subscribe((result) => {
          expect(result).toEqual(MOCK_PENDING_TRANSACTIONS);
        });
      });
      it('should show the pending transactions block', () => {
        const target = fixture.debugElement.query(By.css(walletPendingTransactionsSelector));

        expect(target).toBeTruthy();
      });
      it('should show the pending transactions summary', () => {
        const target = fixture.debugElement.query(By.css(walletPendingTransactionsLabelSelector));

        expect(target).toBeTruthy();
      });
      it('should show the amount of pending transactions', () => {
        const expected = `(${MOCK_PENDING_TRANSACTIONS.length})`;
        const target = fixture.debugElement.query(By.css(walletPendingTransactionsLabelAmountSelector));

        expect(target.nativeElement.innerHTML).toBe(expected);
      });
      it('should show the list of pending transactions', () => {
        const expected = MOCK_PENDING_TRANSACTIONS.length;
        const target = fixture.debugElement.queryAll(By.directive(WalletPendingTransactionComponent));

        expect(target.length).toBe(expected);
      });
    });
    describe('WHEN there is an error retrieving the pending transactions', () => {
      let errorActionSpy;

      beforeEach(() => {
        errorActionSpy = spyOn(errorActionService, 'show');
      });
      it('should show the generic error catcher', fakeAsync(() => {
        jest.spyOn(service, 'walletPendingTransactions$', 'get').mockReturnValue(throwError('The server is broken'));

        component.walletPendingTransactions$.subscribe(
          () => {},
          (error) => {
            expect(errorActionSpy).toHaveBeenCalledTimes(1);
            flush();
          }
        );
      }));
    });
  });
});

describe('GIVEN the WalletPendingTransactionsComponent', () => {
  let component: WalletPendingTransactionsComponent;
  let fixture: ComponentFixture<WalletPendingTransactionsComponent>;
  let mockPendingTransactions$: Observable<PendingTransaction[]> = of([]);
  let service: RequestsAndTransactionsPendingAsSellerService;
  let spyTransactionsPendingService;
  const walletPendingTransactionsSelector = '.WalletPendingTransactions';
  const walletPendingTransactionsLabelSelector = `${walletPendingTransactionsSelector}__label`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WalletPendingTransactionComponent,
        WalletPendingTransactionsListComponent,
        WalletPendingTransactionsComponent,
        SvgIconComponent,
      ],
      providers: [
        {
          provide: RequestsAndTransactionsPendingAsSellerService,
          useValue: {
            get walletPendingTransactions$() {
              return mockPendingTransactions$;
            },
          },
        },
        {
          provide: WalletSharedErrorActionService,
          useValue: {
            show(data?: unknown): void {},
          },
        },
      ],
    }).compileComponents();
    service = TestBed.inject(RequestsAndTransactionsPendingAsSellerService);
  });

  beforeEach(() => {
    spyTransactionsPendingService = jest.spyOn(service, 'walletPendingTransactions$', 'get');
    fixture = TestBed.createComponent(WalletPendingTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('WHEN displaying the wallet pending transactions', () => {
    describe('WHEN there are no pending transactions', () => {
      it('should retrieve the list of pending transactions', () => {
        service.walletPendingTransactions$.subscribe((result) => {
          expect(result).toEqual(0);
        });
      });
      it('should show the pending transactions block', () => {
        const target = fixture.debugElement.query(By.css(walletPendingTransactionsSelector));

        expect(target).toBeTruthy();
      });
      it('should not show the pending transactions summary', () => {
        const target = fixture.debugElement.query(By.css(walletPendingTransactionsLabelSelector));

        expect(target).toBeFalsy();
      });
      it('should not show any pending transactions', () => {
        const expected = 0;
        const target = fixture.debugElement.queryAll(By.directive(WalletPendingTransactionComponent));

        expect(target.length).toBe(expected);
      });
    });
  });
});
