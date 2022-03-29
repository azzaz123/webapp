import { TestBed } from '@angular/core/testing';
import { WebViewModalService } from '@shared/web-view-modal/services/web-view-modal.service';

import { ThreeDomainSecureService } from './three-domain-secure.service';

describe('ThreeDomainSecureService', () => {
  let service: ThreeDomainSecureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebViewModalService],
    });
    service = TestBed.inject(ThreeDomainSecureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
