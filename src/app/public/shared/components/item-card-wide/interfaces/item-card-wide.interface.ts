import { Image } from '@core/user/user-response.interface';
import { ItemCardCore } from '@public/core/interfaces/item-card-core.interface';

export interface ItemCardWide extends ItemCardCore {
  images: Image[];
}
