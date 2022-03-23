import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { PRO_PATHS } from '@private/features/pro/pro-routing-constants';
import { PROFILE_PATHS } from '@private/features/profile/profile-routing-constants';
import { YOU_PATHS } from '@private/features/you/constants/you-routing.constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import {
  DrawerNavigationBalanceElement,
  DrawerNavigationSection,
  DRAWER_NAVIGATION_ELEMENTS,
  DRAWER_NAVIGATION_SECTIONS,
} from '../interfaces/drawer-navigation-element.interface';

const ICONS_FOLDER = '/assets/icons/drawer-navigation';

export const DRAWER_NAVIGATION_CATALOG_SECTION: DrawerNavigationSection = {
  id: DRAWER_NAVIGATION_SECTIONS.CATALOG,
  title: $localize`:@@you_menu_catalog_label:Catalog`,
  elements: [
    {
      id: DRAWER_NAVIGATION_ELEMENTS.ITEMS,
      text: $localize`:@@you_menu_items_label:Items`,
      alternativeText: $localize`:@@you_menu_items_label:Items`,
      icon: `${ICONS_FOLDER}/items.svg`,
      external: false,
      href: `/${PRIVATE_PATHS.CATALOG}`,
    },
  ],
};

export const DRAWER_NAVIGATION_TRANSACTIONS_SECTION = (balance: string): DrawerNavigationSection => {
  return {
    id: DRAWER_NAVIGATION_SECTIONS.TRANSACTIONS,
    title: $localize`:@@you_menu_transactions_label:Transactions`,
    elements: [
      {
        id: DRAWER_NAVIGATION_ELEMENTS.SHIPPING,
        text: $localize`:@@you_menu_shipping_label:Shipping`,
        alternativeText: $localize`:@@you_menu_shipping_label:Shipping`,
        icon: `${ICONS_FOLDER}/shipping.svg`,
        external: false,
        href: `/${PRIVATE_PATHS.DELIVERY}`,
      },
      {
        id: DRAWER_NAVIGATION_ELEMENTS.WALLET,
        text: $localize`:@@you_menu_wallet_label:Wallet`,
        alternativeText: $localize`:@@you_menu_wallet_label:Wallet`,
        icon: `${ICONS_FOLDER}/wallet.svg`,
        external: false,
        href: `/${PRIVATE_PATHS.WALLET}`,
        balance,
      } as DrawerNavigationBalanceElement,
    ],
  };
};

export const DRAWER_NAVIGATION_ACCOUNT_SECTION = (logoutAction: Function): DrawerNavigationSection => {
  return {
    id: DRAWER_NAVIGATION_SECTIONS.ACCOUNT,
    title: $localize`:@@you_menu_account_label:Account`,
    elements: [
      {
        id: DRAWER_NAVIGATION_ELEMENTS.PROS,
        text: $localize`:@@you_menu_become_pro_label:Became a PRO`,
        alternativeText: $localize`:@@you_menu_become_pro_label:Became a PRO`,
        icon: `${ICONS_FOLDER}/pros.svg`,
        external: false,
        href: `/${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}`,
      },
      {
        id: DRAWER_NAVIGATION_ELEMENTS.SETTINGS,
        text: $localize`:@@you_menu_settings_label:Settings`,
        alternativeText: $localize`:@@you_menu_settings_label:Settings`,
        icon: `${ICONS_FOLDER}/settings.svg`,
        external: false,
        href: `${YOU_PATHS.SETTINGS}`,
        children: [
          {
            id: DRAWER_NAVIGATION_ELEMENTS.EDIT_PROFILE,
            text: $localize`:@@settings_menu_all_users_edit_profile_label:Edit profile`,
            alternativeText: $localize`:@@settings_menu_all_users_edit_profile_label:Edit profile`,
            external: false,
            href: `/${PRIVATE_PATHS.PROFILE}/${PROFILE_PATHS.INFO}`,
          },
          {
            id: DRAWER_NAVIGATION_ELEMENTS.VERIFICATIONS,
            text: $localize`:@@settings_menu_all_users_verifications_and_security_label:Verifications and security`,
            alternativeText: $localize`:@@settings_menu_all_users_verifications_and_security_label:Verifications and security`,
            external: false,
            href: `/${PRIVATE_PATHS.PROFILE}/${PROFILE_PATHS.VERIFICATIONS}`,
          },
          {
            id: DRAWER_NAVIGATION_ELEMENTS.SHIPPING_ADDRESS,
            text: $localize`:@@settings_menu_all_users_shipping_adress_label:Shipping address`,
            alternativeText: $localize`:@@settings_menu_all_users_shipping_adress_label:Shipping address`,
            external: false,
            href: `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.ADDRESS}`,
          },
          {
            id: DRAWER_NAVIGATION_ELEMENTS.NOTIFICATIONS,
            text: $localize`:@@settings_menu_all_users_notifications_label:Notifications`,
            alternativeText: $localize`:@@settings_menu_all_users_notifications_label:Notifications`,
            external: false,
            href: `/${PRIVATE_PATHS.PROFILE}/${PRIVATE_PATHS.NOTIFICATIONS}`,
          },
          {
            id: DRAWER_NAVIGATION_ELEMENTS.LOGOUT,
            text: $localize`:@@settings_menu_all_users_log_out_label:Log out`,
            alternativeText: $localize`:@@settings_menu_all_users_log_out_label:Log out`,
            external: false,
            href: '',
            onClick: () => logoutAction(),
          },
        ],
      },
    ],
  };
};

export const DRAWER_NAVIGATION_HELP_SECTION = (helpCenterLink: string): DrawerNavigationSection => {
  return {
    id: DRAWER_NAVIGATION_SECTIONS.HELP,
    title: $localize`:@@you_menu_wallapop_speaking_label:Wallapop speaking`,
    elements: [
      {
        id: DRAWER_NAVIGATION_ELEMENTS.HELP,
        text: $localize`:@@you_menu_help_label:Help`,
        alternativeText: $localize`:@@you_menu_help_label:Help`,
        icon: `${ICONS_FOLDER}/help.svg`,
        external: true,
        href: helpCenterLink,
      },
    ],
  };
};
