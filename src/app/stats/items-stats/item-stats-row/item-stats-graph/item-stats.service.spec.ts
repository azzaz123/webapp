import { TestBed } from '@angular/core/testing';

import { ItemStatsService } from './item-stats.service';
import { HttpClientTestingModule, TestRequest, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

describe('ItemStatsService', () => {

  let http: HttpClient;
  let httpMock: HttpTestingController;
  let service: ItemStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ItemStatsService
      ],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.get(ItemStatsService);
    http = TestBed.get(HttpClient);
    httpMock = TestBed.get(HttpTestingController);
  });

  describe('getStatistics', () => {
    it('should call endpoint', () => {
      const itemId = '123';
      const expectedUrl = `${environment.baseUrl}api/v3/statistics/item/${itemId}`;

      service.getStatistics(itemId).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });
});
