import { TestBed } from '@angular/core/testing';
import { UserService } from '@core/user/user.service';
import { MOCK_DRAWER_NAVIGATION_SECTIONS } from '@fixtures/layout/drawer-navigation/fixtures/drawer-navigation-sections.fixtures.spec';
import { MOCK_USER, MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { PROFILE_PATHS } from '@private/features/profile/profile-routing-constants';
import { YOU_PATHS } from '@private/features/you/constants/you-routing.constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { of } from 'rxjs';
import { DrawerNavigationElement, DRAWER_NAVIGATION_SECTIONS } from '../interfaces/drawer-navigation-element.interface';
import { DrawerNavigationSectionsService } from './drawer-navigation-sections/drawer-navigation-sections.service';

import { DrawerNavigationService } from './drawer-navigation.service';

describe('DrawerNavigationService', () => {
  let service: DrawerNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DrawerNavigationService,
        {
          provide: DrawerNavigationSectionsService,
          useValue: {
            navigationSections$: of(MOCK_DRAWER_NAVIGATION_SECTIONS),
          },
        },
        {
          provide: UserService,
          useValue: {
            user$: of(MOCK_USER),
            getStats: () => of(MOCK_USER_STATS),
          },
        },
      ],
    });
    service = TestBed.inject(DrawerNavigationService);
  });

  describe('navigationSections$', () => {
    it('should return all the navigation sections', (done) => {
      const expectedSections = MOCK_DRAWER_NAVIGATION_SECTIONS;

      service.navigationSections$.subscribe((sections) => {
        expect(sections).toEqual(expectedSections);
        done();
      });
    });
  });

  describe('profileNavigationElement$', () => {
    it('should return the information needed for displaying the profile element', (done) => {
      service.profileNavigationElement$.subscribe((profileElement) => {
        expect(profileElement).toEqual({
          professional: MOCK_USER.featured,
          text: MOCK_USER.microName,
          alternativeText: MOCK_USER.microName,
          reviews: MOCK_USER_STATS.ratings.reviews,
          reviews_count: MOCK_USER_STATS.counters.reviews,
          avatar: MOCK_USER.image.urls_by_size.medium,
          href: `/${PRIVATE_PATHS.PROFILE}/${PROFILE_PATHS.INFO}`,
          external: false,
        });
        done();
      });
    });
  });

  describe('getChildNavigationElements', () => {
    it('should return the child navigation elements that belongs to a route', (done) => {
      const expectedElements = MOCK_DRAWER_NAVIGATION_SECTIONS[DRAWER_NAVIGATION_SECTIONS.ACCOUNT].elements[1].children;

      service.getChildNavigationElements(YOU_PATHS.SETTINGS).subscribe((elements: DrawerNavigationElement[]) => {
        expect(elements).toEqual(expectedElements);
        done();
      });
    });
  });

  describe('getChildNavigationTitle', () => {
    it('should return the title that belongs to a child route', (done) => {
      const expectedTitle = MOCK_DRAWER_NAVIGATION_SECTIONS[DRAWER_NAVIGATION_SECTIONS.ACCOUNT].elements[1].text;

      service.getChildNavigationTitle(YOU_PATHS.SETTINGS).subscribe((title: string) => {
        expect(title).toEqual(expectedTitle);
        done();
      });
    });
  });
});
