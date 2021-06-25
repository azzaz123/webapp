import { ANALYTICS_EVENT_NAMES } from '@core/analytics/analytics-constants';
import { PERMISSIONS } from '@core/user/user-constants';

export interface FooterLink {
  label: string;
  href: string;
  trackEvent?: ANALYTICS_EVENT_NAMES;
}
export interface FooterLinkSection {
  title: string;
  excludedLanguages?: string[];
  links: FooterLink[];
  permission?: PERMISSIONS;
}

export interface FooterIcon {
  label: string;
  href: string;
  iconSrc: string;
}
