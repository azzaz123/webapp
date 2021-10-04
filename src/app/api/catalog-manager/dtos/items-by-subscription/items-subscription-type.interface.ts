export interface ItemBySubscriptionResponse {
  id: string;
  title: string;
  main_image: ImageItemBySubscription;
  modified_date: number;
  publish_date: number;
  sale_price: number;
  currency_code: string;
  active_item_purchase: any;
  flags: ItemFlags;
  visibility_flags: ItemVisibilityFlags;
  web_slug: string;
  car_info?: {
    km: number;
  };
}

export interface ImageItemBySubscription {
  id: string;
  original_width: number;
  original_height: number;
  average_hex_color: string;
  urls_by_size: {
    small: string;
    xmall: string;
    original: string;
    large: string;
    xlarge: string;
    medium: string;
  };
}

interface ItemFlags {
  pending: boolean;
  sold: boolean;
  favorite?: boolean;
  reserved: boolean;
  removed?: boolean;
  banned: boolean;
  expired: boolean;
  review_done?: boolean;
  bumped?: boolean;
  highlighted?: boolean;
  bump_type?: string;
  onhold?: boolean;
  notAvailable?: boolean;
}

interface ItemVisibilityFlags {
  bumped: boolean;
  highlighted: boolean;
  country_bumped: boolean;
}
