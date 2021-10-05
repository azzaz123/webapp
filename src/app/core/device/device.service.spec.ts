import { TestBed } from '@angular/core/testing';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { UuidService } from '@core/uuid/uuid.service';
import { CookieService } from 'ngx-cookie';
import { random } from 'faker';

describe('DeviceService', () => {
  let deviceService: DeviceService;
  let uuidService: UuidService;
  let cookieService: CookieService;
  let deviceDetectorService: DeviceDetectorService;
  let cookies: object;

  const MOCK_LANGUAGES = [random.locale(), random.locale()];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeviceService,
        DeviceDetectorService,
        UuidService,
        {
          provide: CookieService,
          useValue: {
            get: (name): string => {
              return cookies[name]?.value;
            },
            put: (name, value, options): void => {
              cookies[name] = {
                value,
                options,
              };
            },
          },
        },
      ],
    });

    cookies = {};
    uuidService = TestBed.inject(UuidService);
    cookieService = TestBed.inject(CookieService);
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    deviceService = TestBed.inject(DeviceService);
  });

  describe('getDeviceType', () => {
    it('should return DeviceType.MOBILE when is mobile', () => {
      spyOn(deviceDetectorService, 'isMobile').and.returnValue(true);

      const deviceType = deviceService.getDeviceType();

      expect(deviceType).toEqual(DeviceType.MOBILE);
    });

    it('should return DeviceType.TABLET when is mobile', () => {
      spyOn(deviceDetectorService, 'isMobile').and.returnValue(false);
      spyOn(deviceDetectorService, 'isTablet').and.returnValue(true);

      const deviceType = deviceService.getDeviceType();

      expect(deviceType).toEqual(DeviceType.TABLET);
    });

    it('should return DeviceType.DESKTOP when is mobile', () => {
      spyOn(deviceDetectorService, 'isMobile').and.returnValue(false);
      spyOn(deviceDetectorService, 'isTablet').and.returnValue(false);

      const deviceType = deviceService.getDeviceType();

      expect(deviceType).toEqual(DeviceType.DESKTOP);
    });
  });

  describe('getDeviceId', () => {
    describe('when no device id cookie is set', () => {
      it("should return the cookie's value", () => {
        spyOn(uuidService, 'getUUID').and.returnValue('newDeviceId');
        spyOn(cookieService, 'put');

        const deviceId = deviceService.getDeviceId();

        expect(deviceId).toEqual('newDeviceId');
        expect(cookieService.put).toHaveBeenCalledWith('device_id', 'newDeviceId', {
          domain: expect.anything(),
          path: '/',
          expires: expect.any(Date),
        });
      });
    });

    describe('when device id cookie is set', () => {
      it('should return a new value and set the cookie', () => {
        cookies = {
          device_id: {
            value: 'deviceId',
          },
        };
        spyOn(cookieService, 'put');
        spyOn(uuidService, 'getUUID');

        const deviceId = deviceService.getDeviceId();

        expect(deviceId).toEqual('deviceId');
        expect(cookieService.put).not.toHaveBeenCalled();
        expect(uuidService.getUUID).not.toHaveBeenCalled();
      });
    });

    describe('isMobile', () => {
      it('should return if is mobile or not', () => {
        const randomIsMobile: boolean = random.boolean();
        spyOn(deviceDetectorService, 'isMobile').and.returnValue(randomIsMobile);

        const isMobile: boolean = deviceService.isMobile();

        expect(isMobile).toBe(randomIsMobile);
      });
    });

    describe('isTablet', () => {
      it('should return if is tablet or not', () => {
        const randomIsTablet: boolean = random.boolean();
        spyOn(deviceDetectorService, 'isTablet').and.returnValue(randomIsTablet);

        const isTablet: boolean = deviceService.isTablet();

        expect(isTablet).toBe(randomIsTablet);
      });
    });

    describe('isDesktop', () => {
      it('should return if is desktop or not', () => {
        const randomIsDesktop: boolean = random.boolean();
        spyOn(deviceDetectorService, 'isDesktop').and.returnValue(randomIsDesktop);

        const isDesktop: boolean = deviceService.isDesktop();

        expect(isDesktop).toBe(randomIsDesktop);
      });
    });

    describe('when asking for browser languages', () => {
      const originalLanguages = [...navigator.languages];

      beforeEach(() => {
        Object.defineProperty(navigator, 'languages', {
          value: MOCK_LANGUAGES,
          writable: true,
        });
      });

      afterAll(() => {
        Object.defineProperty(navigator, 'languages', {
          value: originalLanguages,
          writable: true,
        });
      });

      it('should get browser languages', () => {
        const languages = deviceService.getDeviceLanguages();

        expect(languages).toBe(MOCK_LANGUAGES);
      });
    });
  });
});
