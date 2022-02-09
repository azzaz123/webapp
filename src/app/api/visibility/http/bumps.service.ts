import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemsWithAvailableProductsResponse } from '@core/item/item-response.interface';
import { Observable } from 'rxjs';
import { BumpsPackageBalanceDTO } from '../dtos/bumps/bumps-package-balance.interface';
import { BumpsPackageUseDTO } from '../dtos/bumps/bumps-package-use.interface';
import { BUMPS_PACKAGE_BALANCE, BUMPS_PACKAGE_USE, ITEMS_WITH_PRODUCTS } from './endpoints';

@Injectable()
export class BumpsHttpService {
  constructor(private httpClient: HttpClient) {}

  public getBalance(userId: string): Observable<BumpsPackageBalanceDTO[]> {
    return this.httpClient.get<BumpsPackageBalanceDTO[]>(BUMPS_PACKAGE_BALANCE(userId));
  }

  public useBumpPackage(cart: BumpsPackageUseDTO[]): Observable<void> {
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
