import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { BottomNavigationBarElement } from '../interfaces/bottom-navigation-bar-element.interface';

const ICONS_FOLDER = '/assets/icons/bottom-navigation-bar';

export const BOTTOM_NAVIGATION_BAR_ELMENTS: BottomNavigationBarElement[] = [
  {
    text: $localize`:@@web_components_tabbar_3:Home`,
    alternativeText: $localize`:@@web_components_tabbar_3:Home`,
    icon: `${ICONS_FOLDER}/home.svg`,
    activeIcon: `${ICONS_FOLDER}/home-active.svg`,
    href: `/${PUBLIC_PATHS.SEARCH}`,
    external: false,
  },
  {
    text: $localize`:@@web_components_tabbar_4:Favorites`,
    alternativeText: $localize`:@@web_components_tabbar_4:Favorites`,
    icon: `${ICONS_FOLDER}/favorites.svg`,
    activeIcon: `${ICONS_FOLDER}/favorites-active.svg`,
    href: `/favorites`,
    external: false,
  },
  {
    text: $localize`:@@web_components_tabbar_5:Upload`,
    alternativeText: $localize`:@@web_components_tabbar_5:Upload`,
    icon: `${ICONS_FOLDER}/upload.svg`,
    activeIcon: `${ICONS_FOLDER}/upload-active.svg`,
    href: `/catalog/upload`,
    external: false,
  },
  {
    text: $localize`:@@web_components_tabbar_6:Messages`,
    alternativeText: $localize`:@@web_components_tabbar_6:Messages`,
    icon: `${ICONS_FOLDER}/inbox.svg`,
    activeIcon: `${ICONS_FOLDER}/inbox-active.svg`,
    href: `/chat`,
    external: false,
  },
  {
    text: 'You',
    alternativeText: 'You',
    icon: `${ICONS_FOLDER}/you.svg`,
    activeIcon: `${ICONS_FOLDER}/you-active.svg`,
    href: `/you`,
    external: false,
  },
];
