import { TestBed } from '@angular/core/testing';

import { DeliveryConversationContextService } from './delivery-conversation-context.service';

describe('DeliveryConversationContextService', () => {
  let service: DeliveryConversationContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryConversationContextService],
    });
    service = TestBed.inject(DeliveryConversationContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
