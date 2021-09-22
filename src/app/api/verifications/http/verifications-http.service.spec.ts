import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_VERIFICATIONS_RESPONSE } from '@api/fixtures/verifications/verifications.fixtures.spec';
import { VerificationsApi } from '../dtos';
import { EXTRA_INFO_ENDPOINT } from './endpoints';

import { VerificationsHttpService } from './verifications-http.service';

describe('VerificationsHttpService', () => {
  let service: VerificationsHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VerificationsHttpService],
    });
    service = TestBed.inject(VerificationsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the delivery pending transactions', () => {
    it('should get the delivery pending transactions', () => {
      let response: VerificationsApi;

      service.get().subscribe((data) => (response = data));
      const req: TestRequest = httpMock.expectOne(EXTRA_INFO_ENDPOINT);
      req.flush(MOCK_VERIFICATIONS_RESPONSE);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_VERIFICATIONS_RESPONSE);
    });
  });
});
