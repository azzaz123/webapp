import { DrawerNavigationSection, DRAWER_NAVIGATION_SECTIONS } from '../interfaces/drawer-navigation-element.interface';

const ICONS_FOLDER = '/assets/icons/drawer-navigation';

export const DRAWER_NAVIGATION_SECTIONS_COLLECTION: Record<DRAWER_NAVIGATION_SECTIONS, DrawerNavigationSection> = {
  [DRAWER_NAVIGATION_SECTIONS.CATALOG]: {
    title: $localize`:@@you_menu_catalog_label:Catalog`,
    elements: [
      {
        text: $localize`:@@you_menu_items_label:Items`,
        alternativeText: $localize`:@@you_menu_items_label:Items`,
        icon: `${ICONS_FOLDER}/items.svg`,
        external: false,
        href: '/catalog/list',
      },
    ],
  },
  [DRAWER_NAVIGATION_SECTIONS.TRANSACTIONS]: {
    title: $localize`:@@you_menu_transactions_label:Transactions`,
    elements: [
      {
        text: $localize`:@@you_menu_shipping_label:Shipping`,
        alternativeText: $localize`:@@you_menu_shipping_label:Shipping`,
        icon: `${ICONS_FOLDER}/shipping.svg`,
        external: false,
        href: '/delivery',
      },
      {
        text: $localize`:@@you_menu_wallet_label:Wallet`,
        alternativeText: $localize`:@@you_menu_wallet_label:Wallet`,
        icon: `${ICONS_FOLDER}/wallet.svg`,
        external: false,
        href: '/wallet',
      },
    ],
  },
  [DRAWER_NAVIGATION_SECTIONS.ACCOUNT]: {
    title: $localize`:@@you_menu_account_label:Account`,
    elements: [
      {
        text: $localize`:@@you_menu_become_pro_label:Became a PRO`,
        alternativeText: $localize`:@@you_menu_become_pro_label:Became a PRO`,
        icon: `${ICONS_FOLDER}/pros.svg`,
        external: false,
        href: '/pro-manager/subscriptions',
      },
      {
        text: $localize`:@@you_menu_settings_label:Settings`,
        alternativeText: $localize`:@@you_menu_settings_label:Settings`,
        icon: `${ICONS_FOLDER}/settings.svg`,
        external: false,
        href: 'settings',
        children: [
          {
            text: $localize`:@@you_menu_become_pro_label:Became a PRO`,
            alternativeText: $localize`:@@you_menu_become_pro_label:Became a PRO`,
            icon: `${ICONS_FOLDER}/pros.svg`,
            external: false,
            href: '/pro-manager/subscriptions',
          },
          {
            text: $localize`:@@you_menu_become_pro_label:Became a PRO`,
            alternativeText: $localize`:@@you_menu_become_pro_label:Became a PRO`,
            icon: `${ICONS_FOLDER}/pros.svg`,
            external: false,
            href: '/pro-manager/subscriptions',
          },
        ],
      },
    ],
  },
  [DRAWER_NAVIGATION_SECTIONS.HELP]: {
    title: $localize`:@@you_menu_wallapop_speaking_label:Wallapop speaking`,
    elements: [
      {
        text: $localize`:@@you_menu_help_label:Help`,
        alternativeText: $localize`:@@you_menu_help_label:Help`,
        icon: `${ICONS_FOLDER}/help.svg`,
        external: true,
        href: 'https://ayuda.wallapop.com/hc/es-es',
      },
    ],
  },
};
