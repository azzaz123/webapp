import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { KYC_ACK_ENDPOINT } from './endpoints';

import { KYCAckHttpService } from './kyc-ack-http.service';

describe('KYCAckHttpService', () => {
  let service: KYCAckHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KYCAckHttpService],
    });
    service = TestBed.inject(KYCAckHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when notifying the KYC ACK...', () => {
    it('should call to the backend service', () => {
      service.notify().subscribe();
      const req: TestRequest = httpMock.expectOne(KYC_ACK_ENDPOINT);
      req.flush({});

      expect(req.request.url).toEqual(KYC_ACK_ENDPOINT);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toBe(null);
    });
  });
});
