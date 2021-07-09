import { ReviewsDataDto } from '@api/reviews/dtos/reviews-data-dto.interface';

export const reviewsDataDtoFixture: ReviewsDataDto = {
  id: 'review-id',
  date: 0,
  can_translate: false,
  comments: 'Comments about the review',
  scoring: 3,
};
