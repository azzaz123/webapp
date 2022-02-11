import { Injectable } from '@angular/core';
import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { SellerRequestsApiService } from '@api/delivery/seller/requests/seller-requests-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InboxConversation } from '@private/features/chat/core/model';
import { TRXAwarenessModalComponent } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SELLER_EDIT_PRICE_BANNER_PROPERTIES } from '../../../delivery-banner/constants/delivery-banner-configs';
import { DeliveryBanner } from '../../../delivery-banner/interfaces/delivery-banner.interface';

@Injectable()
export class DeliveryConversationContextAsSellerService {
  constructor(private modalService: NgbModal, private sellerRequestsApiService: SellerRequestsApiService) {}

  public getBannerPropertiesAsSeller(conversation: InboxConversation): Observable<DeliveryBanner | null> {
    const { item, user: buyer } = conversation;
    const { id: itemHash } = item;
    const { id: buyerHash } = buyer;

    return this.sellerRequestsApiService.getRequestsByBuyerAndItem(buyerHash, itemHash).pipe(map(this.mapSellerRequestsToBannerProperties));
  }

  public handleThirdVoiceCTAClick(): void {
    this.modalService.open(TRXAwarenessModalComponent);
  }

  private mapSellerRequestsToBannerProperties(sellerRequests: SellerRequest[]): DeliveryBanner | null {
    const sellerHasNoRequests: boolean = sellerRequests.length === 0;
    const sellerHasRequests: boolean = !sellerHasNoRequests;

    if (sellerHasRequests) {
      return null;
    }

    if (sellerHasNoRequests) {
      return SELLER_EDIT_PRICE_BANNER_PROPERTIES;
    }

    return null;
  }
}
