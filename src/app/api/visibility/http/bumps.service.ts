import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WEB_ITEMS_API_URL } from '@core/item/item.service';
import { environment } from '@environments/environment.beta';
import { Observable } from 'rxjs';
import { BumpsPackageBalanceDTO } from '../dtos/bumps/bumps-package-balance.interface';
import { BumpsPackageUseDTO } from '../dtos/bumps/bumps-package-use.interface';
import { BUMPS_PACKAGE_BALANCE, BUMPS_PACKAGE_USE } from './endpoints';

@Injectable()
export class BumpsHttpService {
  constructor(private httpClient: HttpClient) {}

  public getBalance(userId: string): Observable<BumpsPackageBalanceDTO[]> {
    return this.httpClient.get<BumpsPackageBalanceDTO[]>(BUMPS_PACKAGE_BALANCE(userId));
  }

  public useBumpPackage(cart: BumpsPackageUseDTO[]): Observable<void> {
    return this.httpClient.post<void>(BUMPS_PACKAGE_USE, cart);
  }

  public getItemsWithAvailableProducts(ids: string[]): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}${WEB_ITEMS_API_URL}/available-visibility-products`, {
      params: {
        itemsIds: ids.join(','),
      },
    });
  }
}
