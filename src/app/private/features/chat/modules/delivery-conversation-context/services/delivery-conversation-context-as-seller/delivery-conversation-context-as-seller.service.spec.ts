import { TestBed } from '@angular/core/testing';
import { MOCK_INBOX_CONVERSATION_AS_SELLER, MOCK_INBOX_CONVERSATION_WITH_DELIVERY_THIRD_VOICES } from '@fixtures/chat';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TRXAwarenessModalComponent } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.component';

import { DeliveryConversationContextAsSellerService } from './delivery-conversation-context-as-seller.service';

describe('DeliveryConversationContextAsSellerService', () => {
  let service: DeliveryConversationContextAsSellerService;
  let modalService: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryConversationContextAsSellerService, { provide: NgbModal, useValue: { open: () => {} } }],
    });
    service = TestBed.inject(DeliveryConversationContextAsSellerService);
    modalService = TestBed.inject(NgbModal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when handling CTA button', () => {
    beforeEach(() => {
      spyOn(modalService, 'open');
      service.handleThirdVoiceCTAClick(MOCK_INBOX_CONVERSATION_WITH_DELIVERY_THIRD_VOICES);
    });

    it('should open TRX awareness modal', () => {
      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(TRXAwarenessModalComponent);
    });
  });
});
