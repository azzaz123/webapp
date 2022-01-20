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
import { AcceptScreenItem, AcceptScreenBuyer, AcceptScreenSeller } from '../../interfaces';
import {
  mapItemToAcceptScreenItem,
  mapUserToAcceptScreenBuyer,
  mapUserToAcceptScreenSeller,
} from '../../mappers/accept-screen-properties/accept-screen-properties.mapper';

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
    return this.userService.get(userId).pipe(map((buyer: User) => mapUserToAcceptScreenBuyer(buyer)));
  }

  private getSeller(): Observable<AcceptScreenSeller> {
    return this.userService.getLoggedUserInformation().pipe(map((seller) => mapUserToAcceptScreenSeller(seller)));
  }

  private getItem(itemId: string): Observable<AcceptScreenItem> {
    return this.itemService.get(itemId).pipe(map((item: Item) => mapItemToAcceptScreenItem(item)));
  }
}
