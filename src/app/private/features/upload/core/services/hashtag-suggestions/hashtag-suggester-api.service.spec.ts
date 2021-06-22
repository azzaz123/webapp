import { HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NullQueryParamsInterceptor } from '@core/http/interceptors';
import { environment } from '@environments/environment';
import { MOCK_HASHTAGS, MOCK_PREFIX_HASHTAG } from '@fixtures/hashtag.fixtures.spec';
import { GENERAL_HASHTAG_SUGGESTERS_API, HashtagSuggesterApiService, HASHTAG_SUGGESTERS_API } from './hashtag-suggester-api.service';

describe('HashtagSuggesterApiService', () => {
  let service: HashtagSuggesterApiService;
  let httpMock: HttpTestingController;
  const nextPageHeaderName = 'x-nextpage';
  const category_id = '100';
  const start = '10';

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
      let response;
      const paramUrl = `category_id=${category_id}&prefix=${MOCK_PREFIX_HASHTAG}&start=${start}`;
      const expectedUrl = `${environment.baseUrl}${GENERAL_HASHTAG_SUGGESTERS_API}?${paramUrl}`;
      const HttpHeader = {};
      HttpHeader[nextPageHeaderName] = paramUrl;

      service.getHashtagsByPrefix(category_id, start, MOCK_PREFIX_HASHTAG).subscribe((r) => {
        response = r;
      });
      const request = httpMock.expectOne(expectedUrl);
      request.flush(
        {
          hashtags: MOCK_HASHTAGS,
        },
        { headers: new HttpHeaders(HttpHeader) }
      );

      expect(request.request.urlWithParams).toEqual(expectedUrl);
      expect(request.request.method).toBe('GET');
      expect(response.init).toBe(+start);
      expect(response.results).toBe(MOCK_HASHTAGS);
    });

    it('should load hashtags and call getHashtags endpint if we load hashtags when we initiate hashtag section', () => {
      let response;
      const paramUrl = `category_id=${category_id}&start=${start}`;
      const expectedUrl = `${environment.baseUrl}${HASHTAG_SUGGESTERS_API}?${paramUrl}`;
      const HttpHeader = {};
      HttpHeader[nextPageHeaderName] = paramUrl;

      service.getHashtags(category_id, start).subscribe((r) => {
        response = r;
      });
      const request = httpMock.expectOne(expectedUrl);
      request.flush(
        {
          hashtags: MOCK_HASHTAGS,
        },
        { headers: new HttpHeaders(HttpHeader) }
      );

      expect(request.request.urlWithParams).toEqual(expectedUrl);
      expect(request.request.method).toBe('GET');
      expect(response.init).toBe(+start);
      expect(response.results).toBe(MOCK_HASHTAGS);
    });
  });
});
