import { ReviewsElementDto } from '@api/reviews/dtos/reviews-element-dto.interface';
import { ToDomainMapper } from '@api/core/utils/types';
import { Review } from '@private/features/reviews/core/review';
import { User } from '@core/user/user';
import { ReviewsItemDto } from '@api/reviews/dtos/reviews-item-dto.interface';
import { ReviewsUserDto } from '@api/reviews/dtos/reviews-user-dto.interface';
import { ReviewItem } from '@private/features/reviews/core/review-item';

export const mapReviewsDtoToReview: ToDomainMapper<ReviewsElementDto[], Review[]> = (reviewElements: ReviewsElementDto[]) => {
  return reviewElements.map((dto: ReviewsElementDto) => {
    const { item, user, review, type } = dto;
    const reviewItem: ReviewItem = mapItem(item);
    const reviewUser: User = mapUser(user);

    return new Review(review.date, review.scoring, type, review.comments, reviewItem, reviewUser);
  });
};

function mapItem(itemDto: ReviewsItemDto): ReviewItem {
  if (!itemDto) {
    return null;
  }

  const { id, category_id, title, image, web_link } = itemDto;

  return new ReviewItem(id, category_id, title, image, web_link);
}

function mapUser(userDto: ReviewsUserDto): User {
  if (!userDto) {
    return null;
  }

  return new User(
    userDto.id,
    userDto.micro_name,
    userDto.image ? { urls_by_size: userDto.image } : null,
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
    userDto.web_slug
  );
}
