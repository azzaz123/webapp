import {
  HttpClientTestingModule,
  TestRequest,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../../environments/environment';
import { ItemStatisticFullResponse } from '../item-stats-response.interface';

import { ItemStatsService, ITEM_STATS_ENDPOINT } from './item-stats.service';

export const MOCK_ITEM_STATS: ItemStatisticFullResponse = {
  entries: [
    {
      date: '2020-20-20',
      bumped: true,
      values: { views: 123, chats: 0, favs: 42 },
    },
    { date: 'asap', values: { views: 10, chats: 0, favs: 1 } },
  ],
};

describe('ItemStatsService', () => {
  let httpMock: HttpTestingController;
  let service: ItemStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemStatsService],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(ItemStatsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getStatistics', () => {
    it('should get user statistics', () => {
      let response: ItemStatisticFullResponse;
      const itemId = '123';
      const expectedUrl = `${environment.baseUrl}${ITEM_STATS_ENDPOINT}${itemId}`;

      service.getStatistics(itemId).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_ITEM_STATS);

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
      expect(response).toBe(MOCK_ITEM_STATS);
    });
  });
});
