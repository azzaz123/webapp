/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

import { Profile } from './profile';
import {
  PROFILE_ID,
  MICRO_NAME,
  PROFILE_IMAGE,
  NUM_TOTAL_ITEMS,
  FAVORITED,
  IS_PROFESSIONAL,
  SCREEN_NAME,
} from '../../../tests/profile.fixtures.spec';
import { SCORING_STARS } from '../../../tests/user.fixtures.spec';

describe('Profile', () => {
  it('should create an instance', () => {
    expect(
      new Profile(
        PROFILE_ID,
        [PROFILE_IMAGE],
        MICRO_NAME,
        NUM_TOTAL_ITEMS,
        SCORING_STARS,
        PROFILE_IMAGE,
        FAVORITED,
        IS_PROFESSIONAL,
        SCREEN_NAME
      )
    ).toBeTruthy();
  });

  it('should set the profile data through the constructor', () => {
    const profile: Profile = new Profile(
      PROFILE_ID,
      [PROFILE_IMAGE],
      MICRO_NAME,
      NUM_TOTAL_ITEMS,
      SCORING_STARS,
      PROFILE_IMAGE,
      FAVORITED,
      IS_PROFESSIONAL,
      SCREEN_NAME
    );

    expect(profile.id).toBe(PROFILE_ID);
    expect(profile.item_images).toEqual([PROFILE_IMAGE]);
    expect(profile.micro_name).toBe(MICRO_NAME);
    expect(profile.num_total_items).toBe(NUM_TOTAL_ITEMS);
    expect(profile.scoring_stars).toBe(SCORING_STARS);
    expect(profile.user_image).toBe(PROFILE_IMAGE);
    expect(profile.favorited).toBe(FAVORITED);
    expect(profile.is_professional).toBe(IS_PROFESSIONAL);
    expect(profile.screen_name).toBe(SCREEN_NAME);
  });
});
