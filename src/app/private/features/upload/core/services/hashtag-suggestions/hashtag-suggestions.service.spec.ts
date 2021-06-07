import { HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment.beta';
import {
  MOCK_HASHTAG_SUGGESTERS,
  MOCK_HASHTAG_SUGGESTERS_RESPONSE,
  MOCK_PREFIX_HASHTAG_SUGGESTERS,
} from '@fixtures/hashtag-suggester.fixtures.spec';
import { NEXT_HEADER_PAGE } from '@public/features/search/core/services/infrastructure/api/search-api.service';

import { GENERAL_HASHTAG_SUGGESTERS_API, HashtagSuggestionsService, HASHTAG_SUGGESTERS_API } from './hashtag-suggestions.service';

describe('HashtagSuggestionsService', () => {
  let service: HashtagSuggestionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HashtagSuggestionsService],
    });
    service = TestBed.inject(HashtagSuggestionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we load hashtags...', () => {
    it('if they are general hashtags, we should load general hashtags', () => {
      const expectedUrl = `${environment.baseUrl}${GENERAL_HASHTAG_SUGGESTERS_API}?category_id=100&prefix=${MOCK_PREFIX_HASHTAG_SUGGESTERS}&start=0`;

      service.loadHashtagSugessters(100, true, MOCK_PREFIX_HASHTAG_SUGGESTERS).subscribe((response) => {
        expect(response).toEqual(MOCK_HASHTAG_SUGGESTERS_RESPONSE);
      });

      const request = httpMock.expectOne(expectedUrl);
      expect(request.request.method).toBe('GET');
      request.flush(MOCK_HASHTAG_SUGGESTERS_RESPONSE, {
        headers: new HttpHeaders().set(NEXT_HEADER_PAGE, 'category_id=100&start=20'),
      });
    });

    it('if they are not general hashtags, we should load hashtags that are not from general endpoint', () => {
      const expectedUrl = `${environment.baseUrl}${HASHTAG_SUGGESTERS_API}?category_id=100&prefix=${MOCK_PREFIX_HASHTAG_SUGGESTERS}&start=0`;

      service.loadHashtagSugessters(100, false, MOCK_PREFIX_HASHTAG_SUGGESTERS).subscribe((response) => {
        expect(response).toEqual(MOCK_HASHTAG_SUGGESTERS_RESPONSE);
      });

      const request = httpMock.expectOne(expectedUrl);
      expect(request.request.method).toBe('GET');
      request.flush(MOCK_HASHTAG_SUGGESTERS_RESPONSE, {
        headers: new HttpHeaders().set(NEXT_HEADER_PAGE, 'category_id=100&start=20'),
      });
    });
  });

  describe('when we add hashTag', () => {
    it('should offer us the selected hashtags with the new added hashtag', () => {
      service.addSuggesters(MOCK_HASHTAG_SUGGESTERS[0]);

      expect(service.selectedSuggestors).toEqual([MOCK_HASHTAG_SUGGESTERS[0]]);
    });
  });

  describe('when we delete hashTag', () => {
    it('should offer us the selected hashtags without the hashtag we want to delete', () => {
      service.deleteSuggesters(MOCK_HASHTAG_SUGGESTERS[0]);

      expect(service.selectedSuggestors).toEqual([]);
    });
  });
});
