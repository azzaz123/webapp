import { ANALYTICS_EVENT_NAMES } from '@core/analytics/analytics-constants';
import { PERMISSIONS } from '@core/user/user-constants';
import { FooterLinkSection, FooterIcon } from '../interfaces/footer.interface';

export const FOOTER_LINKS: FooterLinkSection[] = [
  {
    title: $localize`:@@web_footer_links_wallapop_title:wallapop`,
    links: [
      {
        label: $localize`:@@web_footer_links_about_label:About`,
        href: $localize`:@@web_footer_links_about_href:https://about.wallapop.com/en`,
      },
      {
        label: $localize`:@@web_footer_links_press_label:Press`,
        href: $localize`:@@web_footer_links_press_href:https://about.wallapop.com/prensa`,
      },
      {
        label: $localize`:@@web_footer_links_jobs_label:Jobs`,
        href: $localize`:@@web_footer_links_jobs_href:https://apply.workable.com/wallapop`,
      },
    ],
  },
  {
    title: $localize`:@@web_footer_links_support_title:Support`,
    links: [
      {
        label: $localize`:@@web_footer_links_faq_label:FAQ`,
        href: $localize`:@@web_footer_links_faq_href:https://ayuda.wallapop.com/hc/en-us`,
      },
      {
        label: $localize`:@@web_footer_links_publish_rules_label:Publishing rules`,
        href: $localize`:@@web_footer_links_publish_rules_href:https://ayuda.wallapop.com/hc/en-us/articles/360004667717-What-content-is-not-allowed-on-wallapop-`,
      },
      {
        label: $localize`:@@web_footer_links_security_tips_label:Security tips`,
        href: $localize`:@@web_footer_links_security_tips_href:https://ayuda.wallapop.com/hc/en-us/sections/360001177157-Security-tips`,
      },
    ],
  },
  {
    title: $localize`:@@web_footer_links_legal_title:Legal`,
    links: [
      {
        label: $localize`:@@web_footer_links_terms_label:Terms`,
        href: $localize`:@@web_footer_links_terms_href:https://about.wallapop.com/en/legal-terms-and-conditions`,
      },
      {
        label: $localize`:@@web_footer_links_privacy_label:Privacy`,
        href: $localize`:@@web_footer_links_privacy_href:https://about.wallapop.com/en/privacy-policy`,
      },
      {
        label: $localize`:@@web_footer_links_cookiess_label:Cookies`,
        href: $localize`:@@web_footer_links_cookies_href:https://about.wallapop.com/en/cookies`,
      },
    ],
  },
  {
    title: $localize`:@@web_footer_links_motor_title:Motor`,
    excludedLanguages: ['en'],
    links: [
      {
        label: $localize`:@@web_footer_links_particular_label:Particular`,
        href: $localize`:@@web_footer_links_particular_href:https://about.wallapop.com/cars-buyer/`,
      },
      {
        label: $localize`:@@web_footer_links_professional_label:Professional`,
        href: $localize`:@@web_footer_links_professional_href:https://about.wallapop.com/motor/`,
      },
    ],
  },
  {
    title: $localize`:@@web_footer_links_wallapop_pro_title:Wallapop Pro`,
    permission: PERMISSIONS.subscriptions,
    links: [
      {
        label: $localize`:@@web_footer_links_landing_pro_label:Boost your business`,
        href: $localize`:@@web_footer_links_landing_pro_href:https://novedades.wallapop.com/wallapop-pro/`,
        trackEvent: ANALYTICS_EVENT_NAMES.ClickProInfo,
      },
    ],
  },
];

export const FOOTER_APPS: FooterIcon[] = [
  {
    label: 'Apple store',
    href: 'https://app.adjust.com/rh6uzq?&_pid=web&_me=www&campaign=desktop_footer',
    iconSrc: '/assets/icons/footer/ios.svg',
  },
  {
    label: 'AppGallery',
    href:
      'https://app.adjust.com/6lbll37_ce4bza8?redirect=https%3A%2F%2Fappgallery.huawei.com%2F%23%2Fapp%2FC102446799&_pid=web&_me=www&campaign=desktop_footer',
    iconSrc: '/assets/icons/footer/huawei.svg',
  },
  {
    label: 'Google Play',
    href: 'https://app.adjust.com/dst7wh?&_pid=web&_me=www&campaign=desktop_footer',
    iconSrc: '/assets/icons/footer/android.svg',
  },
];

export const FOOTER_SOCIAL: FooterIcon[] = [
  {
    label: $localize`:@@web_footer_social_facebook_label:wallapop, the app to buy and sell nearby, it's also on Facebook`,
    href: 'https://facebook.com/wallapop.es',
    iconSrc: '/assets/icons/footer/facebook.svg',
  },
  {
    label: $localize`:@@web_footer_social_twitter_label:wallapop, the app to buy and sell nearby, it's also on Twitter`,
    href: 'https://twitter.com/wallapop',
    iconSrc: '/assets/icons/footer/twitter.svg',
  },
  {
    label: $localize`:@@web_footer_social_instagram_label:wallapop, the app to buy and sell nearby, it's also on Instagram`,
    href: 'https://www.instagram.com/wallapop/',
    iconSrc: '/assets/icons/footer/instagram.svg',
  },
];
