import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  RecommenderApiService,
  GET_RECOMENDATIONS_ENDPOINT,
} from './recommender-api.service';

describe('RecommenderApiService', () => {
  let httpMock: HttpTestingController;
  let recommenderApiService: RecommenderApiService;
  const ITEM_ID = '123';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecommenderApiService],
      imports: [HttpClientTestingModule],
    });

    recommenderApiService = TestBed.inject(RecommenderApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getRecommendedItemsByItemId', () => {
    it('should ask for the recommended items', () => {
      const expectedUrl = GET_RECOMENDATIONS_ENDPOINT(ITEM_ID);

      recommenderApiService.getRecommendedItemsByItemId(ITEM_ID).subscribe();
      const req = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });
});
