/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { StatisticsService } from './statistics.service';
import { HttpService, TEST_HTTP_PROVIDERS } from 'shield';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ResponseOptions, Response } from '@angular/http';
const STATISTIC_API_URL: string = 'api/v3/protool/statistics';
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

  it('should ...', inject([StatisticsService], () => {
    expect(service).toBeTruthy();
  }));
  describe('getStatistics', () => {
    beforeEach(() => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify('Response')})));
      });
    });
    it('should call the get with the statistics api url', () => {
      spyOn(http, 'get').and.callThrough();
      let response;
      service.getStatistics().subscribe((r) => {
        response = r;
      });
      expect(http.get).toHaveBeenCalledWith(STATISTIC_API_URL);
      expect(response).toBe('Response');
    });
  });
});
