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
    label: $localize`:@@ProfileTabsPublishedLabel:Published`,
    href: PUBLIC_PROFILE_PATHS.PUBLISHED,
  },
  {
    id: 'reviews',
    label: $localize`:@@ProfileTabsReviewsLabel:Reviews`,
    href: PUBLIC_PROFILE_PATHS.REVIEWS,
  },
];
