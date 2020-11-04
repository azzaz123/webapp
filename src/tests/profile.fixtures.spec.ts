import {
  ProfileImage,
  ProfileResponse,
} from '../app/core/profile/profile-response.interface';
import { Profile } from '../app/core/profile/profile';

export const PROFILE_ID = 'l1kmzn82zn3p';
export const MICRO_NAME = 'String S.';
export const NUM_TOTAL_ITEMS = 2;
export const SCORING_STARS = 4;
export const FAVORITED = true;
export const IS_PROFESSIONAL = true;
export const FAKE_PROFILE_NAME = 'No disponible';
export const SCREEN_NAME = 'fake-user-24234';

export const PROFILE_IMAGE: ProfileImage = {
  original_height: 100,
  original_width: 62,
  original:
    'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=ORIGINAL',
  small:
    'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
  large:
    'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
  medium:
    'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
  xlarge:
    'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
  xsmall:
    'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
};

export const PROFILE_DATA: ProfileResponse = {
  id: PROFILE_ID,
  item_images: [PROFILE_IMAGE],
  micro_name: MICRO_NAME,
  num_total_items: NUM_TOTAL_ITEMS,
  scoring_stars: SCORING_STARS,
  user_image: PROFILE_IMAGE,
  favorited: FAVORITED,
  is_professional: IS_PROFESSIONAL,
  screen_name: SCREEN_NAME,
};

export const MOCK_PROFILE: Profile = new Profile(
  PROFILE_DATA.id,
  PROFILE_DATA.item_images,
  PROFILE_DATA.micro_name,
  PROFILE_DATA.num_total_items,
  PROFILE_DATA.scoring_stars,
  PROFILE_DATA.user_image,
  PROFILE_DATA.favorited,
  PROFILE_DATA.is_professional,
  PROFILE_DATA.screen_name
);
