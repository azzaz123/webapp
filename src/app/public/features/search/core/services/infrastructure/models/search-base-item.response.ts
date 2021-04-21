import { SearchItemImageResponse } from './search-item-image.response';

export interface SearchBaseItemResponse {
  id: string;
  title: string;
  distance: number;
  images: SearchItemImageResponse[];
  flags: {
    banned: boolean;
    expired: boolean;
    onhold: boolean;
    pending: boolean;
    reserved: boolean;
    sold: boolean;
  };
  visibility_flags: {
    boosted: boolean;
    bumped: boolean;
    country_bumped: boolean;
    highlighted: boolean;
    urgent: boolean;
  };
  user: {
    id: string;
    image: SearchItemImageResponse;
    kind: string;
    micro_name: string;
    online: boolean;
  };
  price: number;
  currency: string;
  web_slug: string;
  category_id: number;
}
