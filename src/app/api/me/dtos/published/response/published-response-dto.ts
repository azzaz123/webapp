import { PublishedItemDto } from './published-item-dto';

export interface PublishedResponseDto {
  data: PublishedItemDto[];
  meta: { next?: string };
}
