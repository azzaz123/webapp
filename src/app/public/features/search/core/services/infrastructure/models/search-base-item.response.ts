export interface SearchBaseItemResponse {
  id: string;
  title: string;
  distance: number;
  images: {
    original: string;
    xsmall: string;
    small: string;
    large: string;
    medium: string;
    xlarge: string;
    original_width: number;
    original_height: number;
  }[];
  user: {
    id: string;
    micro_name: string;
    image: {
      original: string;
      xsmall: string;
      small: string;
      large: string;
      medium: string;
      xlarge: string;
      original_width: number;
      original_height: number;
    },
    online: boolean;
    kind: string;
  };
  flags: {
    pending: boolean;
    sold: boolean;
    reserved: boolean;
    banned: boolean;
    expired: boolean;
    onhold: boolean;
  };
  visibility_flags: {
    bumped: boolean;
    highlighted: boolean;
    urgent: boolean;
    country_bumped: boolean;
    boosted: boolean;
  };
  price: number;
  currency: string;
  web_slug: string;
  category_id: number;
}
