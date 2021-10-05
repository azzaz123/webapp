import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { WalletBalanceHistoryService } from '@api/bff/delivery/wallets/balance_history/wallet-balance-history.service';
import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';
import { WalletMovementsHistoryList } from '@api/core/model/wallet/history/wallet-movements-history-list.interface';
import {
  MOCK_WALLET_MOVEMENTS_HISTORY_LIST_FIRST_PAGE,
  MOCK_WALLET_MOVEMENTS_HISTORY_LIST_LAST_PAGE,
} from '@api/fixtures/core/model/wallet/history/wallet-movements-history-list.fixtures.spec';
import {
  MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS,
  MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS_WITH_ALL_ELEMENTS,
} from '@shared/historic-list/fixtures/historic-list.fixtures.spec';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { ReplaySubject } from 'rxjs';
import { WalletHistoryMovementsUIService } from './wallet-history-movements-ui.service';

describe('WalletHistoryMovementsUIService', () => {
  let service: WalletHistoryMovementsUIService;
  let walletBalanceHistoryService: WalletBalanceHistoryService;
  let walletBalanceGetSpy: jasmine.Spy;

  const defaultFilter: WALLET_HISTORY_FILTERS = WALLET_HISTORY_FILTERS.ALL;
  const walletBalanceReplaySubject: ReplaySubject<WalletMovementsHistoryList> = new ReplaySubject<WalletMovementsHistoryList>(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WalletHistoryMovementsUIService,
        { provide: WalletBalanceHistoryService, useValue: { get: () => walletBalanceReplaySubject.asObservable() } },
      ],
    });
    service = TestBed.inject(WalletHistoryMovementsUIService);
    walletBalanceHistoryService = TestBed.inject(WalletBalanceHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should notify there are more items', () => {
    expect(service.noMoreItemsAvailable).toBe(false);
  });

  describe('when getting more elements', () => {
    beforeEach(() => {
      walletBalanceGetSpy = spyOn(walletBalanceHistoryService, 'get').and.callThrough();
      service.getItems(defaultFilter);
    });

    it('should notify loading state', () => {
      let loadingResult: boolean;

      service.loading$.subscribe((data) => (loadingResult = data));

      expect(loadingResult).toBe(true);
    });

    it('should ask API for data', () => {
      expect(walletBalanceHistoryService.get).toHaveBeenCalledTimes(1);
    });

    it('should pass filter to API service', () => {
      expect(walletBalanceHistoryService.get).toHaveBeenCalledWith(defaultFilter, 0);
    });

    describe('and when server responses', () => {
      beforeEach(() => {
        walletBalanceReplaySubject.next(MOCK_WALLET_MOVEMENTS_HISTORY_LIST_FIRST_PAGE);
      });

      it('should notify loading state ended', () => {
        let loadingResult: boolean;

        service.loading$.subscribe((data) => (loadingResult = data));

        expect(loadingResult).toBe(false);
      });

      it('should notify current elements list', () => {
        let historicList: HistoricList;

        service.historicList$.subscribe((data) => (historicList = data));

        expect(JSON.stringify(historicList)).toEqual(JSON.stringify(MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS));
      });

      describe('and when there are more pages', () => {
        beforeEach(() => {
          service.reset();
          walletBalanceReplaySubject.next(MOCK_WALLET_MOVEMENTS_HISTORY_LIST_FIRST_PAGE);
          service.getItems(defaultFilter);
          walletBalanceReplaySubject.next(MOCK_WALLET_MOVEMENTS_HISTORY_LIST_LAST_PAGE);
          walletBalanceGetSpy.calls.reset();
          service.getItems(defaultFilter);
        });

        it('should ask API service with correct pagination', () => {
          expect(walletBalanceHistoryService.get).toHaveBeenCalledWith(
            MOCK_WALLET_MOVEMENTS_HISTORY_LIST_FIRST_PAGE.paginationParameter,
            defaultFilter
          );
        });

        it('should notify with all the elements in the list', () => {
          let historicList: HistoricList;

          service.historicList$.subscribe((data) => (historicList = data));

          expect(JSON.stringify(historicList)).toEqual(JSON.stringify(MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS_WITH_ALL_ELEMENTS));
        });

        it('should notify there are no more items', () => {
          expect(service.noMoreItemsAvailable).toBe(true);
        });
      });
    });
  });

  describe('when reseting state', () => {
    beforeEach(() => {
      service.reset();
    });

    it('should go back to initial state', () => {
      let result: HistoricList;

      service.historicList$.subscribe((data) => (result = data));

      expect(result).toBeFalsy();
    });
  });
});
