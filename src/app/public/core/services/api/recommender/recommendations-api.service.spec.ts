import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RecommendationsApiService, GET_RECOMMENDATIONS_ENDPOINT } from './recommendations-api.service';

describe('RecommenderApiService', () => {
  let httpMock: HttpTestingController;
  let recommendationsApiService: RecommendationsApiService;
  const ITEM_ID = '123';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecommendationsApiService],
      imports: [HttpClientTestingModule],
    });

    recommendationsApiService = TestBed.inject(RecommendationsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getRecommendedItemsByItemId', () => {
    it('should ask for the recommended items', () => {
      const expectedUrl = GET_RECOMMENDATIONS_ENDPOINT(ITEM_ID);

      recommendationsApiService.getRecommendedItemsByItemId(ITEM_ID).subscribe();
      const req = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });
});
