import { Injectable } from '@angular/core';
import { TransactionWithCreationDate } from '@api/core/model/delivery/transaction/transaction-with-creation-date.interface';
import { Unpacked } from '@api/core/utils/types';
import { Item } from '@core/item/item';
import { ItemService } from '@core/item/item.service';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { forkJoin, Observable, of } from 'rxjs';
import { take, map, concatMap } from 'rxjs/operators';
import { TransactionsHistoryDto } from './dtos/transactions-history-dto.interface';
import { TransactionsHistoryHttpService } from './http/transactions-history-http.service';
import { mapTransactionsHistoryFiltersToApi } from './mappers/requests/transactions-history-filter.mapper';
import { mapTransactionsHistoryToTransactions } from './mappers/responses/transactions-history.mapper';

@Injectable()
export class TransactionsHistoryApiService {
  constructor(
    private transactionsHistoryHttpService: TransactionsHistoryHttpService,
    private itemService: ItemService,
    private userService: UserService
  ) {}

  public get(page: number = 0): Observable<TransactionWithCreationDate[] | []> {
    return this.transactionsHistoryHttpService.get(mapTransactionsHistoryFiltersToApi({ page })).pipe(
      take(1),
      concatMap((transactionsHistoryResponse) =>
        forkJoin([
          this.getAllUsers(transactionsHistoryResponse),
          this.getAllItems(transactionsHistoryResponse),
          of(transactionsHistoryResponse),
        ])
      ),
      map((result) => this.mapToTransactions(result))
    );
  }

  private mapToTransactions(input: [User[], Item[], TransactionsHistoryDto]): TransactionWithCreationDate[] {
    const [users, items, transactions] = input;

    return mapTransactionsHistoryToTransactions({
      currentUser: this.userService.user,
      transactions,
      users,
      items,
    });
  }

  private getAllUsers(response: TransactionsHistoryDto): Observable<User[]> {
    const allUserIds: string[] = this.getUserIds(response);
    const userRequests = forkJoin(allUserIds.map((id) => this.getUser(id)));
    return userRequests;
  }

  private getAllItems(response: TransactionsHistoryDto): Observable<Item[]> {
    const allItemIds: string[] = this.getItemIds(response);
    const itemRequests = forkJoin(allItemIds.map((id) => this.getItem(id)));
    return itemRequests;
  }

  private getUser(userId: string): Observable<User> {
    const isCurrentUser: boolean = userId === this.userService.user.id;
    return isCurrentUser ? of(this.userService.user) : this.userService.get(userId, false);
  }

  private getItem(itemId: string): Observable<Item> {
    return this.itemService.get(itemId);
  }

  private getUserIds(response: TransactionsHistoryDto): string[] {
    const allTransactorUserIds = response.map((transaction: Unpacked<TransactionsHistoryDto>) => transaction.transactor_user_hash_id);
    allTransactorUserIds.push(this.userService.user.id);
    const allUniqueUserIds = this.getUniqueArray(allTransactorUserIds);
    return allUniqueUserIds;
  }

  private getItemIds(response: TransactionsHistoryDto): string[] {
    const allItemIds = response.map(
      (transactionHistoryDtoElement: Unpacked<TransactionsHistoryDto>) => transactionHistoryDtoElement.item_hash_id
    );
    const allUniqueItemIds = this.getUniqueArray(allItemIds);
    return allUniqueItemIds;
  }

  private getUniqueArray<T>(input: Array<T>): Array<T> {
    return Array.from(new Set(input));
  }
}
