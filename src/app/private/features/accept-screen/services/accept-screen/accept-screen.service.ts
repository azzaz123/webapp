import { Injectable } from '@angular/core';
import { SellerRequestsApiService } from '@api/delivery/seller/requests/seller-requests-api.service';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { UserService } from '@core/user/user.service';
import { ItemService } from '@core/item/item.service';
import { catchError, concatMap, map, mergeMap, take, tap } from 'rxjs/operators';
import { AcceptScreenProperties } from '../../interfaces/accept-screen-properties.interface';
import { AcceptScreenItem, AcceptScreenBuyer, AcceptScreenSeller, AcceptScreenCarrier } from '../../interfaces';
import {
  mapCarrierDropOffModeToAcceptScreenCarriers,
  mapItemToAcceptScreenItem,
  mapUserToAcceptScreenBuyer,
  mapUserToAcceptScreenSeller,
} from '../../mappers/accept-screen-properties/accept-screen-properties.mapper';
import { CarrierDropOffModeRequestApiService } from '@api/delivery/carrier-drop-off-mode/request/carrier-drop-off-mode-request-api.service';
import { DeliveryAddressApiService } from '@private/features/delivery/services/api/delivery-address-api/delivery-address-api.service';
import { DeliveryAddressApi } from '@private/features/delivery/interfaces/delivery-address/delivery-address-api.interface';
import { User } from '@core/user/user';
import { ACCEPT_SCREEN_DELIVERY_ADDRESS, ACCEPT_SCREEN_HEADER_TRANSLATIONS } from '../../constants/header-translations';
import { ACCEPT_SCREEN_STEPS } from '../../constants/accept-screen-steps';
import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
import { CarrierDropOffModeRequest } from '@api/core/model/delivery/carrier-drop-off-mode';
import { SELLER_REQUEST_STATUS } from '@api/core/model/delivery/seller-requests/status/seller-request-status.enum';

@Injectable({
  providedIn: 'root',
})
export class AcceptScreenService {
  constructor(
    private sellerRequestApiService: SellerRequestsApiService,
    private userService: UserService,
    private itemService: ItemService,
    private carrierDropOffModeRequestApiService: CarrierDropOffModeRequestApiService,
    private deliveryAddressApiService: DeliveryAddressApiService
  ) {}

  public getAcceptScreenProperties(
    requestId: string,
    dropOffSelectedByUser: CARRIER_DROP_OFF_MODE = null
  ): Observable<AcceptScreenProperties> {
    return this.getSellerRequest(requestId).pipe(
      take(1),
      concatMap((request: SellerRequest) => {
        return forkJoin([
          this.getItem(request.itemId),
          this.getBuyer(request.buyer.id),
          this.getSeller(),
          this.getCarrierDropOffModeRequest(requestId, dropOffSelectedByUser),
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

  public acceptRequestPostOfficeDropOff(requestId: string): Observable<void> {
    return this.sellerRequestApiService.acceptRequestPostOfficeDropOff(requestId);
  }

  public acceptRequestHomePickup(requestId: string): Observable<void> {
    return this.sellerRequestApiService.acceptRequestHomePickup(requestId);
  }

  public rejectRequest(requestId: string): Observable<void> {
    return this.sellerRequestApiService.rejectRequest(requestId);
  }

  private getSellerRequest(requestId: string): Observable<SellerRequest> {
    return this.sellerRequestApiService
      .getRequestInfo(requestId)
      .pipe(map((sellerRequest: SellerRequest) => this.isSellerRequestStatusPending(sellerRequest)));
  }

  private getBuyer(userId: string): Observable<AcceptScreenBuyer> {
    return this.userService.get(userId).pipe(map(mapUserToAcceptScreenBuyer));
  }

  private getSeller(): Observable<AcceptScreenSeller> {
    return forkJoin([this.userService.getLoggedUserInformation(), this.getSellerAddress()]).pipe(
      map(([seller, address]: [User, DeliveryAddressApi]) => mapUserToAcceptScreenSeller(seller, address))
    );
  }

  private getItem(itemId: string): Observable<AcceptScreenItem> {
    return this.itemService.get(itemId).pipe(map(mapItemToAcceptScreenItem));
  }

  private getCarrierDropOffModeRequest(requestId: string, dropOffSelectedByUser: CARRIER_DROP_OFF_MODE): Observable<AcceptScreenCarrier[]> {
    return this.carrierDropOffModeRequestApiService
      .get(requestId)
      .pipe(
        map((dropOffModes: CarrierDropOffModeRequest) => mapCarrierDropOffModeToAcceptScreenCarriers(dropOffModes, dropOffSelectedByUser))
      );
  }

  private getSellerAddress(): Observable<DeliveryAddressApi> {
    return this.deliveryAddressApiService.get().pipe(
      catchError(() => of(null)),
      tap((address: DeliveryAddressApi) => {
        const addressTitleTranslation = address ? ACCEPT_SCREEN_DELIVERY_ADDRESS.EDIT : ACCEPT_SCREEN_DELIVERY_ADDRESS.ADD;
        ACCEPT_SCREEN_HEADER_TRANSLATIONS[ACCEPT_SCREEN_STEPS.DELIVERY_ADDRESS] = addressTitleTranslation;
      })
    );
  }

  private isSellerRequestStatusPending(sellerRequest: SellerRequest): SellerRequest {
    if (sellerRequest.status.request === SELLER_REQUEST_STATUS.PENDING) {
      return sellerRequest;
    }
    throwError('Seller request status NOT pending');
  }
}
