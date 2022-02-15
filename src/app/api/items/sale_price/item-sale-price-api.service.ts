import { Injectable } from '@angular/core';
import { Money } from '@api/core/model/money.interface';
import { Observable } from 'rxjs';
import { ItemSalePriceHttpService } from './http/item-sale-price-http.service';

@Injectable()
export class ItemSalePriceApiService {
  constructor(private itemSalePriceHttpService: ItemSalePriceHttpService) {}

  public update(itemHash: string, newPrice: Money): Observable<void> {
    return this.itemSalePriceHttpService.update(itemHash, newPrice);
  }
}
