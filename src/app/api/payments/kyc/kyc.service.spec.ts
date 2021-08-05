import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_KYC_IMAGES } from '@fixtures/private/wallet/kyc/kyc.fixtures.spec';
import { of } from 'rxjs';
import { KYCHttpService } from './http/kyc-http.service';

import { KYCService } from './kyc.service';

describe('KYCService', () => {
  let service: KYCService;
  let kycHttpService: KYCHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KYCService, KYCHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(KYCService);
    kycHttpService = TestBed.inject(KYCHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when requesting the KYC...', () => {
    it('should request to the HTTP service the KYC with the specified images', () => {
      spyOn(kycHttpService, 'request').and.returnValue(of(null));

      service.request(MOCK_KYC_IMAGES).subscribe();

      expect(kycHttpService.request).toBeCalledWith(MOCK_KYC_IMAGES);
      expect(kycHttpService.request).toHaveBeenCalledTimes(1);
    });
  });
});
