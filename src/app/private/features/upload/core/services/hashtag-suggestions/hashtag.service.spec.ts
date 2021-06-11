import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';
import { MOCK_HASHTAG_RESPONSE, MOCK_PREFIX_HASHTAG } from '@fixtures/hashtag-suggester.fixtures.spec';
import { GENERAL_HASHTAG_SUGGESTERS_API, HashtagService, HASHTAG_SUGGESTERS_API } from './hashtag.service';

describe('HashtagService', () => {
  let service: HashtagService;
  let httpMock: HttpTestingController;
  const categoryId = 100;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HashtagService],
    });
    service = TestBed.inject(HashtagService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we load hashtags...', () => {
    it('if they are general hashtags, we should load general hashtags', () => {
      const expectedUrl = `${environment.baseUrl}${GENERAL_HASHTAG_SUGGESTERS_API}?category_id=100&prefix=${MOCK_PREFIX_HASHTAG}&start=0`;

      service.loadGeneralHashtags(categoryId, MOCK_PREFIX_HASHTAG).subscribe((response) => {
        expect(response).toEqual(MOCK_HASHTAG_RESPONSE);
      });

      const request = httpMock.expectOne(expectedUrl);
      expect(request.request.method).toBe('GET');
      request.flush(MOCK_HASHTAG_RESPONSE);
    });

    it('if they are not general hashtags, we should load hashtags that are not from general endpoint', () => {
      const expectedUrl = `${environment.baseUrl}${HASHTAG_SUGGESTERS_API}?category_id=100&prefix=${MOCK_PREFIX_HASHTAG}&start=0`;

      service.loadHashtags(categoryId, MOCK_PREFIX_HASHTAG).subscribe((response) => {
        console.log('response', response);
        expect(response).toEqual(MOCK_HASHTAG_RESPONSE);
      });

      const request = httpMock.expectOne(expectedUrl);
      expect(request.request.method).toBe('GET');
      request.flush(MOCK_HASHTAG_RESPONSE);
    });
  });
});
