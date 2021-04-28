import { SearchService } from '@public/features/search/core/services/search.service';
import { TestBed } from '@angular/core/testing';
import { SearchResolver } from './search.resolver';
describe('SearchResolver', () => {
  let resolver: SearchResolver;
  let searchServiceMock;

  beforeEach(() => {
    searchServiceMock = {
      init: () => {},
    };

    TestBed.configureTestingModule({
      providers: [
        SearchResolver,
        {
          provide: SearchService,
          useValue: searchServiceMock,
        },
      ],
    });

    resolver = TestBed.inject(SearchResolver);
  });

  describe('resolve', () => {
    it('should call init of search service', () => {
      spyOn(searchServiceMock, 'init').and.callThrough();

      resolver.resolve();

      expect(searchServiceMock.init).toHaveBeenCalledTimes(1);
      expect(searchServiceMock.init).toHaveBeenCalledWith();
    });
  });
});
