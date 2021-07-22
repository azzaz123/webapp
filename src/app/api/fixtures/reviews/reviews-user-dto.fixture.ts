import { ReviewsUserDto } from '@api/reviews/dtos/reviews-user-dto.interface';
import { reviewsImageDtoFixture } from '@api/fixtures/reviews/reviews-image-dto.fixture';

export const reviewsUserDtoFixture: ReviewsUserDto = {
  id: 'reviews-user-id',
  image: reviewsImageDtoFixture,
  micro_name: 'Micro',
  web_slug: 'slug',
};
