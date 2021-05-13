import { SearchService } from '@public/features/search/core/services/search.service';
import { TestBed } from '@angular/core/testing';
import { SearchResolver } from './search.resolver';
import { SearchAdsService } from '../ads/search-ads.service';
describe('SearchResolver', () => {
  let resolver: SearchResolver;
  let searchServiceMock;
  let searchAdsServiceMock;

  beforeEach(() => {
    searchServiceMock = {
      init: () => {},
    };

    searchAdsServiceMock = {
      init: () => {},
    };

    TestBed.configureTestingModule({
      providers: [
        SearchResolver,
        {
          provide: SearchService,
          useValue: searchServiceMock,
        },
        {
          provide: SearchAdsService,
          useValue: searchAdsServiceMock,
        },
      ],
    });

    resolver = TestBed.inject(SearchResolver);
  });

  // TODO: Should be removed when we remove the resolver
  xdescribe('resolve', () => {
    it('should call init of search service', () => {
      spyOn(searchServiceMock, 'init').and.callThrough();

      resolver.resolve();

      expect(searchServiceMock.init).toHaveBeenCalledTimes(1);
      expect(searchServiceMock.init).toHaveBeenCalledWith();
    });

    it('should call init of search ads service', () => {
      spyOn(searchAdsServiceMock, 'init').and.callThrough();

      resolver.resolve();

      expect(searchAdsServiceMock.init).toHaveBeenCalledTimes(1);
      expect(searchAdsServiceMock.init).toHaveBeenCalledWith();
    });
  });
});
