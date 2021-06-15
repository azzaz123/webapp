import { HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NullQueryParamsInterceptor } from '@core/http/interceptors';
import { environment } from '@environments/environment';
import { MOCK_HASHTAGS, MOCK_PREFIX_HASHTAG } from '@fixtures/hashtag.fixtures.spec';
import { NEXT_HEADER_PAGE } from '@public/features/search/core/services/infrastructure/api/search-api.service';
import { GENERAL_HASHTAG_SUGGESTERS_API, HashtagSuggesterApiService, HASHTAG_SUGGESTERS_API } from './hashtag-suggester-api.service';

describe('HashtagSuggesterApiService', () => {
  let service: HashtagSuggesterApiService;
  let httpMock: HttpTestingController;
  const category_id = '100';
  const start = '0';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HashtagSuggesterApiService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: NullQueryParamsInterceptor,
          multi: true,
        },
      ],
    });
    service = TestBed.inject(HashtagSuggesterApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we load hashtags...', () => {
    it('should load hashtags and call getHashtagsByPrefix endpint if we load hashtags through textarea typing', () => {
      const expectedUrl = `${environment.baseUrl}${GENERAL_HASHTAG_SUGGESTERS_API}?category_id=${category_id}&prefix=${MOCK_PREFIX_HASHTAG}&start=${start}`;

      service.getHashtagsByPrefix(category_id, start, MOCK_PREFIX_HASHTAG).subscribe();
      const request = httpMock.expectOne(expectedUrl);
      request.flush({ MOCK_HASHTAGS, headers: new HttpHeaders().set(NEXT_HEADER_PAGE, `category_id=${category_id}&start=${start}`) });

      expect(request.request.urlWithParams).toEqual(expectedUrl);
      expect(request.request.method).toBe('GET');
    });

    it('should load hashtags and call getHashtags endpint if we load hashtags when we initiate hashtag section', () => {
      const expectedUrl = `${environment.baseUrl}${HASHTAG_SUGGESTERS_API}?category_id=${category_id}&start=${start}`;

      service.getHashtags(category_id, start).subscribe();
      const request = httpMock.expectOne(expectedUrl);
      request.flush({ MOCK_HASHTAGS, headers: new HttpHeaders().set(NEXT_HEADER_PAGE, `category_id=${category_id}&start=${start}`) });

      expect(request.request.urlWithParams).toEqual(expectedUrl);
      expect(request.request.method).toBe('GET');
    });
  });
});
