import { TestBed } from '@angular/core/testing';
import { MapReviewService } from './map-review.service';
import { REVIEWS_RESPONSE, MOCK_REVIEWS } from '@fixtures/review.fixtures.spec';

describe('MapReviewService', () => {
  let mapReviewService: MapReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapReviewService],
    });
    mapReviewService = TestBed.inject(MapReviewService);
  });

  it('should be created', () => {
    expect(mapReviewService).toBeTruthy();
  });

  describe('When asking for reviews map', () => {
    it('should return correctly mapped list', () => {
      const mapped = mapReviewService.mapItems(REVIEWS_RESPONSE);

      expect(mapped).toEqual(MOCK_REVIEWS);
    });
  });
});
