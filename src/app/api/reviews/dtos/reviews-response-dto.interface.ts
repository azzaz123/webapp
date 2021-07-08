import { ReviewsItemDto } from '@api/reviews/dtos/reviews-item-dto.interface';
import { ReviewsUserDto } from '@api/reviews/dtos/reviews-user-dto.interface';
import { ReviewsDataDto } from '@api/reviews/dtos/reviews-data-dto.interface';

export interface ReviewsResponseDto {
  type: string;
  item: ReviewsItemDto;
  review: ReviewsDataDto;
  user: ReviewsUserDto;
}
