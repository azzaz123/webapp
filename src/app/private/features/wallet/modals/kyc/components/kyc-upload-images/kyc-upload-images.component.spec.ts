import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_BASE_64_SMALL_IMAGE } from '@fixtures/base64.fixtures.spec';
import { MOCK_MEDIA_STREAM } from '@fixtures/media-stream.fixtures.spec';
import {
  MOCK_EMPTY_KYC_IMAGES,
  MOCK_KYC_IMAGES_BASE_64,
  MOCK_KYC_IMAGES_BACK_DEFINED,
  MOCK_KYC_IMAGES_BASE_64_BACK_NULL,
  MOCK_JPEG_IMG_EVENT,
  MOCK_WITHOUT_JPEG_IMG_EVENT,
} from '@fixtures/private/wallet/kyc/kyc.fixtures.spec';
import { MOCK_DEVICE_PERMISSIONS } from '@fixtures/user-device-permissions.fixtures.spec';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { KYCImagesNeeded } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
import { KYCImages } from '@private/features/wallet/interfaces/kyc/kyc-images.interface';
import { BannerComponent } from '@shared/banner/banner.component';
import { ButtonComponent } from '@shared/button/button.component';
import { MIME_TYPES } from '@shared/enums/mime-types.enum';
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

  const takePhotoCopy = $localize`:@@kyc_request_photo_counter_shoot:Take photo`;
  const uploadPhotoCopy = $localize`:@@kyc_request_photo_counter_upload:Upload photo`;
  const takeFrontSideImageSelector = '#takeFrontSideImage';
  const takeBackSideImageSelector = '#takeBackSideImage';
  const frontSideImageUploadSelector = '#frontSideImageUpload';
  const backSideImageUploadSelector = '#backSideImageUpload';
  const endVerificationButtonSelector = '#endVerificationButton';
  const imagesCounterButtonSelector = '#imagesCounterButton';
  const frontSideImageSelector = '#frontSideImage';
  const deleteFrontSideImageSelector = '#deleteFrontSideImage';
  const backSideImageSelector = '#backSideImage';
  const deleteBackSideImageSelector = '#deleteBackSideImage';
  const backButtonSelector = '.KYCUploadImages__back';
  const titleSelector = '#KYCUploadImages__title';

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

    it('should show the shoot image title', () => {
      fixture.detectChanges();

      const title = de.query(By.css(titleSelector)).nativeElement;
      expect(title.innerHTML).toBe($localize`:@@kyc_take_photo_view_if_one_side_title:Take a photo of your document`);
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

          describe('and the images are NOT shoot', () => {
            beforeEach(() => {
              testComponent.images = MOCK_EMPTY_KYC_IMAGES;

              fixture.detectChanges();
            });

            it('should show the front side take photo message', () => {
              expectTakeFrontSideImageInDOM(true);
            });

            it('should NOT show the front side image', () => {
              expectFrontSideImageInDOM(false);
            });

            it('should show the back side take photo message', () => {
              expectTakeBackSideImageInDOM(true);
            });

            it('should NOT show the back side image', () => {
              expectBackSideImageInDOM(false);
            });

            it('should NOT show the end verification button', () => {
              expectVerificationButtonInDOM(false);
            });

            it('should show the defined images counter as 0', () => {
              const imagesCounterButton = de.query(By.css(imagesCounterButtonSelector)).nativeElement;

              expect(component.actionButtonCopy).toBe(takePhotoCopy);
              expect(imagesCounterButton.textContent).toBe(`${component.actionButtonCopy} (0/2)`);
            });

            describe('and they click on the front side image box', () => {
              beforeEach(() => {
                spyOn(de.query(By.css(frontSideImageUploadSelector)).nativeElement, 'click');
              });

              it('should not open the device folder to update an image ', () => {
                expect(component.frontSideImageUpload.nativeElement.click).not.toHaveBeenCalled();
              });
            });

            describe('and they click on the back side image box', () => {
              beforeEach(() => {
                spyOn(de.query(By.css(backSideImageUploadSelector)).nativeElement, 'click');
              });

              it('should not open the device folder to update an image ', () => {
                expect(component.backSideImageUpload.nativeElement.click).not.toHaveBeenCalled();
              });
            });

            describe('and they shoot an image', () => {
              beforeEach(() => {
                spyOn(component.frontSideImage.nativeElement.getContext('2d'), 'drawImage');
                spyOn(component.frontSideImage.nativeElement, 'toDataURL').and.returnValue('NEW_IMAGE_SHOOT');

                de.query(By.css(imagesCounterButtonSelector)).nativeElement.click();
              });

              it('should convert the canvas to a jpeg image with hight quality', () => {
                expect(component.frontSideImage.nativeElement.toDataURL).toHaveBeenCalledWith(MIME_TYPES.IMAGE_JPEG, 1);
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
              testComponent.images = MOCK_KYC_IMAGES_BASE_64_BACK_NULL;

              fixture.detectChanges();
            });

            it('should show the front side image', () => {
              expectFrontSideImageInDOM(true);
            });

            it('should NOT show the front side take photo message', () => {
              expectTakeFrontSideImageInDOM(false);
            });

            it('should NOT show the back side image', () => {
              expectBackSideImageInDOM(false);
            });

            it('should show the back side take photo message', () => {
              expectTakeBackSideImageInDOM(true);
            });

            it('should NOT show the end verification button', () => {
              expectVerificationButtonInDOM(false);
            });

            it('should show the defined images counter as 1', () => {
              const imagesCounterButton = de.query(By.css(imagesCounterButtonSelector)).nativeElement;

              expect(component.actionButtonCopy).toBe(takePhotoCopy);
              expect(imagesCounterButton.textContent).toBe(`${component.actionButtonCopy} (1/2)`);
            });

            describe('and they shoot an image', () => {
              beforeEach(() => {
                spyOn(component.backSideImage.nativeElement.getContext('2d'), 'drawImage');
                spyOn(component.backSideImage.nativeElement, 'toDataURL').and.returnValue('NEW_BACK_IMAGE_SHOOT');

                de.query(By.css(imagesCounterButtonSelector)).nativeElement.click();
              });

              it('should convert the canvas to a jpeg image with hight quality', () => {
                expect(component.backSideImage.nativeElement.toDataURL).toHaveBeenCalledWith(MIME_TYPES.IMAGE_JPEG, 1);
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
              expectBackSideImageInDOM(true);
            });

            it('should NOT show the back side take photo message', () => {
              expectTakeBackSideImageInDOM(false);
            });

            it('should NOT show the front side image', () => {
              expectFrontSideImageInDOM(false);
            });

            it('should show the front side take photo message', () => {
              expectTakeFrontSideImageInDOM(true);
            });

            it('should NOT show the end verification button', () => {
              expectVerificationButtonInDOM(false);
            });

            it('should show the defined images counter as 1', () => {
              const imagesCounterButton = de.query(By.css(imagesCounterButtonSelector)).nativeElement;

              expect(component.actionButtonCopy).toBe(takePhotoCopy);
              expect(imagesCounterButton.textContent).toBe(`${component.actionButtonCopy} (1/2)`);
            });

            describe('and they shoot an image', () => {
              beforeEach(() => {
                spyOn(component.frontSideImage.nativeElement.getContext('2d'), 'drawImage');
                spyOn(component.frontSideImage.nativeElement, 'toDataURL').and.returnValue('NEW_FRONT_IMAGE_SHOOT');

                de.query(By.css(imagesCounterButtonSelector)).nativeElement.click();
              });

              it('should convert the canvas to a jpeg image with hight quality', () => {
                expect(component.frontSideImage.nativeElement.toDataURL).toHaveBeenCalledWith(MIME_TYPES.IMAGE_JPEG, 1);
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
              testComponent.images = MOCK_KYC_IMAGES_BASE_64;

              fixture.detectChanges();
            });

            it('should NOT show the counter images button', () => {
              const imagesCounterButton = de.query(By.css(imagesCounterButtonSelector));
              expect(imagesCounterButton).toBeFalsy();
            });

            it('should show the end verification button', () => {
              expectVerificationButtonInDOM(true);
            });

            describe('and the user requests the KYC verification...', () => {
              beforeEach(() => {
                spyOn(component.endVerification, 'emit');
                de.query(By.css(endVerificationButtonSelector)).nativeElement.click();
              });

              it('should notify to the parent that the verification is finished', () => {
                expectEndVerificationNotifyParent();
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
              expectTakeFrontSideImageInDOM(true);
            });

            it('should NOT show the front side image', () => {
              expectFrontSideImageInDOM(false);
            });

            it('should NOT render the back side image content', () => {
              expectBackSideImageContentInNOTinDOM();
            });

            it('should show the defined images counter as 0', () => {
              const imagesCounterButton = de.query(By.css(imagesCounterButtonSelector)).nativeElement;

              expect(component.actionButtonCopy).toBe(takePhotoCopy);
              expect(imagesCounterButton.textContent).toBe(`${component.actionButtonCopy} (0/1)`);
            });

            it('should NOT show the end verification button', () => {
              expectVerificationButtonInDOM(false);
            });

            describe('and they shoot an image', () => {
              beforeEach(() => {
                spyOn(component.frontSideImage.nativeElement.getContext('2d'), 'drawImage');
                spyOn(component.frontSideImage.nativeElement, 'toDataURL').and.returnValue('IMAGE_SHOOT');

                de.query(By.css(imagesCounterButtonSelector)).nativeElement.click();
              });

              it('should convert the canvas to a jpeg image with hight quality', () => {
                expect(component.frontSideImage.nativeElement.toDataURL).toHaveBeenCalledWith(MIME_TYPES.IMAGE_JPEG, 1);
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
              testComponent.images = MOCK_KYC_IMAGES_BASE_64_BACK_NULL;

              fixture.detectChanges();
            });

            it('should NOT show the front side take photo message', () => {
              expectTakeFrontSideImageInDOM(false);
            });

            it('should show the front side image', () => {
              expectFrontSideImageInDOM(true);
            });

            it('should NOT render the back side image content', () => {
              expectBackSideImageContentInNOTinDOM();
            });

            it('should NOT show the counter images button', () => {
              const imagesCounterButton = de.query(By.css(imagesCounterButtonSelector));
              expect(imagesCounterButton).toBeFalsy();
            });

            it('should show the end verification button', () => {
              expectVerificationButtonInDOM(true);
            });

            describe('and the user requests the KYC verification...', () => {
              beforeEach(() => {
                spyOn(component.endVerification, 'emit');
                de.query(By.css(endVerificationButtonSelector)).nativeElement.click();
              });

              it('should notify to the parent that the verification is finished', () => {
                expectEndVerificationNotifyParent();
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

    it('should show the upload image title', () => {
      const title = de.query(By.css(titleSelector)).nativeElement;
      expect(title.innerHTML).toBe($localize`:@@kyc_upload_photo_view_title:Upload a photo of your document`);
    });

    it('should NOT request camera access', () => {
      expect(askPermissionsService.askCameraPermissions).not.toHaveBeenCalled();
    });

    describe('and the user needs to upload two images', () => {
      beforeEach(() => {
        testComponent.imagesNeeded = 2;
      });

      describe('and the images are not uploaded', () => {
        beforeEach(() => {
          testComponent.images = MOCK_EMPTY_KYC_IMAGES;

          fixture.detectChanges();
        });

        it('should NOT show the end verification button', () => {
          expectVerificationButtonInDOM(false);
        });

        it('should show the defined images counter as 0', () => {
          const imagesCounterButton = de.query(By.css(imagesCounterButtonSelector)).nativeElement;

          expect(component.actionButtonCopy).toBe(uploadPhotoCopy);
          expect(imagesCounterButton.textContent).toBe(`${component.actionButtonCopy} (0/2)`);
        });

        it('should show the counter button disabled', () => {
          const buttonComponentRef: ButtonComponent = de.query(By.css(imagesCounterButtonSelector)).componentInstance;

          expect(buttonComponentRef.disabled).toBe(true);
        });

        describe('and the user clicks on the upload front side image box', () => {
          beforeEach(() => {
            spyOn(component.frontSideImage.nativeElement.getContext('2d'), 'drawImage');
            spyOn(de.query(By.css(frontSideImageUploadSelector)).nativeElement, 'click');
            spyOn(component.imagesChange, 'emit');

            de.query(By.css(takeFrontSideImageSelector)).nativeElement.click();
          });

          it('should open the input file upload', () => {
            expect(de.query(By.css(frontSideImageUploadSelector)).nativeElement.click).toHaveBeenCalledTimes(1);
          });

          describe('and the user selects a front side image', () => {
            beforeEach(() => {
              triggerChangeImageUpload(frontSideImageUploadSelector);
            });

            it('should draw the front side image on the screen', () => {
              expect(component.frontSideImage.nativeElement.getContext('2d').drawImage).toHaveBeenCalled();
            });

            it('should emit the selected image', () => {
              expect(component.imagesChange.emit).toHaveBeenCalledWith({
                ...component.images,
                frontSide: MOCK_BASE_64_SMALL_IMAGE,
              });
            });
          });

          describe(`and the user don't selects an image`, () => {
            beforeEach(() => {
              triggerChangeImageUploadWithoutSelectedImage(frontSideImageUploadSelector);
            });

            it('should NOT draw the image on the screen', () => {
              expect(component.frontSideImage.nativeElement.getContext('2d').drawImage).not.toHaveBeenCalled();
            });

            it('should NOT emit the selected image', () => {
              expect(component.imagesChange.emit).not.toHaveBeenCalled();
            });
          });
        });

        describe('and the user clicks on the upload back side image box', () => {
          beforeEach(() => {
            spyOn(component.backSideImage.nativeElement.getContext('2d'), 'drawImage');
            spyOn(component.imagesChange, 'emit');
          });

          beforeEach(() => {
            spyOn(de.query(By.css(backSideImageUploadSelector)).nativeElement, 'click');

            de.query(By.css(takeBackSideImageSelector)).nativeElement.click();
          });

          it('should open the input file upload', () => {
            expect(de.query(By.css(backSideImageUploadSelector)).nativeElement.click).toHaveBeenCalledTimes(1);
          });

          describe('and the user selects a back side image', () => {
            beforeEach(() => {
              triggerChangeImageUpload(backSideImageUploadSelector);
            });

            it('should draw the back side image on the screen', () => {
              expect(component.backSideImage.nativeElement.getContext('2d').drawImage).toHaveBeenCalled();
            });

            it('should emit the selected image', () => {
              expect(component.imagesChange.emit).toHaveBeenCalledWith({
                ...component.images,
                backSide: MOCK_BASE_64_SMALL_IMAGE,
              });
            });
          });

          describe(`and the user don't selects an image`, () => {
            beforeEach(() => {
              triggerChangeImageUploadWithoutSelectedImage(backSideImageSelector);
            });

            it('should NOT draw the image on the screen', () => {
              expect(component.backSideImage.nativeElement.getContext('2d').drawImage).not.toHaveBeenCalled();
            });

            it('should NOT emit the selected image', () => {
              expect(component.imagesChange.emit).not.toHaveBeenCalled();
            });
          });
        });
      });

      describe('and the images are uploaded', () => {
        beforeEach(() => {
          testComponent.images = MOCK_KYC_IMAGES_BASE_64;

          fixture.detectChanges();
        });

        it('should show the end verification button', () => {
          expectVerificationButtonInDOM(true);
        });

        it('should NOT show the counter button', () => {
          const imagesCounterButton = de.query(By.css(imagesCounterButtonSelector));

          expect(imagesCounterButton).toBeFalsy();
        });

        describe('and the user requests the KYC verification...', () => {
          beforeEach(() => {
            spyOn(component.endVerification, 'emit');
            de.query(By.css(endVerificationButtonSelector)).nativeElement.click();
          });

          it('should notify to the parent that the verification is finished', () => {
            expectEndVerificationNotifyParent();
          });
        });

        describe('and the front side image is deleted', () => {
          beforeEach(() => {
            spyOn(component.imagesChange, 'emit');
            de.query(By.css(deleteFrontSideImageSelector)).nativeElement.click();
          });

          it('should clean the front side input upload', () => {
            expect(component.frontSideImageUpload.nativeElement.value).toBe('');
          });

          it('should emit the empty front side image', () => {
            expect(component.imagesChange.emit).toHaveBeenCalledWith({
              ...component.images,
              frontSide: null,
            });
          });
        });

        describe('and the back side image is deleted', () => {
          beforeEach(() => {
            spyOn(component.imagesChange, 'emit');
            de.query(By.css(deleteBackSideImageSelector)).nativeElement.click();
          });

          it('should clean the back side input upload', () => {
            expect(component.backSideImageUpload.nativeElement.value).toBe('');
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

    describe('and the user needs to upload only one image', () => {
      beforeEach(() => {
        testComponent.imagesNeeded = 1;
      });

      describe('and the image is already uploaded', () => {
        beforeEach(() => {
          component.images = MOCK_KYC_IMAGES_BASE_64_BACK_NULL;

          fixture.detectChanges();
        });

        describe('and the user requests the KYC verification...', () => {
          beforeEach(() => {
            spyOn(component.endVerification, 'emit');
            de.query(By.css(endVerificationButtonSelector)).nativeElement.click();
          });

          it('should notify to the parent that the verification is finished', () => {
            expectEndVerificationNotifyParent();
          });
        });
      });
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

      it('should stop all the active track', () => {
        const tracks = component.userCamera.nativeElement.srcObject.getTracks();
        spyOn(tracks[0], 'stop');

        component.ngOnDestroy();

        tracks.forEach((track) => expect(track.stop).toHaveBeenCalled());
      });
    });
  });

  function expectVerificationButtonInDOM(expectIsDefined: boolean): void {
    const endVerificationButton = de.query(By.css(endVerificationButtonSelector));
    if (expectIsDefined) {
      expect(endVerificationButton).toBeTruthy();
    } else {
      expect(endVerificationButton).toBeFalsy();
    }
  }

  function expectEndVerificationNotifyParent(): void {
    expect(component.endVerification.emit).toHaveBeenCalledTimes(1);
  }

  function expectTakeFrontSideImageInDOM(expectIsDefined: boolean): void {
    const takeFrontSideImage = de.query(By.css(takeFrontSideImageSelector));

    if (expectIsDefined) {
      expect(takeFrontSideImage).toBeTruthy();
    } else {
      expect(takeFrontSideImage).toBeFalsy();
    }
  }

  function expectFrontSideImageInDOM(expectIsDefined: boolean): void {
    const frontSideImage = de.query(By.css(frontSideImageSelector)).classes;

    if (expectIsDefined) {
      expect(frontSideImage).not.toHaveProperty('d-none', true);
    } else {
      expect(frontSideImage).toHaveProperty('d-none', true);
    }
  }

  function expectTakeBackSideImageInDOM(expectIsDefined: boolean): void {
    const takeBackSideImage = de.query(By.css(takeBackSideImageSelector));

    if (expectIsDefined) {
      expect(takeBackSideImage).toBeTruthy();
    } else {
      expect(takeBackSideImage).toBeFalsy();
    }
  }

  function expectBackSideImageInDOM(expectIsDefined: boolean): void {
    const backSideImage = de.query(By.css(backSideImageSelector)).classes;

    if (expectIsDefined) {
      expect(backSideImage).not.toHaveProperty('d-none', true);
    } else {
      expect(backSideImage).toHaveProperty('d-none', true);
    }
  }

  function expectBackSideImageContentInNOTinDOM(): void {
    const backSideImage = de.query(By.css(backSideImageSelector));
    const takeBackSideImage = de.query(By.css(takeBackSideImageSelector));

    expect(backSideImage).toBeFalsy();
    expect(takeBackSideImage).toBeFalsy();
  }

  function triggerChangeImageUpload(selector: string): void {
    spyOn(Image.prototype, 'addEventListener').and.callFake((p1, callback) => callback());
    spyOn(FileReader.prototype, 'addEventListener').and.callFake((p1, callback) => callback(MOCK_JPEG_IMG_EVENT()));

    de.query(By.css(selector)).triggerEventHandler('change', MOCK_JPEG_IMG_EVENT());
  }

  function triggerChangeImageUploadWithoutSelectedImage(selector: string): void {
    spyOn(Image.prototype, 'addEventListener').and.callFake((p1, callback) => callback());
    spyOn(FileReader.prototype, 'addEventListener').and.callFake((p1, callback) => callback(MOCK_WITHOUT_JPEG_IMG_EVENT()));

    de.query(By.css(selector)).triggerEventHandler('change', MOCK_WITHOUT_JPEG_IMG_EVENT());
  }
});
