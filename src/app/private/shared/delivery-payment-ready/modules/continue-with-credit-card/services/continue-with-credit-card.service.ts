import { Injectable } from '@angular/core';
import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { DELIVERY_MODAL_CLASSNAME } from '@private/features/delivery/constants/delivery-constants';
import { START_DELIVERY_PAYMENT_URL } from '@private/shared/delivery-payment-ready/constants/continue-delivery-payment.constants';
import { WEB_VIEW_MODAL_CLOSURE_METHOD } from '@shared/web-view-modal/enums/web-view-modal-closure-method';
import { WebViewModalService } from '@shared/web-view-modal/services/web-view-modal.service';
import { Observable } from 'rxjs';

@Injectable()
export class ContinueWithCreditCardService {
  constructor(private webViewModalService: WebViewModalService) {}

  public continue(buyerRequest: BuyerRequest): Observable<WEB_VIEW_MODAL_CLOSURE_METHOD> {
    const { id } = buyerRequest;
    const externalUrl: string = START_DELIVERY_PAYMENT_URL(id);
    const title: string = $localize`:@@checkout_summary_view_buyer_top_bar_title:Make a purchase`;

    return this.webViewModalService.open(externalUrl, title, DELIVERY_MODAL_CLASSNAME);
  }
}
