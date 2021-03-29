import { ANALYTICS_EVENT_NAMES } from '@core/analytics/analytics-constants';

export interface FooterLink {
  label: string;
  href: string;
  trackEvent?: ANALYTICS_EVENT_NAMES;
}
export interface FooterLinkSection {
  title: string;
  excludedLanguages?: string[];
  links: FooterLink[];
}

export interface FooterIcon {
  label: string;
  href: string;
  iconSrc: string;
}
