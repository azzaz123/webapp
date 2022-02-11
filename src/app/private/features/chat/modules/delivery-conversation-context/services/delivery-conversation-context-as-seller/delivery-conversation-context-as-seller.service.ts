import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InboxConversation } from '@private/features/chat/core/model';
import { TRXAwarenessModalComponent } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.component';
import { Observable, of } from 'rxjs';
import { DeliveryBanner } from '../../../delivery-banner/interfaces/delivery-banner.interface';

@Injectable()
export class DeliveryConversationContextAsSellerService {
  constructor(private modalService: NgbModal) {}

  // TODO: Implement method for getting banner properties as seller
  public getBannerPropertiesAsSeller(conversation: InboxConversation): Observable<DeliveryBanner | null> {
    return of(null);
  }

  public handleThirdVoiceCTAClick(): void {
    this.modalService.open(TRXAwarenessModalComponent);
  }
}
