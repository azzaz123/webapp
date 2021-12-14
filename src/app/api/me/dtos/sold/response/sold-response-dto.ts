import { SoldItemDto } from './sold-item-dto';

export interface SoldItemResponseDto {
  data: SoldItemDto[];
  meta: { next?: string };
}
