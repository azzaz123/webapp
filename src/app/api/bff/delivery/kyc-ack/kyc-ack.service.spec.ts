import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { KYCAckHttpService } from './http/kyc-ack-http.service';

import { KYCAckService } from './kyc-ack.service';

describe('KYCAckService', () => {
  let service: KYCAckService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [KYCAckService, KYCAckHttpService],
    });
    service = TestBed.inject(KYCAckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
