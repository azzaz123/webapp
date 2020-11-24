import { ApiResponse } from '../resource/api-response.interface';
import { Profile } from './profile';

export interface ProfileResponse extends ApiResponse {
  id: string;
  item_images: ProfileImage[];
  micro_name: string;
  num_total_items: number;
  scoring_stars: number;
  user_image: ProfileImage;
  favorited: boolean;
  is_professional: boolean;
  screen_name: string;
}

export interface ProfileImage {
  large: string;
  medium: string;
  original: string;
  original_height: number;
  original_width: number;
  small: string;
  xlarge: string;
  xsmall: string;
}

export interface ProfilesData {
  data: Profile[];
  init: number;
}
