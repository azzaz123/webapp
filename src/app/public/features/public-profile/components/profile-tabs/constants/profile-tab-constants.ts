import { PUBLIC_PROFILE_PATHS } from '../../../public-profile-routing-constants';

export const PROFILE_TABS = [
  {
    label: $localize`:@@ProfileTabsPublishedLabel:Published`,
    href: PUBLIC_PROFILE_PATHS.PUBLISHED,
  },
  {
    label: $localize`:@@ProfileTabsReviewsLabel:Reviews`,
    href: PUBLIC_PROFILE_PATHS.REVIEWS,
  },
  {
    label: $localize`:@@ProfileTabsInfoLabel:Info`,
    href: PUBLIC_PROFILE_PATHS.INFO,
  },
];
