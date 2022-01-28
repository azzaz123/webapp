import { TestBed } from '@angular/core/testing';

import { DeliveryConversationContextAsSellerService } from './delivery-conversation-context-as-seller.service';

describe('DeliveryConversationContextAsSellerService', () => {
  let service: DeliveryConversationContextAsSellerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryConversationContextAsSellerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
