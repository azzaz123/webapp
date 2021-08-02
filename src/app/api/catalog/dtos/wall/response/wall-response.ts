import { WallItem, WallMeta } from '@api/catalog/dtos';

export interface WallResponse {
  data: WallItem[];
  meta: WallMeta;
}
