import { TestBed } from '@angular/core/testing';
import { WebViewModalService } from '@shared/web-view-modal/services/web-view-modal.service';

import { ThreeDomainSecureCreditCardsService } from './three-domain-secure-credit-cards.service';

describe('ThreeDomainSecureCreditCardsService', () => {
  let service: ThreeDomainSecureCreditCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebViewModalService],
    });
    service = TestBed.inject(ThreeDomainSecureCreditCardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
