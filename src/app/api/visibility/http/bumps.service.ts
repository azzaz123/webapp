import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BumpsPackageUse } from '@api/core/model/bumps/bumps-package-use';
import { Observable } from 'rxjs';
import { BumpsPackageBalanceDTO } from '../dtos/bumps/bumps-package-balance.interface';
import { BUMPS_PACKAGE_BALANCE, BUMPS_PACKAGE_USE } from './endpoints';

@Injectable()
export class BumpsHttpService {
  constructor(private httpClient: HttpClient) {}

  public getBalance(userId: string): Observable<BumpsPackageBalanceDTO[]> {
    return this.httpClient.get<BumpsPackageBalanceDTO[]>(BUMPS_PACKAGE_BALANCE(userId));
  }

  public useBumpPackage(cart: BumpsPackageUse[]): Observable<void> {
    return this.httpClient.post<void>(BUMPS_PACKAGE_USE, cart);
  }
}
