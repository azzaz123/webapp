import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { BottomNavigationBarElement } from '../interfaces/bottom-navigation-bar-element.interface';

const ICONS_FOLDER = '/assets/icons/bottom-navigation-bar';

export enum BOTTOM_NAVIGATION_BAR_ELEMENTS {
  HOME,
  FAVORITES,
  UPLOAD,
  INBOX,
  YOU,
}

export const BOTTOM_NAVIGATION_BAR_ELEMENTS_COLLECTION: Record<BOTTOM_NAVIGATION_BAR_ELEMENTS, BottomNavigationBarElement> = {
  [BOTTOM_NAVIGATION_BAR_ELEMENTS.HOME]: {
    text: $localize`:@@agnostic_view_nav_bar_home_label:Home`,
    alternativeText: $localize`:@@agnostic_view_nav_bar_home_label:Home`,
    icon: `${ICONS_FOLDER}/home.svg`,
    activeIcon: `${ICONS_FOLDER}/home-active.svg`,
    href: `/${PUBLIC_PATHS.SEARCH}`,
    external: false,
  },
  [BOTTOM_NAVIGATION_BAR_ELEMENTS.FAVORITES]: {
    text: $localize`:@@agnostic_view_nav_bar_favorites_label:Favorites`,
    alternativeText: $localize`:@@agnostic_view_nav_bar_favorites_label:Favorites`,
    icon: `${ICONS_FOLDER}/favorites.svg`,
    activeIcon: `${ICONS_FOLDER}/favorites-active.svg`,
    href: `/favorites`,
    external: false,
  },
  [BOTTOM_NAVIGATION_BAR_ELEMENTS.UPLOAD]: {
    text: $localize`:@@agnostic_view_nav_bar_list_label:Upload`,
    alternativeText: $localize`:@@agnostic_view_nav_bar_list_label:Upload`,
    icon: `${ICONS_FOLDER}/upload.svg`,
    activeIcon: `${ICONS_FOLDER}/upload-active.svg`,
    href: `/catalog/upload`,
    external: false,
  },
  [BOTTOM_NAVIGATION_BAR_ELEMENTS.INBOX]: {
    text: $localize`:@@agnostic_view_nav_bar_inbox_label:Inbox`,
    alternativeText: $localize`:@@agnostic_view_nav_bar_inbox_label:Inbox`,
    icon: `${ICONS_FOLDER}/inbox.svg`,
    activeIcon: `${ICONS_FOLDER}/inbox-active.svg`,
    href: `/chat`,
    external: false,
  },
  [BOTTOM_NAVIGATION_BAR_ELEMENTS.YOU]: {
    text: $localize`:@@agnostic_view_nav_bar_you_label:You`,
    alternativeText: $localize`:@@agnostic_view_nav_bar_you_label:You`,
    icon: `${ICONS_FOLDER}/you.svg`,
    activeIcon: `${ICONS_FOLDER}/you-active.svg`,
    href: `/${PRIVATE_PATHS.YOU}`,
    external: false,
  },
};
