import { Injectable } from '@angular/core';
import { SellerRequestsApiService } from '@api/delivery/seller/requests/seller-requests-api.service';
import { Observable, forkJoin, of } from 'rxjs';
import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { UserService } from '@core/user/user.service';
import { ItemService } from '@core/item/item.service';
import { Item } from '@core/item/item';
import { User } from '@core/user/user';
import { concatMap, map, mergeMap, take } from 'rxjs/operators';
import { AcceptScreenProperties } from '../../interfaces/accept-screen-properties.interface';
import { AcceptScreenItem } from '../../interfaces/accept-screen-item.interface';
import { mapCurrencyCodeToCurrency } from '../../../../../api/core/mappers/currency/currency-mapper';
import { mapNumberAndCurrencyCodeToMoney, NumberCurrencyCode } from '../../../../../api/core/mappers/money/money-mapper';
import { CurrencyCode } from '../../../../../api/core/model/currency.interface';
import { PLACEHOLDER_AVATAR } from '../../../../../core/user/user';
import { AcceptScreenBuyer } from '../../interfaces/accept-screen-buyer.interface';
import { AcceptScreenSeller } from '../../interfaces/accept-screen-seller.interface';

@Injectable()
export class AcceptScreenService {
  constructor(
    private sellerRequestApiService: SellerRequestsApiService,
    private userService: UserService,
    private itemService: ItemService
  ) {}

  public initialize(requestId: string): void {
    this.getAcceptScreenProperties(requestId).subscribe();
  }

  // TODO: Initialize store when created		Date: 2022/01/19
  private getAcceptScreenProperties(requestId: string): Observable<AcceptScreenProperties> {
    return this.getSellerRequest(requestId).pipe(
      take(1),
      concatMap((request: SellerRequest) => {
        return forkJoin([this.getItem(request.itemId), this.getBuyer(request.buyer.id), this.getSeller()]).pipe(
          mergeMap(([item, buyer, seller]) => {
            return of({
              request,
              item,
              buyer,
              seller,
            });
          })
        );
      })
    );
  }

  private getSellerRequest(requestId: string): Observable<SellerRequest> {
    return this.sellerRequestApiService.getRequestInfo(requestId);
  }

  private getBuyer(userId: string): Observable<AcceptScreenBuyer> {
    return this.userService.get(userId).pipe(
      map((buyer: User) => {
        return {
          id: buyer.id,
          imageUrl: buyer.image?.urls_by_size.original || PLACEHOLDER_AVATAR,
          name: buyer.microName,
        };
      })
    );
  }

  private getSeller(): Observable<AcceptScreenSeller> {
    return this.userService.getLoggedUserInformation().pipe(
      map((seller) => {
        return {
          id: seller.id,
          imageUrl: seller.image?.urls_by_size.original || PLACEHOLDER_AVATAR,
          address: null,
        };
      })
    );
  }

  private getItem(itemId: string): Observable<AcceptScreenItem> {
    return this.itemService.get(itemId).pipe(
      map((item: Item) => {
        const itemCurrencyPrice: NumberCurrencyCode = {
          number: item.salePrice,
          currency: item.currencyCode as CurrencyCode,
        };
        return {
          id: item.id,
          title: item.title,
          price: mapNumberAndCurrencyCodeToMoney(itemCurrencyPrice),
          imageUrl: item.images ? item.images[0].urls_by_size.original : null,
        };
      })
    );
  }
}
