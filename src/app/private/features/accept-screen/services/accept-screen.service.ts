import { Injectable } from '@angular/core';
import { SellerRequestsApiService } from '@api/delivery/seller/requests/seller-requests-api.service';
import { Observable, forkJoin, of } from 'rxjs';
import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { UserService } from '@core/user/user.service';
import { ItemService } from '@core/item/item.service';
import { Item } from '@core/item/item';
import { User } from '@core/user/user';
import { concatMap, mergeMap } from 'rxjs/operators';
import { AcceptScreenProperties } from '../interfaces/accept-screen-properties.interface';

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

  private getAcceptScreenProperties(requestId: string): Observable<AcceptScreenProperties> {
    return this.getSellerRequest(requestId).pipe(
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

  private getBuyer(userId: string): Observable<User> {
    return this.userService.get(userId);
  }

  private getItem(itemId: string): Observable<Item> {
    return this.itemService.get(itemId);
  }

  private getSeller(): Observable<User> {
    return this.userService.getLoggedUserInformation();
  }
}
