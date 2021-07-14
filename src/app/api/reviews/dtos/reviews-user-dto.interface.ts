import { ReviewsImageDto } from '@api/reviews/dtos/reviews-image-dto.interface';

export interface ReviewsUserDto {
  id: string;
  image: ReviewsImageDto;
  micro_name: string;
  web_slug: string;
}
