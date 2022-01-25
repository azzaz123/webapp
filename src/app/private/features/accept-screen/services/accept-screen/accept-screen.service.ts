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
import { AcceptScreenItem, AcceptScreenBuyer, AcceptScreenSeller, AcceptScreenCarrier } from '../../interfaces';
import {
  mapCarrierDropOffModeToAcceptScreenCarriers,
  mapItemToAcceptScreenItem,
  mapUserToAcceptScreenBuyer,
  mapUserToAcceptScreenSeller,
} from '../../mappers/accept-screen-properties/accept-screen-properties.mapper';
import { CarrierDropOffModeRequestApiService } from '@api/delivery/carrier-drop-off-mode/request/carrier-drop-off-mode-request-api.service';
import { CarrierDropOffModeRequest } from '@api/core/model/delivery/carrier-drop-off-mode';

@Injectable({
  providedIn: 'root',
})
export class AcceptScreenService {
  constructor(
    private sellerRequestApiService: SellerRequestsApiService,
    private userService: UserService,
    private itemService: ItemService,
    private carrierDropOffModeRequestApiService: CarrierDropOffModeRequestApiService
  ) {}

  public getAcceptScreenProperties(requestId: string): Observable<AcceptScreenProperties> {
    return this.getSellerRequest(requestId).pipe(
      take(1),
      concatMap((request: SellerRequest) => {
        return forkJoin([
          this.getItem(request.itemId),
          this.getBuyer(request.buyer.id),
          this.getSeller(),
          this.getCarrierDropOffModeRequest(requestId),
        ]).pipe(
          mergeMap(([item, buyer, seller, carriers]: [AcceptScreenItem, AcceptScreenBuyer, AcceptScreenSeller, AcceptScreenCarrier[]]) => {
            return of({
              request,
              item,
              buyer,
              seller,
              carriers,
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

  private getCarrierDropOffModeRequest(requestId: string): Observable<AcceptScreenCarrier[]> {
    return this.carrierDropOffModeRequestApiService
      .get(requestId)
      .pipe(
        map((carrierDropOffModeRequest: CarrierDropOffModeRequest) =>
          mapCarrierDropOffModeToAcceptScreenCarriers(carrierDropOffModeRequest)
        )
      );
  }
}
