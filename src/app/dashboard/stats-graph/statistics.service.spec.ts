import { HttpTestingController, TestRequest, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { environment } from '../../../environments/environment';

import { StatisticsService, STATISTICS_ENDPOINT } from './statistics.service';
import { StatisticFullResponse } from './statistic-response.interface';
import { STATISTICS_RESPONSE } from '../../../tests/statistics.fixtures.spec';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StatisticsService]
    });
    service = TestBed.get(StatisticsService);
    httpMock = TestBed.get(HttpTestingController);
  });

  describe('getStatistics', () => {
    it('should get statistics from backend', () => {
      const durationInDays = 60;
      const expectedUrlParams = `durationInDays=${durationInDays}`;
      const expectedUrl = `${environment.baseUrl}${STATISTICS_ENDPOINT}?${expectedUrlParams}`;
      let response: StatisticFullResponse;
    
      service.getStatistics('60').subscribe(r => response = r);
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(STATISTICS_RESPONSE);

      expect(response).toEqual(STATISTICS_RESPONSE);
      expect(req.request.urlWithParams).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });
});
