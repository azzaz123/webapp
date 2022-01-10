import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';

import { MOCK_PENDING_TRANSACTIONS } from '@api/fixtures/core/model/delivery/pending-transactions-fixtures.spec';
import { MockSharedErrorActionService } from '@fixtures/private/wallet/shared/wallet-shared-error-action.fixtures.spec';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { WalletPendingTransactionComponent } from '../wallet-pending-transaction/wallet-pending-transaction.component';
import { WalletPendingTransactionsComponent } from './wallet-pending-transactions.component';
import { WalletPendingTransactionsListComponent } from '../wallet-pending-transactions-list/wallet-pending-transactions-list.component';
import { SharedErrorActionService } from '@shared/error-action';

import { By } from '@angular/platform-browser';
import { Observable, of, throwError } from 'rxjs';
import { DeliveriesOngoingService } from '@api/bff/delivery/deliveries/ongoing/deliveries-ongoing.service';
import {
  MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_SELLER,
  MOCK_EMPTY_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS,
} from '@api/fixtures/core/model/delivery/deliveries/ongoing/delivery-pending-transactions-and-requests.fixtures.spec';
import { DeliveryPendingTransactionsAndRequests } from '@api/core/model/delivery';

describe('GIVEN the WalletPendingTransactionsComponent', () => {
  let component: WalletPendingTransactionsComponent;
  let errorActionService: SharedErrorActionService;
  let fixture: ComponentFixture<WalletPendingTransactionsComponent>;
  let mockpendingTransactionsAsSeller: Observable<DeliveryPendingTransactionsAndRequests> = of(
    MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_SELLER
  );
  let service: DeliveriesOngoingService;
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
          provide: DeliveriesOngoingService,
          useValue: {
            get pendingTransactionsAndRequestsAsSeller() {
              return mockpendingTransactionsAsSeller;
            },
          },
        },
        {
          provide: SharedErrorActionService,
          useValue: MockSharedErrorActionService,
        },
      ],
    }).compileComponents();
    service = TestBed.inject(DeliveriesOngoingService);
    errorActionService = TestBed.inject(SharedErrorActionService);
  });

  beforeEach(() => {
    spyTransactionsPendingService = jest.spyOn(service, 'pendingTransactionsAndRequestsAsSeller', 'get');
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
        service.pendingTransactionsAndRequestsAsSeller.subscribe((result) => {
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

    describe('WHEN there are no pending transactions', () => {
      beforeEach(() => {
        spyTransactionsPendingService = jest
          .spyOn(service, 'pendingTransactionsAndRequestsAsSeller', 'get')
          .mockReturnValue(of(MOCK_EMPTY_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS));
        fixture = TestBed.createComponent(WalletPendingTransactionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should retrieve the list of pending transactions', () => {
        service.pendingTransactionsAndRequestsAsSeller.subscribe((result) => {
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

// FIXME: This could be
describe('GIVEN the WalletPendingTransactionsComponent', () => {
  let component: WalletPendingTransactionsComponent;
  let errorActionService: SharedErrorActionService;
  let fixture: ComponentFixture<WalletPendingTransactionsComponent>;
  let service: DeliveriesOngoingService;
  let spyTransactionsPendingService: jest.SpyInstance;

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
          provide: DeliveriesOngoingService,
          useValue: {
            get pendingTransactionsAndRequestsAsSeller() {
              return throwError('There is an error!');
            },
          },
        },
        {
          provide: SharedErrorActionService,
          useValue: MockSharedErrorActionService,
        },
      ],
    }).compileComponents();
    service = TestBed.inject(DeliveriesOngoingService);
    errorActionService = TestBed.inject(SharedErrorActionService);
  });

  beforeEach(() => {
    spyTransactionsPendingService = jest.spyOn(service, 'pendingTransactionsAndRequestsAsSeller', 'get');
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

    describe('WHEN there is an error retrieving the pending transactions', () => {
      let errorActionSpy;

      beforeEach(() => {
        errorActionSpy = spyOn(errorActionService, 'show');
      });
      it('should show the generic error catcher', fakeAsync(() => {
        jest.spyOn(service, 'pendingTransactionsAndRequestsAsSeller', 'get').mockReturnValue(throwError('The server is broken'));

        component.pendingTransactionsAsSeller.subscribe(
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
