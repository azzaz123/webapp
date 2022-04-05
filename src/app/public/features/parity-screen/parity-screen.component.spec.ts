import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { DeviceService } from '@core/device/device.service';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { PublicFooterService } from '@public/core/services/footer/public-footer.service';
import { QRCodeModule } from 'angularx-qrcode';
import { ParityScreenComponent } from './parity-screen.component';
import { DeviceType } from '@core/device/deviceType.enum';
import { ADJUST_IOS_URL, ADJUST_ANDROID_URL } from '@core/constants';

describe('Parity Screen', () => {
  let component: ParityScreenComponent;
  let fixture: ComponentFixture<ParityScreenComponent>;

  let publicFooterServiceMock;
  let deviceServiceMock;
  let mutationObserverMock;
  let windowMock;

  beforeEach(
    waitForAsync(() => {
      windowMock = {
        MutationObserver: mutationObserverMock,
      };

      mutationObserverMock = jest.fn(function MutationObserver(callback) {
        this.observe = jest.fn();
        this.trigger = (mockedMutationList) => {
          callback(mockedMutationList, this);
        };
      });

      global.MutationObserver = mutationObserverMock;

      deviceServiceMock = {
        isMobile: () => true,
        isTablet: () => false,
        isDesktop: () => false,
        getOSName: () => 'iOS',
        getDeviceType: () => DeviceType.MOBILE,
      };

      publicFooterServiceMock = {
        setShow: jest.fn(),
      };

      TestBed.configureTestingModule({
        imports: [QRCodeModule],
        declarations: [ParityScreenComponent],
        providers: [
          {
            provide: PublicFooterService,
            useValue: publicFooterServiceMock,
          },
          {
            provide: DeviceService,
            useValue: deviceServiceMock,
          },
          {
            provide: WINDOW_TOKEN,
            useValue: windowMock,
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  afterEach(() => {
    mutationObserverMock.mockClear();
  });

  describe('when it is desktop', () => {
    beforeEach(async () => {
      deviceServiceMock = {
        isMobile: () => false,
        isTablet: () => false,
        isDesktop: () => true,
        getDeviceType: () => DeviceType.DESKTOP,
        getOSName: () => {},
      };

      await TestBed.configureTestingModule({
        providers: [
          {
            provide: DeviceService,
            useValue: deviceServiceMock,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ParityScreenComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should hide the footer', () => {
      expect(publicFooterServiceMock.setShow).toHaveBeenCalledWith(false);
    });

    it('should start mutation observer after view init when it exists', () => {
      const [observerInstance] = mutationObserverMock.mock.instances;

      component.ngAfterViewInit();
      fixture.detectChanges();

      expect(observerInstance).toBeDefined();
      expect(observerInstance.observe).toHaveBeenCalled();
    });

    it('should not start mutation observer after view init when it does not exist', () => {
      mutationObserverMock.mockClear();
      windowMock.MutationObserver = null;

      component.ngAfterViewInit();
      const [observerInstance] = mutationObserverMock.mock.instances;

      expect(observerInstance).not.toBeDefined();
    });
  });

  describe('when it is mobile', () => {
    beforeEach(async () => {
      deviceServiceMock = {
        isMobile: () => true,
        isTablet: () => false,
        isDesktop: () => false,
        getDeviceType: () => DeviceType.MOBILE,
        getOSName: () => {},
      };

      await TestBed.configureTestingModule({
        providers: [
          {
            provide: DeviceService,
            useValue: deviceServiceMock,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ParityScreenComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should hide the footer', () => {
      expect(publicFooterServiceMock.setShow).toHaveBeenCalledWith(false);
    });

    it('should not start mutation observer after view init', () => {
      const [observerInstance] = mutationObserverMock.mock.instances;

      component.ngAfterViewInit();
      fixture.detectChanges();

      expect(observerInstance).not.toBeDefined();
    });
  });
});
