import { TestBed } from '@angular/core/testing';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';

describe('DeviceService', () => {
  let deviceService: DeviceService;
  let deviceDetectorService: DeviceDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceService, DeviceDetectorService],
    });

    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    deviceService = TestBed.inject(DeviceService);
  });

  describe('getDeviceType', () => {
    it('should return DeviceType.MOBILE when is mobile', () => {
      spyOn(deviceDetectorService, 'isMobile').and.returnValue(true);

      let deviceType = deviceService.getDeviceType();

      expect(deviceType).toEqual(DeviceType.MOBILE);
    });

    it('should return DeviceType.TABLET when is mobile', () => {
      spyOn(deviceDetectorService, 'isMobile').and.returnValue(false);
      spyOn(deviceDetectorService, 'isTablet').and.returnValue(true);

      let deviceType = deviceService.getDeviceType();

      expect(deviceType).toEqual(DeviceType.TABLET);
    });

    it('should return DeviceType.DESKTOP when is mobile', () => {
      spyOn(deviceDetectorService, 'isMobile').and.returnValue(false);
      spyOn(deviceDetectorService, 'isTablet').and.returnValue(false);

      let deviceType = deviceService.getDeviceType();

      expect(deviceType).toEqual(DeviceType.DESKTOP);
    });
  });
});
