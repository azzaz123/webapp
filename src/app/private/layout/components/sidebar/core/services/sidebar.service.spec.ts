import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DeviceService } from '@core/device/device.service';

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
});
