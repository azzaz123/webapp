import { CatalogItem } from './catalog-item';
import { CatalogMeta } from './catalog-meta';

export interface CatalogPublicProfileItemsResponse {
  data: CatalogItem[];
  meta: CatalogMeta;
}
