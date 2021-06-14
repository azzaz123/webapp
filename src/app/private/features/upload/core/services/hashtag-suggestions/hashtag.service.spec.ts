import { HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NullQueryParamsInterceptor } from '@core/http/interceptors';
import { environment } from '@environments/environment';
import { MOCK_HASHTAGS, MOCK_PREFIX_HASHTAG } from '@fixtures/hashtag.fixtures.spec';
import { NEXT_HEADER_PAGE } from '@public/features/search/core/services/infrastructure/api/search-api.service';
import { GENERAL_HASHTAG_SUGGESTERS_API, HashtagService, HASHTAG_SUGGESTERS_API } from './hashtag.service';

describe('HashtagService', () => {
  let service: HashtagService;
  let httpMock: HttpTestingController;
  const categoryId = 100;
  const page = 0;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HashtagService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: NullQueryParamsInterceptor,
          multi: true,
        },
      ],
    });
    service = TestBed.inject(HashtagService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we load hashtags...', () => {
    it('should load hashtags and call getHashtagsByPrefix endpint if we load hashtags through textarea typing', () => {
      const expectedUrl = `${environment.baseUrl}${GENERAL_HASHTAG_SUGGESTERS_API}?category_id=${categoryId}&prefix=${MOCK_PREFIX_HASHTAG}&start=${page}`;

      service.getPaginationHashtags(categoryId, page, MOCK_PREFIX_HASHTAG).subscribe();
      const request = httpMock.expectOne(expectedUrl);
      request.flush({ MOCK_HASHTAGS, headers: new HttpHeaders().set(NEXT_HEADER_PAGE, `category_id=${categoryId}&start=${page}`) });

      expect(request.request.urlWithParams).toEqual(expectedUrl);
      expect(request.request.method).toBe('GET');
    });

    it('should load hashtags and call getHashtags endpint if we load hashtags when we initiate hashtag section', () => {
      const expectedUrl = `${environment.baseUrl}${HASHTAG_SUGGESTERS_API}?category_id=${categoryId}&start=${page}`;

      service.getPaginationHashtags(categoryId, page).subscribe();
      const request = httpMock.expectOne(expectedUrl);
      request.flush({ MOCK_HASHTAGS, headers: new HttpHeaders().set(NEXT_HEADER_PAGE, `category_id=${categoryId}&start=${page}`) });

      expect(request.request.urlWithParams).toEqual(expectedUrl);
      expect(request.request.method).toBe('GET');
    });
  });
});
