import { ReviewsDataDto } from '@api/reviews/dtos/reviews-data-dto.interface';

export const reviewsDataDtoFixture: ReviewsDataDto = {
  id: 'review-id',
  date: 0,
  canTranslate: false,
  comments: 'Comments about the review',
  scoring: 3,
};
