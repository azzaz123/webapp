import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Money } from '@api/core/model/money.interface';
import { Observable } from 'rxjs';
import { mapNewPriceToItemSalePrice } from '../mappers/requests/item-sale-price.mapper';
import { ITEM_SALE_PRICE_ENDPOINT } from './endpoints';

@Injectable()
export class ItemSalePriceHttpService {
  constructor(private http: HttpClient) {}

  public update(itemHash: string, newPrice: Money): Observable<void> {
    return this.http.put<void>(ITEM_SALE_PRICE_ENDPOINT(itemHash), mapNewPriceToItemSalePrice(newPrice));
  }
}
