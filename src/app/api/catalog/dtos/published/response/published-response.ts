import { PublishedItem, PublishedMeta } from '@api/catalog/dtos';

export interface PublishedResponse {
  data: PublishedItem[];
  meta: PublishedMeta;
}
