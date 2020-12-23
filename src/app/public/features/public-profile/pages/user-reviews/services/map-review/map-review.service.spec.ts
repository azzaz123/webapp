import { TestBed } from '@angular/core/testing';
import { MapReviewService } from './map-review.service';
import { REVIEWS_RESPONSE, MOCK_REVIEWS } from '@fixtures/review.fixtures.spec';

describe('MapReviewService', () => {
  let service: MapReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapReviewService],
    });
    service = TestBed.inject(MapReviewService);
  });

  describe('When asking for reviews map', () => {
    it('should return correctly mapped list', () => {
      const mapped = service.mapItems(REVIEWS_RESPONSE);

      expect(mapped).toEqual(MOCK_REVIEWS);
    });
  });
});
