import { TestBed } from '@angular/core/testing';

import { ItemStatsService } from './item-stats.service';
import { TEST_HTTP_PROVIDERS } from '../../../../../tests/utils.spec';
import { HttpService } from '../../../../core/http/http.service';
import { ITEM_STATISTIC_RESPONSE } from '../../../../../tests/statistics.fixtures.spec';
import { ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';

describe('ItemStatsService', () => {

  let http: HttpService;
  let service: ItemStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ItemStatsService,
        ...TEST_HTTP_PROVIDERS
      ]
    });
    service = TestBed.get(ItemStatsService);
    http = TestBed.get(HttpService);
  });

  describe('getStatistics', () => {
    it('should call endpoint and return response', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(ITEM_STATISTIC_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let response;

      service.getStatistics('123').subscribe((r) => {
        response = r;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/statistics/item/123');
      expect(response).toEqual(ITEM_STATISTIC_RESPONSE);
    });
  });
});
