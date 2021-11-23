import { TestBed } from '@angular/core/testing';
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
        spyOn(deviceService, 'isTablet').and.returnValue(true);
        service = TestBed.inject(SidebarService);

        service.sidebarCollapsed$.subscribe((collapsed: boolean) => {
          expect(collapsed).toBe(true);
          done();
        });
      });
    });

    describe('and there a preference saved', () => {
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
    describe('and there is any preference saved', () => {
      it('should show the sidebar uncollapsed', (done) => {
        service = TestBed.inject(SidebarService);

        service.sidebarCollapsed$.subscribe((collapsed: boolean) => {
          expect(collapsed).toBe(false);
          done();
        });
      });
    });

    describe('and there a preference saved', () => {
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
});
