import { ReviewsElementDto } from '@api/reviews/dtos/reviews-element-dto.interface';
import { reviewsDataDtoFixture } from '@api/fixtures/reviews/reviews-data-dto.fixture';
import { reviewsItemDtoFixture } from '@api/fixtures/reviews/reviews-item-dto.fixture';
import { reviewsUserDtoFixture } from '@api/fixtures/reviews/reviews-user-dto.fixture';

export const reviewsElementDtoFixture: ReviewsElementDto = {
  review: reviewsDataDtoFixture,
  item: reviewsItemDtoFixture,
  type: 'sell',
  user: reviewsUserDtoFixture,
};
