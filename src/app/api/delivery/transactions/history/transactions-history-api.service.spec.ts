import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ItemService } from '@core/item/item.service';
import { UserService } from '@core/user/user.service';
import { MockedItemService, MOCK_ITEM, MOCK_ITEM_FEATURED } from '@fixtures/item.fixtures.spec';
import { MockedUserService, MOCK_USER, MOCK_USER_PRO } from '@fixtures/user.fixtures.spec';
import { TransactionsHistoryHttpService } from './http/transactions-history-http.service';
import { TransactionsHistoryApiService } from './transactions-history-api.service';

import * as requestMapper from './mappers/requests/transactions-history-filter.mapper';
import * as responseMapper from './mappers/responses/transactions-history.mapper';
import { Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { MOCK_TRANSACTIONS_HISTORY_DTO } from '@api/fixtures/delivery/transactions/history/transactions-history.fixtures.spec';
import { HistoricTransaction } from '@api/core/model';
import { User } from '@core/user/user';
import { Item } from '@core/item/item';
import { MOCK_HISTORIC_TRANSACTIONS } from '@api/fixtures/core/model/delivery/transaction/historic-transaction.fixtures.spec';

describe('TransactionsHistoryApiService', () => {
  let service: TransactionsHistoryApiService;
  let transactionsHistoryHttpService: TransactionsHistoryHttpService;
  let userService: UserService;
  let itemService: ItemService;

  const getUniqueArray = <T>(input: Array<T>) => Array.from(new Set(input));
  const getMockObservableUser = (userId: string): Observable<User> => of(allMockUsers.find((user) => user.id === userId));
  const getMockObservableItem = (itemId: string): Observable<Item> => of(allMockItems.find((item) => item.id === itemId));

  const allMockUsers: User[] = [MOCK_USER, MOCK_USER_PRO];
  const allMockItems: Item[] = [MOCK_ITEM, MOCK_ITEM_FEATURED];
  const allUniqueUserIdsWithoutCurrentUserId: string[] = getUniqueArray(allMockUsers.map((user) => user.id)).filter(
    (ids) => ids !== MOCK_USER_PRO.id
  );
  const allUniqueItemsIds: string[] = getUniqueArray(allMockItems.map((item) => item.id));
  const page = 1337;
  const mockMappedRequest = new HttpParams().append('page', page.toString());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TransactionsHistoryApiService,
        TransactionsHistoryHttpService,
        { provide: UserService, useClass: MockedUserService },
        { provide: ItemService, useClass: MockedItemService },
      ],
    });
    service = TestBed.inject(TransactionsHistoryApiService);
    transactionsHistoryHttpService = TestBed.inject(TransactionsHistoryHttpService);
    userService = TestBed.inject(UserService);
    itemService = TestBed.inject(ItemService);

    spyOn(transactionsHistoryHttpService, 'get').and.returnValue(of(MOCK_TRANSACTIONS_HISTORY_DTO));
    spyOn(requestMapper, 'mapTransactionsHistoryFiltersToApi').and.returnValue(mockMappedRequest);
    spyOn(responseMapper, 'mapTransactionsHistoryToTransactions').and.callThrough();
    spyOn(itemService, 'get').and.callFake(getMockObservableItem);
    spyOn(userService, 'get').and.callFake(getMockObservableUser);
    jest.spyOn(userService, 'user', 'get').mockReturnValue(MOCK_USER_PRO);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get the transactions history', () => {
    let response: HistoricTransaction[];

    beforeEach(fakeAsync(() => {
      service.get(page).subscribe((data) => (response = data));
      tick();
    }));

    it('should map request with page to server context', () => {
      expect(requestMapper.mapTransactionsHistoryFiltersToApi).toHaveBeenCalledWith({ page });
    });

    it('should ask server for transactions history with page', () => {
      expect(transactionsHistoryHttpService.get).toHaveBeenCalledTimes(1);
      expect(transactionsHistoryHttpService.get).toHaveBeenCalledWith(mockMappedRequest);
    });

    it('should ask information to server for users that are not current user', () => {
      expect(userService.get).toHaveBeenCalledWith(...allUniqueUserIdsWithoutCurrentUserId);
    });

    it('should ask to server for items information', () => {
      expect(itemService.get).toHaveBeenCalledWith(...allUniqueItemsIds);
    });

    it('should map server response to web context', () => {
      expect(responseMapper.mapTransactionsHistoryToTransactions).toHaveBeenCalledTimes(1);
    });

    it('should return historic transactions', () => {
      expect(JSON.stringify(response)).toEqual(JSON.stringify(MOCK_HISTORIC_TRANSACTIONS));
    });
  });
});
