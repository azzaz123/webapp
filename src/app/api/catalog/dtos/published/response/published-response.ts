import { PublishedItemDto, PublishedMeta } from '@api/catalog/dtos';

export interface PublishedResponse {
  data: PublishedItemDto[];
  meta: PublishedMeta;
}
