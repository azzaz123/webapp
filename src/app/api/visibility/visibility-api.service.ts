import { Injectable } from '@angular/core';
import { BumpsPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import { UuidService } from '@core/uuid/uuid.service';
import { CartBase } from '@shared/catalog/cart/cart-base';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BumpsHttpService } from './http/bumps.service';
import { mapBalance, mapFreeBumpsPurchase } from './mappers/bumps-mapper';

@Injectable()
export class VisibilityApiService {
  constructor(private bumpsHttpService: BumpsHttpService, private uuidService: UuidService) {}

  public getBalance(userId: string): Observable<BumpsPackageBalance[]> {
    return this.bumpsHttpService.getBalance(userId).pipe(map(mapBalance));
  }

  public bumpWithPackage(cart: CartBase): Observable<void> {
    const itemsMapped = mapFreeBumpsPurchase(cart, this.uuidService);
    return itemsMapped.length === 0 ? of() : this.bumpsHttpService.useBumpPackage(itemsMapped);
  }
}
