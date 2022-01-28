import { TestBed } from '@angular/core/testing';

import { DeliveryConversationContextAsBuyerService } from './delivery-conversation-context-as-buyer.service';

describe('DeliveryConversationContextAsBuyerService', () => {
  let service: DeliveryConversationContextAsBuyerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryConversationContextAsBuyerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
