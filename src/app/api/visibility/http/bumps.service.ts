import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemsWithAvailableProductsResponse } from '@core/item/item-response.interface';
import { Observable } from 'rxjs';
import { BumpsPackageBalanceResponse } from '../dtos/bumps/bumps-package-balance.interface';
import { BumpsPackageUseDTO } from '../dtos/bumps/bumps-package-use.interface';
import { ItemsBalanceDTO } from '../dtos/bumps/items-balance.interface';
import { BUMPS_PACKAGE_BALANCE, BUMPS_PACKAGE_USE, ITEMS_WITH_PRODUCTS, ITEM_BUMPS_PACKAGE_BALANCE } from './endpoints';

@Injectable()
export class BumpsHttpService {
  constructor(private httpClient: HttpClient) {}

  public getBalance(userId: string): Observable<BumpsPackageBalanceResponse> {
    return this.httpClient.get<BumpsPackageBalanceResponse>(BUMPS_PACKAGE_BALANCE(userId));
  }

  public getItemsBalance(userId: string, itemIds: string[]): Observable<ItemsBalanceDTO> {
    return this.httpClient.post<ItemsBalanceDTO>(ITEM_BUMPS_PACKAGE_BALANCE(userId), {
      item_ids: itemIds,
    });
  }

  public useBumpPackage(cart: BumpsPackageUseDTO): Observable<void> {
    return this.httpClient.post<void>(BUMPS_PACKAGE_USE, cart);
  }

  public getItemsWithAvailableProducts(ids: string[]): Observable<ItemsWithAvailableProductsResponse[]> {
    return this.httpClient.get<ItemsWithAvailableProductsResponse[]>(ITEMS_WITH_PRODUCTS, {
      params: {
        itemsIds: ids.join(','),
      },
    });
  }
}
