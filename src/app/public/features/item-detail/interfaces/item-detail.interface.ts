import { Coordinate } from '@core/geolocation/address-response.interface';
import { CounterSpecifications } from '../components/item-specifications/interfaces/item.specifications.interface';
import { ItemDetailLocation } from '../pages/constants/item-detail.interface';
import { ItemDetailResponse } from './item-detail-response.interface';
import { SocialShare } from './social-share.interface';

export interface ItemDetail extends ItemDetailResponse {
  specifications: CounterSpecifications[];
  location: ItemDetailLocation;
  socialShare: SocialShare;
  coordinate: Coordinate;
  images: string[];
  bigImages: string[];
  extraInfo: string[];
  locationSpecifications: string;
  haveCoordinates: boolean;
  isApproximatedLocation: boolean;
  isItemACar: boolean;
  isItemAPhone: boolean;
  isAFashionItem: boolean;
}
