import { Injectable } from '@angular/core';
import { BumpsPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import { ItemWithProducts } from '@api/core/model/bumps/item-products.interface';
import { ItemService } from '@core/item/item.service';
import { UuidService } from '@core/uuid/uuid.service';
import { CartBase } from '@shared/catalog/cart/cart-base';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BumpsHttpService } from './http/bumps.service';
import { mapBalance, mapFreeBumpsPurchase, mapItemsWithProducts } from './mappers/bumps-mapper';

@Injectable()
export class VisibilityApiService {
  constructor(private bumpsHttpService: BumpsHttpService, private uuidService: UuidService, private itemService: ItemService) {}

  public getBalance(userId: string): Observable<BumpsPackageBalance[]> {
    return this.bumpsHttpService.getBalance(userId).pipe(map(mapBalance));
  }

  public bumpWithPackage(cart: CartBase): Observable<unknown> {
    const itemsMapped = mapFreeBumpsPurchase(cart, this.uuidService);
    return itemsMapped.length === 0 ? of(true) : this.bumpsHttpService.useBumpPackage(itemsMapped).pipe(catchError((error) => of(error)));
  }

  public getItemsWithAvailableProducts(ids: string[]): Observable<ItemWithProducts[]> {
    return this.bumpsHttpService.getItemsWithAvailableProducts(ids).pipe(map(mapItemsWithProducts));
  }
}
