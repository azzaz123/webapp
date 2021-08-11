import { TestBed } from '@angular/core/testing';
import { MOCK_EMPTY_KYC_SPECIFICATIONS, MOCK_KYC_SPECIFICATIONS } from '@fixtures/private/kyc/kyc-specifications.fixtures.spec';
import { KYCSpecifications } from '../../interfaces/kyc-specifications.interface';

import { KYCStoreService } from './kyc-store.service';

describe('KYCStoreService', () => {
  let service: KYCStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KYCStoreService],
    });
    service = TestBed.inject(KYCStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have empty specifications by default', () => {
    expect(service.specifications).toStrictEqual(MOCK_EMPTY_KYC_SPECIFICATIONS);
  });

  describe('when updating the specifications...', () => {
    beforeEach(() => {
      service.specifications = MOCK_KYC_SPECIFICATIONS;
    });

    it('should return the specifications updated', () => {
      expect(service.specifications).toStrictEqual(MOCK_KYC_SPECIFICATIONS);
    });

    it('should return the observable specifications updated', () => {
      let specifications: KYCSpecifications;

      service.specifications$.subscribe((response) => {
        specifications = response;
      });

      expect(specifications).toStrictEqual(MOCK_KYC_SPECIFICATIONS);
    });
  });
});
