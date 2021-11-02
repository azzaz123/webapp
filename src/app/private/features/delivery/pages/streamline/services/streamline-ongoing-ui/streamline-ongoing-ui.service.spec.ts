import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RequestAndTransactionsPendingAsSellerModule } from '@api/bff/delivery/requests-and-transactions/pending-as-seller/requests-and-transactions-pending-as-seller.module';
import { RequestsAndTransactionsPendingAsSellerService } from '@api/bff/delivery/requests-and-transactions/pending-as-seller/requests-and-transactions-pending-as-seller.service';

import { StreamlineOngoingUIService } from './streamline-ongoing-ui.service';

describe('StreamlineOngoingUIService', () => {
  let service: StreamlineOngoingUIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RequestAndTransactionsPendingAsSellerModule],
      providers: [StreamlineOngoingUIService],
    });
    service = TestBed.inject(StreamlineOngoingUIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
