import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { BannerComponent } from '@shared/banner/banner.component';
import { ButtonComponent } from '@shared/button/button.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { KYC_UPLOAD_IMAGES_STATUS } from '../../enums/kyc-upload-images-status-enum';
import { KYC_TAKE_IMAGE_OPTIONS } from '../kyc-image-options/kyc-image-options.enum';
import { KYCUploadImagesComponent } from './kyc-upload-images.component';

describe('KYCUploadImagesComponent', () => {
  const mediaStreamConstraints = { video: true };
  const MOCK_MEDIA_STREAM = {
    getTracks: () => [],
  };

  let component: KYCUploadImagesComponent;
  let fixture: ComponentFixture<KYCUploadImagesComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgbAlertModule],
      declarations: [KYCUploadImagesComponent, BannerComponent, SvgIconComponent, ButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCUploadImagesComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user selects the shoot image method', () => {
    beforeEach(() => {
      component.takeImageMethod = KYC_TAKE_IMAGE_OPTIONS.SHOOT;
    });

    describe(`and the user's browser supports the API`, () => {
      describe('and the user accept the permission', () => {
        beforeEach(() => {
          allowCameraPermissions();
          spyOn(navigator.mediaDevices, 'getUserMedia').and.callThrough();

          fixture.detectChanges();
        });

        it('should ask the user for the camera permission', () => {
          expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith(mediaStreamConstraints);
        });

        it('should set the user permissions as accepted', () => {
          expect(component.userCameraPermissions).toBe(KYC_UPLOAD_IMAGES_STATUS.ACCEPTED);
        });

        it('should define the webcam video stream', () => {
          expect(component.userCamera.nativeElement.srcObject).toStrictEqual(MOCK_MEDIA_STREAM);
        });

        it('should show the video on the template', async () => {
          await fixture.whenStable();
          fixture.detectChanges();

          const usersCamera = de.query(By.css('video'));
          expect(usersCamera).toBeTruthy();
        });

        it('should show the take image button ', async () => {
          await fixture.whenStable();
          fixture.detectChanges();

          const shootImageButton = de.query(By.css('#shootImageButton'));
          expect(shootImageButton).toBeTruthy();
        });

        it('should NOT show an error banner', async () => {
          await fixture.whenStable();
          fixture.detectChanges();

          const banner = de.query(By.directive(BannerComponent));
          expect(banner).toBeFalsy();
        });
      });

      describe('and the user denied the permission', () => {
        beforeEach(() => {
          setCameraPermissionsError(true);
          spyOn(navigator.mediaDevices, 'getUserMedia').and.callThrough();

          fixture.detectChanges();
        });

        it('should ask the user for the camera permission', () => {
          expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith(mediaStreamConstraints);
        });

        it('should set the user permissions as denied', () => {
          expect(component.userCameraPermissions).toBe(KYC_UPLOAD_IMAGES_STATUS.DENIED);
        });

        it('should show an error banner', async () => {
          await fixture.whenStable();
          fixture.detectChanges();

          const banner = de.query(By.directive(BannerComponent));
          expect(banner).toBeTruthy();
        });
      });

      describe('and a problem other than permit rejection occurs', () => {
        beforeEach(() => {
          setCameraPermissionsError(false);
          spyOn(navigator.mediaDevices, 'getUserMedia').and.callThrough();

          fixture.detectChanges();
        });

        it('should ask the user for the camera permission', () => {
          expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith(mediaStreamConstraints);
        });

        it('should set the user permissions as cannot access', () => {
          expect(component.userCameraPermissions).toBe(KYC_UPLOAD_IMAGES_STATUS.CANNOT_ACCESS);
        });

        it('should show an error banner', async () => {
          await fixture.whenStable();
          fixture.detectChanges();

          const banner = de.query(By.directive(BannerComponent));
          expect(banner).toBeTruthy();
        });
      });
    });

    describe(`and the user's browser DON'T supports the API`, () => {
      beforeEach(() => {
        setCameraPermissionsAsNotSupported();

        fixture.detectChanges();
      });

      it('should set the user permissions as cannot access', () => {
        expect(component.userCameraPermissions).toBe(KYC_UPLOAD_IMAGES_STATUS.CANNOT_ACCESS);
      });

      it('should show an error banner', async () => {
        await fixture.whenStable();
        fixture.detectChanges();

        const banner = de.query(By.directive(BannerComponent));
        expect(banner).toBeTruthy();
      });
    });
  });

  describe('when the user selects the upload image method', () => {
    beforeEach(() => {
      component.takeImageMethod = KYC_TAKE_IMAGE_OPTIONS.UPLOAD;

      fixture.detectChanges();
    });

    it('should have user camera permissions undefined', () => {
      expect(component.userCameraPermissions).toBeUndefined();
    });
  });

  describe('ngOnDestroy', () => {
    describe('and the user camera is active', () => {
      beforeEach(() => {
        component.takeImageMethod = KYC_TAKE_IMAGE_OPTIONS.SHOOT;
        allowCameraPermissions();
        spyOn(navigator.mediaDevices, 'getUserMedia').and.callThrough();

        fixture.detectChanges();
      });

      it('should turn off the camera', () => {
        component.ngOnDestroy();

        expect(component.userCamera.nativeElement.srcObject).toBeNull();
      });
    });
  });

  function setCameraPermissionsAsNotSupported(): void {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: () => null,
    });
  }

  function setCameraPermissionsError(isPermissionDenied: boolean): void {
    const error = isPermissionDenied ? 'DOMException: Permission denied' : 'General Error';

    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: () => Promise.reject(error),
      },
    });
  }

  function allowCameraPermissions(): void {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: () => Promise.resolve(MOCK_MEDIA_STREAM),
      },
    });
  }
});
