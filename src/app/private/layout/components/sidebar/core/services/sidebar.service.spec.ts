import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DeviceService } from '@core/device/device.service';
import { UserService } from '@core/user/user.service';
import { MOCK_USER, MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { PROFILE_PATHS } from '@private/features/profile/profile-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { of } from 'rxjs';
import { SIDEBAR_NAVIGATION_ELEMENTS } from '../../interfaces/sidebar-navigation-element.interface';

import { SidebarService } from './sidebar.service';

describe('SidebarService', () => {
  let service: SidebarService;
  let deviceService: DeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SidebarService,
        {
          provide: DeviceService,
          useValue: {
            isTablet: () => false,
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
    deviceService = TestBed.inject(DeviceService);
  });

  describe('when there is no saved preference', () => {
    it('should show the sidebar uncollapsed', (done) => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      service = TestBed.inject(SidebarService);

      service.sidebarCollapsed$.subscribe((collapsed: boolean) => {
        expect(collapsed).toBe(false);
        done();
      });
    });
  });

  describe('when the device is of type tablet', () => {
    describe('and there is no saved preference', () => {
      it('should show the sidebar collapsed', (done) => {
        spyOn(localStorage, 'getItem').and.returnValue(null);
        spyOn(deviceService, 'isTablet').and.returnValue(true);
        service = TestBed.inject(SidebarService);

        service.sidebarCollapsed$.subscribe((collapsed: boolean) => {
          expect(collapsed).toBe(true);
          done();
        });
      });
    });

    describe('and there is a preference saved', () => {
      it('should change the collapsed state depending on the saved preference', (done) => {
        spyOn(deviceService, 'isTablet').and.returnValue(true);
        spyOn(localStorage, 'getItem').and.returnValue('false');
        service = TestBed.inject(SidebarService);

        service.sidebarCollapsed$.subscribe((collapsed: boolean) => {
          expect(collapsed).toBe(false);
          done();
        });
      });
    });
  });

  describe('when the device is not a tablet', () => {
    describe('and there is no preference saved', () => {
      it('should show the sidebar uncollapsed', (done) => {
        spyOn(localStorage, 'getItem').and.returnValue(null);
        service = TestBed.inject(SidebarService);

        service.sidebarCollapsed$.subscribe((collapsed: boolean) => {
          expect(collapsed).toBe(false);
          done();
        });
      });
    });

    describe('and there is a preference saved', () => {
      it('should change the collapsed state depending on the saved preference', (done) => {
        spyOn(deviceService, 'isTablet').and.returnValue(true);
        spyOn(localStorage, 'getItem').and.returnValue('true');
        service = TestBed.inject(SidebarService);

        service.sidebarCollapsed$.subscribe((collapsed: boolean) => {
          expect(collapsed).toBe(true);
          done();
        });
      });
    });
  });

  describe('when the saved preference is not a valid value', () => {
    it('should show the sidebar collapsed', (done) => {
      spyOn(localStorage, 'getItem').and.returnValue('invalid value');
      service = TestBed.inject(SidebarService);

      service.sidebarCollapsed$.subscribe((collapsed: boolean) => {
        expect(collapsed).toBe(false);
        done();
      });
    });
  });

  describe('when clicking the collapse sidebar button', () => {
    describe('if the sidebar is collapsed', () => {
      it('should uncollapse the sidebar', fakeAsync(() => {
        service = TestBed.inject(SidebarService);

        tick();
        service.toggleCollapse();
        service.toggleCollapse();

        service.sidebarCollapsed$.subscribe((collapsed: boolean) => {
          expect(collapsed).toBe(false);
        });
      }));
    });
    describe('if the sidebar is uncollapsed', () => {
      it('should collapse the sidebar', fakeAsync(() => {
        service = TestBed.inject(SidebarService);

        tick();
        service.toggleCollapse();

        service.sidebarCollapsed$.subscribe((collapsed: boolean) => {
          expect(collapsed).toBe(true);
        });
      }));
    });
  });

  describe('profileNavigationElement$', () => {
    it('should return the information needed for displaying the profile element', (done) => {
      service.profileNavigationElement$.subscribe((profileElement) => {
        expect(profileElement).toEqual({
          id: SIDEBAR_NAVIGATION_ELEMENTS.PROFILE,
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
});
