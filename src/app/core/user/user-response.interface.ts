import { ApiResponse } from '../resource/api-response.interface';

export interface UserResponse extends ApiResponse {
  micro_name: string;
  image: Image;
  location: UserLocation;
  stats: UserStats;
  validations: UserValidations;
  verification_level: number;
  scoring_stars: number;
  scoring_starts: number;
  response_rate: string;
  online: boolean;
  received_reports: number;
  type: string;
  web_slug: string;
  first_name?: string;
  last_name?: string;
  birth_date?: number;
  gender?: string;
  email?: string;
  featured?: boolean;
  extra_info?: UserExtrainfo;
}

export interface Image {
  id: string;
  legacy_id?: number;
  original_width: number;
  original_height: number;
  average_hex_color: string;
  urls_by_size: {
    original: string;
    small: string;
    large: string;
    medium: string;
    xlarge: string;
  };
}

export interface UserLocation {
  id: number;
  approximated_latitude: number;
  approximated_longitude: number;
  city: string;
  zip: string;
  approxRadius: number;
  title?: string;
  full_address?: string;
  approximated_location?: boolean;
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface UserStats {
  published: number;
  sold: number;
  favorites: number;
  send_reviews: number;
  received_reviews: number;
  notification_read_pending: number;
  purchased: number;
}

export interface UserValidations {
  email: boolean;
  mobile: boolean;
  facebook: boolean;
  google_plus: boolean;
  gender: boolean;
  location: boolean;
  picture: boolean;
  scoring_stars: number;
  level: number;
  birthday: boolean;
}

export interface MotorPlan {
  type: string,
  subtype: string
}

export interface MotorPlanType {
  subtype: string;
  label: string;
  shortLabel?: string;
}

export interface ProfileSubscriptionInfo {
  status: string;
  product_group: {
    default_user_product_id: string;
    user_products: UserProduct[];
    type: string;
  };
}

export interface UserProduct {
  id: string;
  name: string;
  active: boolean;
  default_duration_index: number;
  durations: UserProductDuration[];
}

export interface UserProductDuration {
  id: string;
  duration: number;
  market_code: string;
  original_market_code: string;
  features: UserProductFeature[];
}

export interface UserProductFeature {
  name: string;
  enable: boolean;
}

let a = {
  'status': 'PURCHASE_ACTIVE',
  'product_group': {
    'default_user_product_id': 'g9kp615z5l32',
    'user_products': [{
      'id': 'g9kp615z5l32',
      'name': 'sub_basic',
      'active': true,
      'default_duration_index': 0,
      'durations': [{
        'id': 'g9kp615z5l32',
        'duration': 720,
        'market_code': '10',
        'features': [{
          'name': 'cars_subscription_tutorial_listinglimit5',
          'enable': true
        }, {
          'name': 'cars_subscription_tutorial_description2',
          'enable': true
        }, {
          'name': 'pro_subscription_tutorial_extra_fields_phone_web',
          'enable': true
        }, {
          'name': 'pro_subscription_tutorial_extra_fields_description_direction',
          'enable': true
        }, {
          'name': 'cars_subscription_tutorial_description3',
          'enable': true
        }, {'name': 'pro_subscription_tutorial_items_no_expire', 'enable': true}]
      }]
    }, {
      'id': 'dwlqzmo6vm94',
      'name': 'sub_pro',
      'active': false,
      'default_duration_index': 0,
      'durations': [{
        'id': 'dwlqzmo6vm94',
        'duration': 720,
        'market_code': '15',
        'features': [{
          'name': 'cars_subscription_tutorial_listinglimit9',
          'enable': true
        }, {
          'name': 'cars_subscription_tutorial_description2',
          'enable': true
        }, {
          'name': 'pro_subscription_tutorial_extra_fields_phone_web',
          'enable': true
        }, {
          'name': 'pro_subscription_tutorial_extra_fields_description_direction',
          'enable': true
        }, {
          'name': 'cars_subscription_tutorial_description3',
          'enable': true
        }, {
          'name': 'pro_subscription_tutorial_items_no_expire',
          'enable': true
        }, {'name': 'cars_subscription_tutorial_phone_on_car', 'enable': true}]
      }]
    }, {
      'id': 'd1mxzo7j9yq2',
      'name': 'sub_premium',
      'active': false,
      'default_duration_index': 0,
      'durations': [{
        'id': 'd1mxzo7j9yq2',
        'duration': 720,
        'market_code': '20',
        'features': [{
          'name': 'cars_subscription_tutorial_listinglimit15',
          'enable': true
        }, {
          'name': 'cars_subscription_tutorial_description2',
          'enable': true
        }, {
          'name': 'pro_subscription_tutorial_extra_fields_phone_web',
          'enable': true
        }, {
          'name': 'pro_subscription_tutorial_extra_fields_description_direction',
          'enable': true
        }, {
          'name': 'cars_subscription_tutorial_description3',
          'enable': true
        }, {
          'name': 'pro_subscription_tutorial_items_no_expire',
          'enable': true
        }, {'name': 'cars_subscription_tutorial_phone_on_car', 'enable': true}]
      }]
    }],
    'type': 'motor_plan_pro'
  }
};

export interface UserExtrainfo {
  description: string;
  address?: string;
  phone_number: string;
  link: string;
  latitude?: number;
  longitude?: number;
}
