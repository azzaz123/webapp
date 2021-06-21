import { TestBed } from '@angular/core/testing';
import { AdsService } from '@core/ads/services';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_PARAMETER_STORE_TOKEN } from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { Subject } from 'rxjs';
import { SearchAdsService } from './search-ads.service';

describe('SearchAdsService', () => {
  let service: SearchAdsService;
  let filterParametersStoreServiceMock;
  let adsServiceMock;
  const filterParametersSubject: Subject<FilterParameter[]> = new Subject<FilterParameter[]>();

  beforeEach(() => {
    filterParametersStoreServiceMock = {
      parameters$: filterParametersSubject.asObservable(),
    };

    adsServiceMock = { ...MockAdsService };

    TestBed.configureTestingModule({
      providers: [
        SearchAdsService,
        {
          provide: FILTER_PARAMETER_STORE_TOKEN,
          useValue: filterParametersStoreServiceMock,
        },
        {
          provide: AdsService,
          useValue: adsServiceMock,
        },
      ],
    });

    service = TestBed.inject(SearchAdsService);
  });

  describe('when initialize observables', () => {
    beforeEach(() => {
      service.init();
    });

    it('should set ads keyword to null if it does not have keyword filter', () => {
      spyOn(adsServiceMock, 'setAdKeywords').and.callThrough();
      spyOn(adsServiceMock, 'refresh').and.callThrough();

      filterParametersSubject.next([{ key: FILTER_QUERY_PARAM_KEY.professional, value: 'anyValue' }]);

      expect(adsServiceMock.setAdKeywords).toHaveBeenCalledTimes(1);
      expect(adsServiceMock.setAdKeywords).toHaveBeenCalledWith({ content: null });
      expect(adsServiceMock.refresh).toHaveBeenCalledTimes(1);
      expect(adsServiceMock.refresh).toHaveBeenCalledWith();
    });

    it('should set ads keywords and refresh if it has keyword filter', () => {
      const keywordValue = 'keywordValueMock';
      spyOn(adsServiceMock, 'setAdKeywords').and.callThrough();
      spyOn(adsServiceMock, 'refresh').and.callThrough();

      filterParametersSubject.next([{ key: FILTER_QUERY_PARAM_KEY.keywords, value: keywordValue }]);

      expect(adsServiceMock.setAdKeywords).toHaveBeenCalledTimes(1);
      expect(adsServiceMock.setAdKeywords).toHaveBeenCalledWith({ content: keywordValue });
      expect(adsServiceMock.refresh).toHaveBeenCalledTimes(1);
      expect(adsServiceMock.refresh).toHaveBeenCalledWith();
    });
  });
});
