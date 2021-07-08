import { Review } from '@private/features/reviews/core/review';
import { User } from '@core/user/user';
import { reviewsUserDtoFixture } from '@api/fixtures/reviews/reviews-user-dto.fixture';
import { ReviewItem } from '@private/features/reviews/core/review-item';
import { reviewsItemDtoFixture } from '@api/fixtures/reviews/reviews-item-dto.fixture';
import { reviewsElementDtoFixture } from '@api/fixtures/reviews/reviews-element-dto.fixture';

export const reviewUserFixture = new User(
  reviewsUserDtoFixture.id,
  reviewsUserDtoFixture.micro_name,
  reviewsUserDtoFixture.image ? { urls_by_size: reviewsUserDtoFixture.image } : null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  reviewsUserDtoFixture.web_slug
);

export const reviewItemFixture = new ReviewItem(
  reviewsItemDtoFixture.id,
  reviewsItemDtoFixture.category_id,
  reviewsItemDtoFixture.title,
  reviewsItemDtoFixture.image,
  reviewsItemDtoFixture.web_link
);

export const reviewFixture = new Review(
  reviewsElementDtoFixture.review.date,
  reviewsElementDtoFixture.review.scoring,
  reviewsElementDtoFixture.type,
  reviewsElementDtoFixture.review.comments,
  reviewItemFixture,
  reviewUserFixture
);
