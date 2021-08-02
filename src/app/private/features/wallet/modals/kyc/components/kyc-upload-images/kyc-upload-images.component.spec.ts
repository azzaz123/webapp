import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_MEDIA_STREAM } from '@fixtures/media-stream.fixtures.spec';
import { MOCK_DEVICE_PERMISSIONS } from '@fixtures/user-device-permissions.fixtures.spec';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { BannerComponent } from '@shared/banner/banner.component';
import { ButtonComponent } from '@shared/button/button.component';
import { AskPermissionsService } from '@shared/services/ask-permissions/ask-permissions.service';
import { DEVICE_PERMISSIONS_STATUS, UserDevicePermissions } from '@shared/services/ask-permissions/user-device-permissions.interface';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { BehaviorSubject, throwError } from 'rxjs';
import { KYC_TAKE_IMAGE_OPTIONS } from '../kyc-image-options/kyc-image-options.enum';
import { KYCUploadImagesComponent } from './kyc-upload-images.component';

describe('KYCUploadImagesComponent', () => {
  let component: KYCUploadImagesComponent;
  let fixture: ComponentFixture<KYCUploadImagesComponent>;
  let de: DebugElement;
  let askPermissionsService: AskPermissionsService;

  const devicePermissionsSubjectMock: BehaviorSubject<UserDevicePermissions> = new BehaviorSubject<UserDevicePermissions>(
    MOCK_DEVICE_PERMISSIONS
  );
  const cameraResponseSubjectMock: BehaviorSubject<any> = new BehaviorSubject<any>(MOCK_MEDIA_STREAM);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgbAlertModule],
      declarations: [KYCUploadImagesComponent, BannerComponent, SvgIconComponent, ButtonComponent],
      providers: [
        {
          provide: AskPermissionsService,
          useValue: {
            get userDevicePermissions$() {
              return devicePermissionsSubjectMock.asObservable();
            },
            askCameraPermissions() {
              return cameraResponseSubjectMock.asObservable();
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCUploadImagesComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    askPermissionsService = TestBed.inject(AskPermissionsService);
    component.images = {
      frontSide: null,
      backSide: null,
    };
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
          cameraResponseSubjectMock.next(MOCK_MEDIA_STREAM);
          devicePermissionsSubjectMock.next({ ...MOCK_DEVICE_PERMISSIONS, video: DEVICE_PERMISSIONS_STATUS.ACCEPTED });

          fixture.detectChanges();
        });

        it('should set the user permissions as accepted', () => {
          let cameraPermissions: DEVICE_PERMISSIONS_STATUS;

          component.userDevicePermissions$.subscribe((permissions: UserDevicePermissions) => {
            cameraPermissions = permissions.video;
          });

          expect(cameraPermissions).toBe(DEVICE_PERMISSIONS_STATUS.ACCEPTED);
        });

        it('should define the webcam video stream', () => {
          expect(component.userCamera.nativeElement.srcObject).toStrictEqual(MOCK_MEDIA_STREAM);
        });

        it('should show the video on the template', () => {
          const usersCamera = de.query(By.css('video'));
          expect(usersCamera).toBeTruthy();
        });

        it('should show the take image button ', () => {
          const shootImageButton = de.query(By.css('#shootImageButton'));
          expect(shootImageButton).toBeTruthy();
        });

        it('should NOT show an error banner', () => {
          const banner = de.query(By.directive(BannerComponent));
          expect(banner).toBeFalsy();
        });
      });

      describe('and the user denied the permission', () => {
        beforeEach(() => {
          cameraResponseSubjectMock.next(throwError('denied'));
          devicePermissionsSubjectMock.next({ ...MOCK_DEVICE_PERMISSIONS, video: DEVICE_PERMISSIONS_STATUS.DENIED });

          fixture.detectChanges();
        });

        it('should set the user permissions as denied', () => {
          let cameraPermissions: DEVICE_PERMISSIONS_STATUS;

          component.userDevicePermissions$.subscribe((permissions: UserDevicePermissions) => {
            cameraPermissions = permissions.video;
          });

          expect(cameraPermissions).toBe(DEVICE_PERMISSIONS_STATUS.DENIED);
        });

        it('should show an error banner', () => {
          const banner = de.query(By.directive(BannerComponent));
          expect(banner).toBeTruthy();
        });
      });

      describe('and a problem other than permit rejection occurs', () => {
        beforeEach(() => {
          cameraResponseSubjectMock.next(throwError('Generic Error'));
          devicePermissionsSubjectMock.next({ ...MOCK_DEVICE_PERMISSIONS, video: DEVICE_PERMISSIONS_STATUS.CANNOT_ACCESS });

          fixture.detectChanges();
        });

        it('should set the user permissions as cannot access', () => {
          let cameraPermissions: DEVICE_PERMISSIONS_STATUS;

          component.userDevicePermissions$.subscribe((permissions: UserDevicePermissions) => {
            cameraPermissions = permissions.video;
          });

          expect(cameraPermissions).toBe(DEVICE_PERMISSIONS_STATUS.CANNOT_ACCESS);
        });

        it('should show an error banner', () => {
          const banner = de.query(By.directive(BannerComponent));
          expect(banner).toBeTruthy();
        });
      });
    });

    describe(`and the user's browser DON'T supports the API`, () => {
      beforeEach(() => {
        cameraResponseSubjectMock.next(throwError('Not Allowed'));
        devicePermissionsSubjectMock.next({ ...MOCK_DEVICE_PERMISSIONS, video: DEVICE_PERMISSIONS_STATUS.CANNOT_ACCESS });

        fixture.detectChanges();
      });

      it('should set the user permissions as cannot access', () => {
        let cameraPermissions: DEVICE_PERMISSIONS_STATUS;

        component.userDevicePermissions$.subscribe((permissions: UserDevicePermissions) => {
          cameraPermissions = permissions.video;
        });

        expect(cameraPermissions).toBe(DEVICE_PERMISSIONS_STATUS.CANNOT_ACCESS);
      });

      it('should show an error banner', () => {
        const banner = de.query(By.directive(BannerComponent));
        expect(banner).toBeTruthy();
      });
    });
  });

  describe('when the user selects the upload image method', () => {
    beforeEach(() => {
      spyOn(askPermissionsService, 'askCameraPermissions');
      component.takeImageMethod = KYC_TAKE_IMAGE_OPTIONS.UPLOAD;

      fixture.detectChanges();
    });

    it('should not request camera access', () => {
      expect(askPermissionsService.askCameraPermissions).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    describe('and the user camera is active', () => {
      beforeEach(() => {
        component.takeImageMethod = KYC_TAKE_IMAGE_OPTIONS.SHOOT;
        cameraResponseSubjectMock.next(MOCK_MEDIA_STREAM);
        devicePermissionsSubjectMock.next({ ...MOCK_DEVICE_PERMISSIONS, video: DEVICE_PERMISSIONS_STATUS.ACCEPTED });

        fixture.detectChanges();
      });

      it('should turn off the camera', () => {
        component.ngOnDestroy();

        expect(component.userCamera.nativeElement.srcObject).toBeNull();
      });
    });
  });
});
