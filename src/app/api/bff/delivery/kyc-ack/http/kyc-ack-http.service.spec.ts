import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { KYCAckHttpService } from './kyc-ack-http.service';

describe('KYCAckHttpService', () => {
  let service: KYCAckHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [KYCAckHttpService],
    });
    service = TestBed.inject(KYCAckHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
