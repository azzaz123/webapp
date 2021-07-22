import { ReviewsItemDto } from '@api/reviews/dtos/reviews-item-dto.interface';
import { reviewsImageDtoFixture } from '@api/fixtures/reviews/reviews-image-dto.fixture';

export const reviewsItemDtoFixture: ReviewsItemDto = {
  id: 'reviews-item-id',
  category_id: 200,
  image: reviewsImageDtoFixture,
  title: 'Item Title',
  web_link: 'web-slug',
};
