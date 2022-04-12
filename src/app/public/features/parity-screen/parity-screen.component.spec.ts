import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DeviceService } from '@core/device/device.service';
import { PublicFooterService } from '@public/core/services/footer/public-footer.service';
import { ParityScreenComponent } from './parity-screen.component';
import { DeviceType } from '@core/device/deviceType.enum';
import { By } from '@angular/platform-browser';
import { QrCodeStubComponent } from '@fixtures/shared/components/qr-code.component.stub';

describe('Parity Screen', () => {
  let component: ParityScreenComponent;
  let fixture: ComponentFixture<ParityScreenComponent>;

  let publicFooterServiceMock;
  let deviceServiceMock;
  let qrIconInjectorServiceMock;

  beforeEach(
    waitForAsync(() => {
      qrIconInjectorServiceMock = {
        injectLogo: jest.fn(),
      };

      deviceServiceMock = {
        isMobile: () => true,
        isTablet: () => false,
        isDesktop: () => false,
        getDeviceType: () => DeviceType.MOBILE,
      };

      publicFooterServiceMock = {
        setShow: jest.fn(),
      };

      TestBed.configureTestingModule({
        declarations: [ParityScreenComponent, QrCodeStubComponent],
        providers: [
          {
            provide: PublicFooterService,
            useValue: publicFooterServiceMock,
          },
          {
            provide: DeviceService,
            useValue: deviceServiceMock,
          },
        ],
      }).compileComponents();
    })
  );

  describe('when it is desktop', () => {
    beforeEach(async () => {
      deviceServiceMock = {
        isMobile: () => false,
        isTablet: () => false,
        isDesktop: () => true,
        getDeviceType: () => DeviceType.DESKTOP,
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

    it('should inject the logo', () => {
      const logo = fixture.debugElement.query(By.css('.GenericLanding__qrCode .logo'));

      expect(logo).toBeDefined();
    });

    it('should show the QR', () => {
      const qrCode = fixture.debugElement.query(By.css('.GenericLanding__qrCode'));

      expect(qrCode).toBeDefined();
    });

    it('should not show the download app button', () => {
      const button = fixture.debugElement.query(By.css('.GenericLanding__appButton'));

      expect(button).toBeNull();
    });
  });

  describe('when it is mobile', () => {
    beforeEach(async () => {
      deviceServiceMock = {
        isMobile: () => true,
        isTablet: () => false,
        isDesktop: () => false,
        getDeviceType: () => DeviceType.MOBILE,
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

    it('should not inject the logo', () => {
      const logo = fixture.debugElement.query(By.css('.GenericLanding__qrCode .logo'));

      expect(logo).toBeNull();
    });

    it('should show the download app button', () => {
      const button = fixture.debugElement.query(By.css('.GenericLanding__appButton'));

      expect(button).toBeDefined();
    });

    it('should not show the QR', () => {
      const qrCode = fixture.debugElement.query(By.css('.GenericLanding__qrCode'));

      expect(qrCode).toBeNull();
    });
  });
});
