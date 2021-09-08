import { ANALYTICS_EVENT_NAMES } from '@core/analytics/analytics-constants';
import { PERMISSIONS } from '@core/user/user-constants';
import { APP_LOCALE } from '@configs/subdomains.config';

export interface FooterLink {
  label: string;
  href: string;
  excludedLanguages?: APP_LOCALE[];
  trackEvent?: ANALYTICS_EVENT_NAMES;
}
export interface FooterLinkSection {
  title: string;
  excludedLanguages?: APP_LOCALE[];
  links: FooterLink[];
  permission?: PERMISSIONS;
}

export interface FooterIcon {
  label: string;
  href: string;
  iconSrc: string;
}
