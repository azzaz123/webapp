import { TestBed } from '@angular/core/testing';
import { AdsService } from '@core/ads/services';
import { AdsTargetingsService } from '@core/ads/services/ads-targetings/ads-targetings.service';
import { MockAdsService, MockAdsTargetingsService } from '@fixtures/ads.fixtures.spec';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_PARAMETER_STORE_TOKEN } from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { Subject } from 'rxjs';
import { SearchAdsService, SEARCH_SLOTS } from './search-ads.service';

describe('SearchAdsService', () => {
  let service: SearchAdsService;
  let filterParametersStoreServiceMock;
  let adsServiceMock;
  let adsTargetingsMock;
  const filterParametersSubject: Subject<FilterParameter[]> = new Subject<FilterParameter[]>();

  beforeEach(() => {
    filterParametersStoreServiceMock = {
      parameters$: filterParametersSubject.asObservable(),
    };

    adsServiceMock = { ...MockAdsService };
    adsTargetingsMock = { ...MockAdsTargetingsService };

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
        {
          provide: AdsTargetingsService,
          useValue: adsTargetingsMock,
        },
      ],
    });

    service = TestBed.inject(SearchAdsService);
  });

  describe('when recieving a new search keyword and it`s not during initialization', () => {
    beforeEach(() => {
      service.init();
    });

    it('should set ads targetings when changing query params and pass it through', () => {
      spyOn(adsTargetingsMock, 'setAdTargetings').and.callThrough();
      spyOn(adsServiceMock, 'refreshAllSlots').and.callThrough();
      const queryParams = [{ key: FILTER_QUERY_PARAM_KEY.professional, value: 'anyValue' }];

      filterParametersSubject.next(queryParams);
      filterParametersSubject.next(queryParams);

      expect(adsTargetingsMock.setAdTargetings).toHaveBeenCalledTimes(2);
      expect(adsTargetingsMock.setAdTargetings).toHaveBeenCalledWith(queryParams);
    });
  });

  describe('when the page goes from foreground to background', () => {
    it('should clear search ad slots', () => {
      spyOn(adsServiceMock, 'clearSlots');

      service.clearSlots();

      expect(adsServiceMock.clearSlots).toHaveBeenCalledWith(SEARCH_SLOTS);
    });
  });

  describe('when the page goes from background to foreground', () => {
    it('should refresh search ad slots', () => {
      spyOn(adsServiceMock, 'refreshSlots');

      service.refreshSlots();

      expect(adsServiceMock.refreshSlots).toHaveBeenCalledWith(SEARCH_SLOTS);
    });
  });

  describe('when the component is destroyed', () => {
    it('should destroy search ad slots', () => {
      spyOn(adsServiceMock, 'destroySlots');

      service.destroySlots();

      expect(adsServiceMock.destroySlots).toHaveBeenCalledWith(SEARCH_SLOTS);
    });
  });
});
