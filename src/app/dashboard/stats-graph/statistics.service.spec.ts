/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { StatisticsService } from './statistics.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ResponseOptions, Response } from '@angular/http';
import { HttpService } from '../../core/http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { STATISTICS_RESPONSE } from '../../../tests/statistics.fixtures.spec';
const STATISTIC_API_URL: string = 'api/v3/protool/dashboard/statistics';
let service: StatisticsService;
let http: HttpService;
let mockBackend: MockBackend;

describe('StatisticsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...TEST_HTTP_PROVIDERS, StatisticsService]
    });
    service = TestBed.get(StatisticsService);
    http = TestBed.get(HttpService);
    mockBackend = TestBed.get(MockBackend);
  });

  describe('getStatistics', () => {

    beforeEach(() => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(STATISTICS_RESPONSE)})));
      });
    });

    it('should call the get with the statistics api url', () => {
      spyOn(http, 'get').and.callThrough();
      let response;

      service.getStatistics('60').subscribe((r) => {
        response = r;
      });

      expect(http.get).toHaveBeenCalledWith(STATISTIC_API_URL + '?durationInDays=60');
      expect(response).toEqual(STATISTICS_RESPONSE);
    });
  });
});
