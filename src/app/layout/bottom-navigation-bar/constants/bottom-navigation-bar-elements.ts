import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { BottomNavigationBarElement } from '../interfaces/bottom-navigation-bar-element.interface';

const ICONS_FOLDER = '/assets/icons/bottom-navigation-bar';

export enum BOTTOM_NAVIGATION_BAR_ELEMENTS_ENUM {
  HOME,
  FAVORITES,
  UPLOAD,
  INBOX,
  YOU,
}

export const BOTTOM_NAVIGATION_BAR_ELMENTS_RECORD: Record<BOTTOM_NAVIGATION_BAR_ELEMENTS_ENUM, BottomNavigationBarElement> = {
  [BOTTOM_NAVIGATION_BAR_ELEMENTS_ENUM.HOME]: {
    text: $localize`:@@web_components_tabbar_3:Home`,
    alternativeText: $localize`:@@web_components_tabbar_3:Home`,
    icon: `${ICONS_FOLDER}/home.svg`,
    activeIcon: `${ICONS_FOLDER}/home-active.svg`,
    href: `/${PUBLIC_PATHS.SEARCH}`,
    external: false,
  },
  [BOTTOM_NAVIGATION_BAR_ELEMENTS_ENUM.FAVORITES]: {
    text: $localize`:@@web_components_tabbar_4:Favorites`,
    alternativeText: $localize`:@@web_components_tabbar_4:Favorites`,
    icon: `${ICONS_FOLDER}/favorites.svg`,
    activeIcon: `${ICONS_FOLDER}/favorites-active.svg`,
    href: `/favorites`,
    external: false,
  },
  [BOTTOM_NAVIGATION_BAR_ELEMENTS_ENUM.UPLOAD]: {
    text: $localize`:@@web_components_tabbar_5:Upload`,
    alternativeText: $localize`:@@web_components_tabbar_5:Upload`,
    icon: `${ICONS_FOLDER}/upload.svg`,
    activeIcon: `${ICONS_FOLDER}/upload-active.svg`,
    href: `/catalog/upload`,
    external: false,
  },
  [BOTTOM_NAVIGATION_BAR_ELEMENTS_ENUM.INBOX]: {
    text: $localize`:@@web_components_tabbar_6:Messages`,
    alternativeText: $localize`:@@web_components_tabbar_6:Messages`,
    icon: `${ICONS_FOLDER}/inbox.svg`,
    activeIcon: `${ICONS_FOLDER}/inbox-active.svg`,
    href: `/chat`,
    external: false,
  },
  [BOTTOM_NAVIGATION_BAR_ELEMENTS_ENUM.YOU]: {
    text: 'You',
    alternativeText: 'You',
    icon: `${ICONS_FOLDER}/you.svg`,
    activeIcon: `${ICONS_FOLDER}/you-active.svg`,
    // TODO: Change with /you tab when available
    href: `/catalog/list`,
    external: false,
  },
};
