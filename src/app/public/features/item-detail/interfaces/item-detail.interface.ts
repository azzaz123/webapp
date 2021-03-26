import { Coordinate } from '@core/geolocation/address-response.interface';
import { UserStats } from '@core/user/user-stats.interface';
import { Observable } from 'rxjs';
import { CounterSpecifications } from '../components/item-specifications/interfaces/item.specifications.interface';
import { ItemTaxonomies } from '../components/item-taxonomies/interfaces/item-taxonomies.interface';
import { ItemDetailLocation } from '../pages/constants/item-detail.interface';
import { ItemDetailResponse } from './item-detail-response.interface';
import { SocialShare } from './social-share.interface';

export interface ItemDetail extends ItemDetailResponse {
  counterSpecifications: CounterSpecifications[];
  location: ItemDetailLocation;
  socialShare: SocialShare;
  coordinate: Coordinate;
  images: string[];
  bigImages: string[];
  userStats: Observable<UserStats>;
  extraInfo: string[];
  locationSpecifications: string;
  taxonomiesSpecifications: Observable<ItemTaxonomies>;
  haveCoordinates: boolean;
  isApproximatedLocation: boolean;
  isItemACar: boolean;
  isItemAPhone: boolean;
  isAFashionItem: boolean;
}
