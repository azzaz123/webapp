import { TestBed } from '@angular/core/testing';

import { ThreeDomainSecureService } from './three-domain-secure.service';

describe('ThreeDomainSecureService', () => {
  let service: ThreeDomainSecureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeDomainSecureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
