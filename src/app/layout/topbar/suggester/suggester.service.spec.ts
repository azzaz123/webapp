import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, TestRequest, HttpTestingController } from '@angular/common/http/testing';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { SuggesterService, SUGGESTER_ENDPOINT } from './suggester.service';
import { SuggesterResponse } from './suggester-response.interface';
import { SUGGESTER_DATA_WEB } from '../../../../tests/suggester.fixtures.spec';

describe('SuggesterService', () => {
  let service: SuggesterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SuggesterService]
    });
    service = TestBed.inject(SuggesterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  describe('getSuggestions', () => {
    it('should get search suggestions by keyword from the backend', () => {
      let response: SuggesterResponse[];
      const keyword = 'trainedhug';
      const expectedUrlParams = `keyword=${keyword}`;
      const expectedUrl = `${environment.baseUrl}${SUGGESTER_ENDPOINT}?${expectedUrlParams}`;

      service.getSuggestions(keyword).subscribe(r => response = r);
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(SUGGESTER_DATA_WEB);

      expect(response).toEqual(SUGGESTER_DATA_WEB);
      expect(req.request.urlWithParams).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });
});
