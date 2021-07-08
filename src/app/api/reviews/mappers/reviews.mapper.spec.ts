import { mapReviewsDtoToReview } from '@api/reviews/mappers/reviews.mapper';
import { reviewsElementDtoFixture } from '@api/fixtures/reviews/reviews-element-dto.fixture';
import { reviewFixture } from '@api/fixtures/reviews/review.fixture';
import { Review } from '@private/features/reviews/core/review';

describe('ReviewsMapper', () => {
  describe('when asking for reviews map', () => {
    it('should return correctly mapped list', () => {
      const reviews = mapReviewsDtoToReview([reviewsElementDtoFixture]);

      expect(reviews).toEqual([reviewFixture]);
      reviews.forEach((review) => {
        expect(review).toBeInstanceOf(Review);
      });
    });
  });
});
