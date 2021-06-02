import { CatalogItem } from '@core/api/dto/catalog/catalog-item';
import { CatalogMeta } from '@core/api/dto/catalog/catalog-meta';

export interface CatalogPublicProfileItemsResponse {
  data: CatalogItem[];
  meta: CatalogMeta;
}
