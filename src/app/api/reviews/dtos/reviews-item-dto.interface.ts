import { ReviewsImageDto } from '@api/reviews/dtos/reviews-image-dto.interface';

export interface ReviewsItemDto {
  category_id: number;
  id: string;
  image: ReviewsImageDto;
  web_link: string;
  title: string;
}
