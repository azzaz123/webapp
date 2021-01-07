import { FooterLinkSection, FooterIcon } from '../interfaces/footer.interface';

export const FOOTER_LINKS: FooterLinkSection[] = [
  {
    title: $localize`:@@FooterLinksWallapopTitle:wallapop`,
    links: [
      {
        label: $localize`:@@FooterLinksAboutLabel:About`,
        href: $localize`:@@FooterLinksAboutHref:https://about.wallapop.com/en`,
      },
      {
        label: $localize`:@@FooterLinksPressLabel:Press`,
        href: $localize`:@@FooterLinksPressHref:https://about.wallapop.com/prensa`,
      },
      {
        label: $localize`:@@FooterLinksJobsLabel:Jobs`,
        href: $localize`:@@FooterLinksJobsHref:https://apply.workable.com/wallapop`,
      },
      {
        label: $localize`:@@FooterLinksTeamLabel:Team`,
        href: $localize`:@@FooterLinksTeamHref:https://about.wallapop.com/en/team`,
      },
    ],
  },
  {
    title: $localize`:@@FooterLinksSupportTitle:Support`,
    links: [
      {
        label: $localize`:@@FooterLinksFaqLabel:FAQ`,
        href: $localize`:@@FooterLinksFaqHref:https://ayuda.wallapop.com/hc/en-us`,
      },
      {
        label: $localize`:@@FooterLinksPublishRulesLabel:Publishing rules`,
        href: $localize`:@@FooterLinksPublishRulesHref:https://ayuda.wallapop.com/hc/en-us/articles/360004667717-What-content-is-not-allowed-on-wallapop-`,
      },
      {
        label: $localize`:@@FooterLinksSecurityTipsLabel:Security tips`,
        href: $localize`:@@FooterLinksSecurityTipsHref:https://ayuda.wallapop.com/hc/en-us/sections/360001177157-Security-tips`,
      },
    ],
  },
  {
    title: $localize`:@@FooterLinksLegalTitle:Legal`,
    links: [
      {
        label: $localize`:@@FooterLinksTermsLabel:Terms`,
        href: $localize`:@@FooterLinksTermsHref:https://about.wallapop.com/en/legal-terms-and-conditions`,
      },
      {
        label: $localize`:@@FooterLinksPrivacyLabel:Privacy`,
        href: $localize`:@@FooterLinksPrivacyHref:https://about.wallapop.com/en/privacy-policy`,
      },
      {
        label: $localize`:@@FooterLinksCookiessLabel:Cookies`,
        href: $localize`:@@FooterLinksCookiesHref:https://about.wallapop.com/en/cookies`,
      },
    ],
  },
  {
    title: $localize`:@@FooterLinksMotorTitle:Motor`,
    excludedLanguages: ['en'],
    links: [
      {
        label: $localize`:@@FooterLinksParticularLabel:Particular`,
        href: $localize`:@@FooterLinksParticularHref:https://about.wallapop.com/cars-buyer/`,
      },
      {
        label: $localize`:@@FooterLinksProfessionalLabel:Professional`,
        href: $localize`:@@FooterLinksProfessionalHref:https://about.wallapop.com/motor/`,
      },
    ],
  },
];

export const FOOTER_APPS: FooterIcon[] = [
  {
    label: 'Apple store',
    href:
      'https://app.adjust.com/rh6uzq?&_pid=web&_me=www&campaign=desktop_footer',
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
    href:
      'https://app.adjust.com/dst7wh?&_pid=web&_me=www&campaign=desktop_footer',
    iconSrc: '/assets/icons/footer/android.svg',
  },
];

export const FOOTER_SOCIAL: FooterIcon[] = [
  {
    label: $localize`:@@FooterSocialFacebookLabel:wallapop, the app to buy and sell nearby, it's also on Facebook`,
    href: 'https://facebook.com/wallapop.es',
    iconSrc: '/assets/icons/footer/facebook.svg',
  },
  {
    label: $localize`:@@FooterSocialTwitterLabel:wallapop, the app to buy and sell nearby, it's also on Twitter`,
    href: 'https://twitter.com/wallapop',
    iconSrc: '/assets/icons/footer/twitter.svg',
  },
  {
    label: $localize`:@@FooterSocialInstagramLabel:wallapop, the app to buy and sell nearby, it's also on Instagram`,
    href: 'https://www.instagram.com/wallapop/',
    iconSrc: '/assets/icons/footer/instagram.svg',
  },
];
