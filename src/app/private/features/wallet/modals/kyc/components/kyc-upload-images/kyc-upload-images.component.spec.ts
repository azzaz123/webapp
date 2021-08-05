import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_MEDIA_STREAM } from '@fixtures/media-stream.fixtures.spec';
import {
  MOCK_EMPTY_KYC_IMAGES,
  MOCK_KYC_IMAGES,
  MOCK_KYC_IMAGES_BACK_DEFINED,
  MOCK_KYC_IMAGES_FRONT_DEFINED,
} from '@fixtures/private/wallet/kyc/kyc.fixtures.spec';
import { MOCK_DEVICE_PERMISSIONS } from '@fixtures/user-device-permissions.fixtures.spec';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { KYCImagesNeeded } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
import { KYCImages } from '@private/features/wallet/interfaces/kyc/kyc-images.interface';
import { BannerComponent } from '@shared/banner/banner.component';
import { ButtonComponent } from '@shared/button/button.component';
import { AskPermissionsService } from '@shared/services/ask-permissions/ask-permissions.service';
import { DEVICE_PERMISSIONS_STATUS, UserDevicePermissions } from '@shared/services/ask-permissions/user-device-permissions.interface';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { BehaviorSubject, throwError } from 'rxjs';
import { KYC_TAKE_IMAGE_OPTIONS } from '../kyc-image-options/kyc-image-options.enum';
import { KYCUploadImagesComponent } from './kyc-upload-images.component';

@Component({
  selector: 'tsl-test-wrapper',
  template: `
    <tsl-kyc-upload-images [imagesNeeded]="imagesNeeded" [takeImageMethod]="takeImageMethod" [images]="images"></tsl-kyc-upload-images>
  `,
})
class TestWrapperComponent {
  @Input() imagesNeeded: KYCImagesNeeded;
  @Input() takeImageMethod: KYC_TAKE_IMAGE_OPTIONS;
  @Input() images: KYCImages;
}

describe('KYCUploadImagesComponent', () => {
  let component: KYCUploadImagesComponent;
  let testComponent: TestWrapperComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;
  let de: DebugElement;
  let askPermissionsService: AskPermissionsService;

  const devicePermissionsSubjectMock: BehaviorSubject<UserDevicePermissions> = new BehaviorSubject<UserDevicePermissions>(
    MOCK_DEVICE_PERMISSIONS
  );
  const cameraResponseSubjectMock: BehaviorSubject<any> = new BehaviorSubject<any>(MOCK_MEDIA_STREAM);

  const takeFrontSideImageSelector = '#takeFrontSideImage';
  const takeBackSideImageSelector = '#takeBackSideImage';
  const endVerificationButtonSelector = '#endVerificationButton';
  const imagesCounterButtonSelector = '#imagesCounterButton';
  const frontSideImageSelector = '#frontSideImage';
  const deleteFrontSideImageSelector = '#deleteFrontSideImage';
  const backSideImageSelector = '#backSideImage';
  const deleteBackSideImageSelector = '#deleteBackSideImage';
  const backButtonSelector = '.KYCUploadImages__back';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgbAlertModule],
      declarations: [TestWrapperComponent, KYCUploadImagesComponent, BannerComponent, SvgIconComponent, ButtonComponent],
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
    fixture = TestBed.createComponent(TestWrapperComponent);
    askPermissionsService = TestBed.inject(AskPermissionsService);
    de = fixture.debugElement;
    component = de.query(By.directive(KYCUploadImagesComponent)).componentInstance;
    testComponent = fixture.componentInstance;
    testComponent.images = MOCK_EMPTY_KYC_IMAGES;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user selects the shoot image method', () => {
    beforeEach(() => {
      testComponent.takeImageMethod = KYC_TAKE_IMAGE_OPTIONS.SHOOT;
    });

    describe(`and the user's browser supports the API`, () => {
      describe('and the user accept the permission', () => {
        beforeEach(() => {
          spyOn(component.imagesChange, 'emit');
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
          const imagesCounterButton = de.query(By.css(imagesCounterButtonSelector));
          expect(imagesCounterButton).toBeTruthy();
        });

        it('should NOT show an error banner', () => {
          const banner = de.query(By.directive(BannerComponent));
          expect(banner).toBeFalsy();
        });

        describe('and the user must provide two images of the document', () => {
          beforeEach(() => {
            testComponent.imagesNeeded = 2;
          });

          describe('and the images are not shoot', () => {
            beforeEach(() => {
              testComponent.images = MOCK_EMPTY_KYC_IMAGES;

              fixture.detectChanges();
            });

            it('should show the front side take photo message', () => {
              const takeFrontSideImage = de.query(By.css(takeFrontSideImageSelector));
              expect(takeFrontSideImage).toBeTruthy();
            });

            it('should NOT show the front side image', () => {
              const frontSideImageStyles = de.query(By.css(frontSideImageSelector)).classes;

              expect(frontSideImageStyles).toHaveProperty('d-none', true);
            });

            it('should show the back side take photo message', () => {
              const takeBackSideImage = de.query(By.css(takeBackSideImageSelector));
              expect(takeBackSideImage).toBeTruthy();
            });

            it('should NOT show the back side image', () => {
              const backSideImageStyles = de.query(By.css(backSideImageSelector)).classes;

              expect(backSideImageStyles).toHaveProperty('d-none', true);
            });

            it('should NOT show the end verification button', () => {
              const endVerificationButton = de.query(By.css(endVerificationButtonSelector));
              expect(endVerificationButton).toBeFalsy();
            });

            it('should show the defined images counter as 0', () => {
              const imagesCounterButton = de.query(By.css(imagesCounterButtonSelector)).nativeElement;
              expect(imagesCounterButton.textContent).toBe(`${component.actionButtonCopy} (0/2)`);
            });

            describe('and they shoot an image', () => {
              beforeEach(() => {
                spyOn(component.frontSideImage.nativeElement.getContext('2d'), 'drawImage');
                spyOn(component.frontSideImage.nativeElement, 'toDataURL').and.returnValue('NEW_IMAGE_SHOOT');

                de.query(By.css(imagesCounterButtonSelector)).nativeElement.click();
              });

              it('should draw the front side image on the screen', () => {
                expect(component.frontSideImage.nativeElement.getContext('2d').drawImage).toHaveBeenCalled();
              });

              it('should emit the new front side image', () => {
                expect(component.imagesChange.emit).toHaveBeenCalledWith({
                  ...component.images,
                  frontSide: 'NEW_IMAGE_SHOOT',
                });
              });
            });
          });

          describe('and ONLY the front side image is already shoot', () => {
            beforeEach(() => {
              testComponent.images = MOCK_KYC_IMAGES_FRONT_DEFINED;

              fixture.detectChanges();
            });

            it('should show the front side image', () => {
              const frontSideImage = de.query(By.css(frontSideImageSelector));

              expect(frontSideImage).toBeTruthy();
              expect(frontSideImage.classes).not.toHaveProperty('d-none', true);
            });

            it('should NOT show the front side take photo message', () => {
              const takeFrontSideImage = de.query(By.css(takeFrontSideImageSelector));

              expect(takeFrontSideImage).toBeFalsy();
            });

            it('should NOT show the back side image', () => {
              const backSideImageStyles = de.query(By.css(backSideImageSelector)).classes;

              expect(backSideImageStyles).toHaveProperty('d-none', true);
            });

            it('should show the back side take photo message', () => {
              const takeBackSideImage = de.query(By.css(takeBackSideImageSelector));

              expect(takeBackSideImage).toBeTruthy();
            });

            it('should NOT show the end verification button', () => {
              const endVerificationButton = de.query(By.css(endVerificationButtonSelector));

              expect(endVerificationButton).toBeFalsy();
            });

            it('should show the defined images counter as 1', () => {
              const imagesCounterButton = de.query(By.css(imagesCounterButtonSelector)).nativeElement;

              expect(imagesCounterButton.textContent).toBe(`${component.actionButtonCopy} (1/2)`);
            });

            describe('and they shoot an image', () => {
              beforeEach(() => {
                spyOn(component.backSideImage.nativeElement.getContext('2d'), 'drawImage');
                spyOn(component.backSideImage.nativeElement, 'toDataURL').and.returnValue('NEW_BACK_IMAGE_SHOOT');

                de.query(By.css(imagesCounterButtonSelector)).nativeElement.click();
              });

              it('should draw the back side image on the screen', () => {
                expect(component.backSideImage.nativeElement.getContext('2d').drawImage).toHaveBeenCalled();
              });

              it('should emit the new back side image', () => {
                expect(component.imagesChange.emit).toHaveBeenCalledWith({
                  ...component.images,
                  backSide: 'NEW_BACK_IMAGE_SHOOT',
                });
              });
            });

            describe('and they delete the front side image', () => {
              beforeEach(() => {
                de.query(By.css(deleteFrontSideImageSelector)).nativeElement.click();
              });

              it('should emit the empty front side image', () => {
                expect(component.imagesChange.emit).toHaveBeenCalledWith({
                  ...component.images,
                  frontSide: null,
                });
              });
            });
          });

          describe('and ONLY the back side image is already shoot', () => {
            beforeEach(() => {
              testComponent.images = MOCK_KYC_IMAGES_BACK_DEFINED;

              fixture.detectChanges();
            });

            it('should show the back side image', () => {
              const backSideImage = de.query(By.css(backSideImageSelector));

              expect(backSideImage).toBeTruthy();
              expect(backSideImage.classes).not.toHaveProperty('d-none', true);
            });

            it('should NOT show the back side take photo message', () => {
              const takeBackSideImage = de.query(By.css(takeBackSideImageSelector));

              expect(takeBackSideImage).toBeFalsy();
            });

            it('should NOT show the front side image', () => {
              const frontSideImageStyles = de.query(By.css(frontSideImageSelector)).classes;

              expect(frontSideImageStyles).toHaveProperty('d-none', true);
            });

            it('should show the front side take photo message', () => {
              const takeFrontSideImage = de.query(By.css(takeFrontSideImageSelector));

              expect(takeFrontSideImage).toBeTruthy();
            });

            it('should NOT show the end verification button', () => {
              const endVerificationButton = de.query(By.css(endVerificationButtonSelector));

              expect(endVerificationButton).toBeFalsy();
            });

            it('should show the defined images counter as 1', () => {
              const imagesCounterButton = de.query(By.css(imagesCounterButtonSelector)).nativeElement;

              expect(imagesCounterButton.textContent).toBe(`${component.actionButtonCopy} (1/2)`);
            });

            describe('and they shoot an image', () => {
              beforeEach(() => {
                spyOn(component.frontSideImage.nativeElement.getContext('2d'), 'drawImage');
                spyOn(component.frontSideImage.nativeElement, 'toDataURL').and.returnValue('NEW_FRONT_IMAGE_SHOOT');

                de.query(By.css(imagesCounterButtonSelector)).nativeElement.click();
              });

              it('should draw the front side image on the screen', () => {
                expect(component.frontSideImage.nativeElement.getContext('2d').drawImage).toHaveBeenCalled();
              });

              it('should emit the new front side image', () => {
                expect(component.imagesChange.emit).toHaveBeenCalledWith({
                  ...component.images,
                  frontSide: 'NEW_FRONT_IMAGE_SHOOT',
                });
              });
            });

            describe('and they delete the back side image', () => {
              beforeEach(() => {
                de.query(By.css(deleteBackSideImageSelector)).nativeElement.click();
              });

              it('should emit the empty back side image', () => {
                expect(component.imagesChange.emit).toHaveBeenCalledWith({
                  ...component.images,
                  backSide: null,
                });
              });
            });
          });

          describe('and the two images are already shoot', () => {
            beforeEach(() => {
              testComponent.images = MOCK_KYC_IMAGES;

              fixture.detectChanges();
            });

            it('should NOT show the counter images button', () => {
              const imagesCounterButton = de.query(By.css(imagesCounterButtonSelector));
              expect(imagesCounterButton).toBeFalsy();
            });

            it('should show the end verification button', () => {
              const endVerificationButton = de.query(By.css(endVerificationButtonSelector));
              expect(endVerificationButton).toBeTruthy();
            });

            describe('and they delete the front side image', () => {
              beforeEach(() => {
                de.query(By.css(deleteFrontSideImageSelector)).nativeElement.click();
              });

              it('should emit the empty front side image', () => {
                expect(component.imagesChange.emit).toHaveBeenCalledWith({
                  ...component.images,
                  frontSide: null,
                });
              });
            });

            describe('and they delete the back side image', () => {
              beforeEach(() => {
                de.query(By.css(deleteBackSideImageSelector)).nativeElement.click();
              });

              it('should emit the empty back side image', () => {
                expect(component.imagesChange.emit).toHaveBeenCalledWith({
                  ...component.images,
                  backSide: null,
                });
              });
            });
          });
        });

        describe('and the user must provide ONLY one image of the document', () => {
          beforeEach(() => {
            testComponent.imagesNeeded = 1;
          });

          describe('and the front side image is NOT shoot', () => {
            beforeEach(() => {
              testComponent.images = MOCK_EMPTY_KYC_IMAGES;

              fixture.detectChanges();
            });

            it('should show the front side take photo message', () => {
              const takeFrontSideImage = de.query(By.css(takeFrontSideImageSelector));

              expect(takeFrontSideImage).toBeTruthy();
            });

            it('should NOT show the front side image', () => {
              const frontSideImageStyles = de.query(By.css(frontSideImageSelector)).classes;

              expect(frontSideImageStyles).toHaveProperty('d-none', true);
            });

            it('should NOT render the back side image content', () => {
              const backSideImage = de.query(By.css(backSideImageSelector));
              const takeBackSideImage = de.query(By.css(takeBackSideImageSelector));

              expect(backSideImage).toBeFalsy();
              expect(takeBackSideImage).toBeFalsy();
            });

            it('should show the defined images counter as 0', () => {
              const imagesCounterButton = de.query(By.css(imagesCounterButtonSelector)).nativeElement;

              expect(imagesCounterButton.textContent).toBe(`${component.actionButtonCopy} (0/1)`);
            });

            it('should NOT show the end verification button', () => {
              const endVerificationButton = de.query(By.css(endVerificationButtonSelector));
              expect(endVerificationButton).toBeFalsy();
            });

            describe('and they shoot an image', () => {
              beforeEach(() => {
                spyOn(component.frontSideImage.nativeElement.getContext('2d'), 'drawImage');
                spyOn(component.frontSideImage.nativeElement, 'toDataURL').and.returnValue('IMAGE_SHOOT');

                de.query(By.css(imagesCounterButtonSelector)).nativeElement.click();
              });

              it('should draw the front side image on the screen', () => {
                expect(component.frontSideImage.nativeElement.getContext('2d').drawImage).toHaveBeenCalled();
              });

              it('should emit the new front side image', () => {
                expect(component.imagesChange.emit).toHaveBeenCalledWith({
                  ...component.images,
                  frontSide: 'IMAGE_SHOOT',
                });
              });
            });
          });

          describe('and the front side image is already shoot', () => {
            beforeEach(() => {
              testComponent.images = MOCK_KYC_IMAGES_FRONT_DEFINED;

              fixture.detectChanges();
            });

            it('should NOT show the front side take photo message', () => {
              const takeFrontSideImage = de.query(By.css(takeFrontSideImageSelector));

              expect(takeFrontSideImage).toBeFalsy();
            });

            it('should show the front side image', () => {
              const frontSideImage = de.query(By.css(frontSideImageSelector));

              expect(frontSideImage).toBeTruthy();
              expect(frontSideImage.classes).not.toHaveProperty('d-none', true);
            });

            it('should NOT render the back side image content', () => {
              const backSideImage = de.query(By.css(backSideImageSelector));
              const takeBackSideImage = de.query(By.css(takeBackSideImageSelector));

              expect(backSideImage).toBeFalsy();
              expect(takeBackSideImage).toBeFalsy();
            });

            it('should NOT show the counter images button', () => {
              const imagesCounterButton = de.query(By.css(imagesCounterButtonSelector));
              expect(imagesCounterButton).toBeFalsy();
            });

            it('should show the end verification button', () => {
              const endVerificationButton = de.query(By.css(endVerificationButtonSelector));
              expect(endVerificationButton).toBeTruthy();
            });

            describe('and they delete the front side image', () => {
              beforeEach(() => {
                de.query(By.css(deleteFrontSideImageSelector)).nativeElement.click();
              });

              it('should emit the empty front side image', () => {
                expect(component.imagesChange.emit).toHaveBeenCalledWith({
                  ...component.images,
                  frontSide: null,
                });
              });
            });
          });
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

    describe(`and the user's browser does NOT support the API`, () => {
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
      testComponent.takeImageMethod = KYC_TAKE_IMAGE_OPTIONS.UPLOAD;

      fixture.detectChanges();
    });

    it('should not request camera access', () => {
      expect(askPermissionsService.askCameraPermissions).not.toHaveBeenCalled();
    });
  });

  describe('when the user clicks on the back button...', () => {
    beforeEach(() => {
      spyOn(component.goBack, 'emit');
      spyOn(component.imagesChange, 'emit');
      devicePermissionsSubjectMock.next({ ...MOCK_DEVICE_PERMISSIONS, video: DEVICE_PERMISSIONS_STATUS.ACCEPTED });

      fixture.detectChanges();
      de.query(By.css(backButtonSelector)).nativeElement.click();
    });

    it('should reset the images value', () => {
      expect(component.imagesChange.emit).toHaveBeenCalledWith({
        ...component.images,
        frontSide: null,
        backSide: null,
      });
    });

    it('should go back', () => {
      expect(component.goBack.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnDestroy', () => {
    describe('and the user camera is active', () => {
      beforeEach(() => {
        testComponent.takeImageMethod = KYC_TAKE_IMAGE_OPTIONS.SHOOT;
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
