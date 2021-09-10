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
} from '@fixtures/private/wallet/kyc/kyc-images.fixtures.spec';
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

  const takeImageButtonSelector = '#takeImageButton';
  const retakeImageButtonSelector = '#retakeImageButton';
  const continueVerificationButtonSelector = '#continueVerificationButton';
  const endVerificationButtonSelector = '#endVerificationButton';
  const userCameraSelector = '#userCamera';
  const definedImageSelector = '#definedImage';
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
          spyOn(component.goBack, 'emit');

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

        it('should NOT show an error banner', () => {
          const banner = de.query(By.directive(BannerComponent));
          expect(banner).toBeFalsy();
        });

        describe('and the user must provide two images of the document', () => {
          beforeEach(() => {
            testComponent.imagesNeeded = 2;
          });

          describe('and we are on the front side image step', () => {
            beforeEach(() => {
              testComponent.images = MOCK_EMPTY_KYC_IMAGES;

              fixture.detectChanges();
            });

            it('should show the continue verification button', () => {
              expectContinueButtonInDOM(true);
            });

            it('should NOT show the end verification button', () => {
              expectEndVerificationButtonInDOM(false);
            });

            describe('and the front side image is not defined', () => {
              it('should show the correct title', () => {
                const expectedTitle = $localize`:@@kyc_take_photo_view_if_two_sides_front_side_title:Take a photo of the front side of your ID document`;

                expectShowCorrectTitle(expectedTitle);
              });

              it('should show the correct subtitle', () => {
                const expectedSubtitle = $localize`:@@kyc_take_photo_view_if_two_sides_front_side_description:Go somewhere with good lighting, focus the camera on the document, and take the best photo possible.`;

                expectShowCorrectSubtitle(expectedSubtitle);
              });

              it('should show the take image button', () => {
                expectTakeImageButtonInDOM(true);
              });

              it('should NOT show the retake image button', () => {
                expectRetakeImageButtonInDOM(false);
              });

              it('should show the user camera', () => {
                expectCameraInDOM(true);
              });

              it('should NOT show the front side image', () => {
                expectDefinedImageInDOM(false);
              });

              describe('and they click on the shoot front side image button', () => {
                beforeEach(() => {
                  spyOn(component.uploadImage.nativeElement, 'click');
                  spyOn(component.definedImageCanvas.nativeElement.getContext('2d'), 'drawImage');
                  spyOn(component.definedImageCanvas.nativeElement, 'toDataURL').and.returnValue('NEW_IMAGE_SHOOT');

                  de.query(By.css(takeImageButtonSelector)).nativeElement.click();
                  fixture.detectChanges();
                });

                it('should not open the device folder to update an image ', () => {
                  expect(component.uploadImage.nativeElement.click).not.toHaveBeenCalled();
                });

                it('should convert the canvas to a jpeg image with hight quality', () => {
                  expect(component.definedImageCanvas.nativeElement.toDataURL).toHaveBeenCalledWith(MIME_TYPES.IMAGE_JPEG, 1);
                });

                it('should draw the image on the screen', () => {
                  expect(component.definedImageCanvas.nativeElement.getContext('2d').drawImage).toHaveBeenCalled();
                });

                it('should emit the new front side image', () => {
                  expect(component.imagesChange.emit).toHaveBeenCalledWith({
                    ...component.images,
                    frontSide: 'NEW_IMAGE_SHOOT',
                  });
                });
              });
            });

            describe('and the front side image is defined', () => {
              beforeEach(() => {
                testComponent.images = MOCK_KYC_IMAGES_BASE_64_BACK_NULL;

                fixture.detectChanges();
              });

              it('should show the correct title', () => {
                const expectedTitle = $localize`:@@kyc_take_photo_view_if_two_sides_review_front_side_title:Check the photo of the front side of your document`;

                expectShowCorrectTitle(expectedTitle);
              });

              it('should show the correct subtitle', () => {
                const expectedSubtitle = $localize`:@@kyc_take_photo_view_if_two_sides_review_front_side_description:All the details on your ID document must be clear and perfectly legible.`;

                expectShowCorrectSubtitle(expectedSubtitle);
              });

              it('should NOT show the take image button', () => {
                expectTakeImageButtonInDOM(false);
              });

              it('should show the retake image button', () => {
                expectRetakeImageButtonInDOM(true);
              });

              it('should NOT show the user camera', () => {
                expectCameraInDOM(false);
              });

              it('should show the front side image', () => {
                expectDefinedImageInDOM(true);
              });

              describe('and they click on retake the front side image', () => {
                beforeEach(() => {
                  de.query(By.css(retakeImageButtonSelector)).nativeElement.click();
                  fixture.detectChanges();
                });

                it('should remove the front side image', () => {
                  expect(component.imagesChange.emit).toHaveBeenCalledWith({
                    ...component.images,
                    frontSide: null,
                  });
                });
              });
            });

            describe('and the user go back', () => {
              beforeEach(() => {
                de.query(By.css(backButtonSelector)).nativeElement.click();
              });

              it('should emit the images clean', () => {
                expect(component.imagesChange.emit).toHaveBeenCalledWith({
                  frontSide: null,
                  backSide: null,
                });
              });

              it('should emit the go back action to the parent', () => {
                expect(component.goBack.emit).toHaveBeenCalledTimes(1);
              });
            });
          });

          describe('and we are on the back side image step', () => {
            beforeEach(() => {});

            it('should show the back side image', () => {});

            it('should NOT show the back side take photo message', () => {});

            it('should NOT show the end verification button', () => {});

            describe('and they shoot an image', () => {
              beforeEach(() => {});

              it('should convert the canvas to a jpeg image with hight quality', () => {});

              it('should draw the front side image on the screen', () => {});

              it('should emit the new front side image', () => {});
            });

            describe('and they delete the back side image', () => {
              beforeEach(() => {});

              it('should emit the empty back side image', () => {});
            });
          });
        });

        describe('and the user must provide ONLY one image of the document', () => {
          beforeEach(() => {});

          describe('and the front side image is NOT shoot', () => {
            beforeEach(() => {});

            it('should show the front side take photo message', () => {});

            it('should NOT show the front side image', () => {});

            it('should NOT render the back side image content', () => {});

            it('should show the defined images counter as 0', () => {});

            it('should NOT show the end verification button', () => {});

            describe('and they shoot an image', () => {
              beforeEach(() => {});

              it('should convert the canvas to a jpeg image with hight quality', () => {});

              it('should draw the front side image on the screen', () => {});

              it('should emit the new front side image', () => {});
            });
          });

          describe('and the front side image is already shoot', () => {
            beforeEach(() => {});

            it('should NOT show the front side take photo message', () => {});

            it('should show the front side image', () => {});

            it('should NOT render the back side image content', () => {});

            it('should NOT show the counter images button', () => {});

            it('should show the end verification button', () => {});

            describe('and the user requests the KYC verification...', () => {
              beforeEach(() => {});

              it('should notify to the parent that the verification is finished', () => {});
            });

            describe('and they delete the front side image', () => {
              beforeEach(() => {});

              it('should emit the empty front side image', () => {});
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

    it('should show the upload image title', () => {});

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

        it('should NOT show the end verification button', () => {});

        describe('and the user clicks on the upload front side image box', () => {
          beforeEach(() => {});

          it('should open the input file upload', () => {});

          describe('and the user selects a front side image', () => {
            beforeEach(() => {});

            it('should draw the front side image on the screen', () => {});

            it('should emit the selected image', () => {});
          });

          describe(`and the user does NOT select an image`, () => {
            beforeEach(() => {});

            it('should NOT draw the image on the screen', () => {});

            it('should NOT emit the selected image', () => {});
          });
        });

        describe('and the user clicks on the upload back side image box', () => {
          beforeEach(() => {});

          it('should open the input file upload', () => {});

          describe('and the user selects a back side image', () => {
            beforeEach(() => {});

            it('should draw the back side image on the screen', () => {});

            it('should emit the selected image', () => {});
          });

          describe(`and the user does NOT select an image`, () => {
            beforeEach(() => {});

            it('should NOT draw the image on the screen', () => {});

            it('should NOT emit the selected image', () => {});
          });
        });
      });

      describe('and the images are uploaded', () => {
        beforeEach(() => {
          testComponent.images = MOCK_KYC_IMAGES_BASE_64;

          fixture.detectChanges();
        });

        it('should show the end verification button', () => {});

        describe('and the user requests the KYC verification...', () => {
          beforeEach(() => {
            spyOn(component.endVerification, 'emit');
            // de.query(By.css(endVerificationButtonSelector)).nativeElement.click();
          });

          it('should notify to the parent that the verification is finished', () => {});
        });

        describe('and the front side image is deleted', () => {
          beforeEach(() => {});

          it('should clean the front side input upload', () => {});

          it('should emit the empty front side image', () => {});
        });

        describe('and the back side image is deleted', () => {
          beforeEach(() => {});

          it('should clean the back side input upload', () => {});

          it('should emit the empty back side image', () => {});
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

          it('should notify to the parent that the verification is finished', () => {});
        });
      });
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

  function expectShowCorrectTitle(expectedTitle: string): void {
    expect(de.nativeElement.querySelector('.KYCUploadImages__title').innerHTML).toEqual(expectedTitle);
  }

  function expectShowCorrectSubtitle(expectedSubtitle: string) {
    expect(de.nativeElement.querySelector('.KYCUploadImages__subtitle').innerHTML).toEqual(expectedSubtitle);
  }

  function expectDefinedImageInDOM(expectIsDefined: boolean): void {
    const backSideImage = de.query(By.css(definedImageSelector)).classes;

    expectIsDefined ? expect(backSideImage).not.toHaveProperty('d-none', true) : expect(backSideImage).toHaveProperty('d-none', true);
  }

  function expectCameraInDOM(expectIsDefined: boolean): void {
    const backSideImage = de.query(By.css(userCameraSelector)).classes;

    expectIsDefined ? expect(backSideImage).not.toHaveProperty('d-none', true) : expect(backSideImage).toHaveProperty('d-none', true);
  }

  function expectEndVerificationButtonInDOM(expectIsDefined: boolean): void {
    const endVerificationButton = de.query(By.css(endVerificationButtonSelector));

    expectIsDefined ? expect(endVerificationButton).toBeTruthy() : expect(endVerificationButton).toBeFalsy();
  }

  function expectContinueButtonInDOM(expectIsDefined: boolean): void {
    const continueButton = de.query(By.css(continueVerificationButtonSelector));

    expectIsDefined ? expect(continueButton).toBeTruthy() : expect(continueButton).toBeFalsy();
  }

  function expectTakeImageButtonInDOM(expectIsDefined: boolean): void {
    const takeImageButton = de.query(By.css(takeImageButtonSelector));

    expectIsDefined ? expect(takeImageButton).toBeTruthy() : expect(takeImageButton).toBeFalsy();
  }

  function expectRetakeImageButtonInDOM(expectIsDefined: boolean): void {
    const retakeImageButton = de.query(By.css(retakeImageButtonSelector));

    expectIsDefined ? expect(retakeImageButton).toBeTruthy() : expect(retakeImageButton).toBeFalsy();
  }
});
