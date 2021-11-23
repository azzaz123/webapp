import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '@core/user/user.service';
import { AdsTargetingsService } from './ads-targetings.service';
import { MockUserService } from '@fixtures/user.fixtures.spec';
import { YieldBirdService } from '@core/ads/vendors/yieldbird/yieldbird.service';
import { MockYieldBirdService } from '@fixtures/ads.fixtures.spec';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { AdTargetings } from '@core/ads/models/ad-targetings';

describe('AdsTargetingsService', () => {
  let service: AdsTargetingsService;
  const MOCK_PARAMS: FilterParameter[] = [
    { key: FILTER_QUERY_PARAM_KEY.keywords, value: 'OnePlus One' },
    { key: FILTER_QUERY_PARAM_KEY.categoryId, value: `${CATEGORY_IDS.CELL_PHONES_ACCESSORIES}` },
    { key: FILTER_QUERY_PARAM_KEY.minPrice, value: `${200}` },
    { key: FILTER_QUERY_PARAM_KEY.maxPrice, value: `${400}` },
  ];

  const expectedTargetings: AdTargetings = {
    content: 'OnePlus One',
    category: '16000',
    minprice: '200',
    maxprice: '400',
    gender: 'male',
    userId: 'abcd-1234',
    age: '3',
    latitude: '41.399132621722174',
    longitude: '2.17585484411869',
    yb_ab: 'test',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: UserService,
          useValue: MockUserService,
        },
        {
          provide: YieldBirdService,
          useValue: MockYieldBirdService,
        },
      ],
    });
    service = TestBed.inject(AdsTargetingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set single targetings in memory', () => {
    const adTargetings = { latitude: '1', longitude: '2', category: '123', content: 'test' };

    service.setAdTargeting(adTargetings);

    expect(service.adTargetings).toEqual(adTargetings);
  });

  it('should set all targetings from params, users and vendors', () => {
    service.setAdTargetings(MOCK_PARAMS);

    expect(service.adTargetings).toEqual(expectedTargetings);
  });

  it('should clean all targetings before setting them all again', () => {
    const previousAdTargetings = { latitude: '1', longitude: '2', category: '123', brand: 'wow', content: 'old' };

    service.setAdTargeting(previousAdTargetings);
    service.setAdTargetings(MOCK_PARAMS);

    expect(service.adTargetings).toEqual(expectedTargetings);
  });
});
