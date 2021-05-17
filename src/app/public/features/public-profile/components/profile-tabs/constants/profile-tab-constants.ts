import { PUBLIC_PROFILE_PATHS } from '@public/features/public-profile/public-profile-routing-constants';
import { UserStat } from '@public/core/types/user/user-stat-type';

export interface ProfileTab {
  id: UserStat;
  count?: number;
  label: string;
  href: string;
}

export const PROFILE_TABS: ProfileTab[] = [
  {
    id: 'publish',
    label: $localize`:@@web_profile_tabs_published_label:Published`,
    href: PUBLIC_PROFILE_PATHS.PUBLISHED,
  },
  {
    id: 'reviews',
    label: $localize`:@@web_profile_tabs_reviews_label:Reviews`,
    href: PUBLIC_PROFILE_PATHS.REVIEWS,
  },
];
