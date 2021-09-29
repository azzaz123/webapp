import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { KYCAckHttpService } from './http/kyc-ack-http.service';

import { KYCAckService } from './kyc-ack.service';

describe('KYCAckService', () => {
  let service: KYCAckService;
  let kycAckHttpService: KYCAckHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [KYCAckService, KYCAckHttpService],
    });
    service = TestBed.inject(KYCAckService);
    kycAckHttpService = TestBed.inject(KYCAckHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when notifying the KYC ACK...', () => {
    it('should call to the KYC ACK HTTP service', () => {
      spyOn(kycAckHttpService, 'notify').and.returnValue(of(null));

      service.notify().subscribe();

      expect(kycAckHttpService.notify).toHaveBeenCalledTimes(1);
    });
  });
});
