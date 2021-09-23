import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_BASE_64_SMALL_IMAGE } from '@fixtures/base64.fixtures.spec';
import { MOCK_MEDIA_STREAM } from '@fixtures/media-stream.fixtures.spec';
import {
  MOCK_EMPTY_KYC_IMAGES,
  MOCK_KYC_IMAGES_BASE_64,
  MOCK_KYC_IMAGES_BASE_64_BACK_NULL,
  MOCK_JPEG_IMG_EVENT,
  MOCK_WITHOUT_JPEG_IMG_EVENT,
} from '@fixtures/private/wallet/kyc/kyc-images.fixtures.spec';
import { MOCK_KYC_DOCUMENTATION } from '@fixtures/private/wallet/kyc/kyc-specifications.fixtures.spec';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { KYCDocumentation, KYCImagesNeeded } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
import { BannerComponent } from '@shared/banner/banner.component';
import { ButtonComponent } from '@shared/button/button.component';
import { MIME_TYPES } from '@shared/enums/mime-types.enum';
import { RequestVideoPermissionsService } from '@shared/services/video/request-video-permissions/request-video-permissions.service';
import { VIDEO_PERMISSIONS_STATUS } from '@shared/services/video/request-video-permissions/video-permissions-status.interface';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { BehaviorSubject, throwError } from 'rxjs';
import { KYCTrackingEventsService } from '../../services/kyc-tracking-events/kyc-tracking-events.service';
import { KYC_TAKE_IMAGE_OPTIONS } from '../kyc-image-options/kyc-image-options.enum';
import { KYCUploadImagesComponent } from './kyc-upload-images.component';

@Component({
  selector: 'tsl-test-wrapper',
  template: `
    <tsl-kyc-upload-images
      [imagesNeeded]="imagesNeeded"
      [takeImageMethod]="takeImageMethod"
      [documentationSelected]="documentationSelected"
    ></tsl-kyc-upload-images>
  `,
})
class TestWrapperComponent {
  @Input() imagesNeeded: KYCImagesNeeded;
  @Input() takeImageMethod: KYC_TAKE_IMAGE_OPTIONS;
  @Input() documentationSelected: KYCDocumentation;
}

describe('KYCUploadImagesComponent', () => {
  let component: KYCUploadImagesComponent;
  let testComponent: TestWrapperComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;
  let de: DebugElement;
  let requestVideoPermissionsService: RequestVideoPermissionsService;
  let kycTrackingEventsService: KYCTrackingEventsService;

  const videoPermissionsSubjectMock: BehaviorSubject<VIDEO_PERMISSIONS_STATUS> = new BehaviorSubject<VIDEO_PERMISSIONS_STATUS>(
    VIDEO_PERMISSIONS_STATUS.LOADING
  );
  const videoStreamSubjectMock: BehaviorSubject<any> = new BehaviorSubject<any>(MOCK_MEDIA_STREAM);
  const srcObjectMock: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  const takeImageButtonSelector = '#takeImageButton';
  const retakeImageButtonSelector = '#retakeImageButton';
  const continueVerificationButtonSelector = '#continueVerificationButton';
  const endVerificationButtonSelector = '#endVerificationButton';
  const uploadImageSelector = '#uploadImage';
  const userVideoSelector = '#userVideo';
  const definedImageSelector = '#definedImage';
  const backButtonSelector = '.KYCUploadImages__back';
  const imageBlockSelector = '#imageBlock';
  const loadingBlockSelector = '#loadingBlock';
  const uploadImageDefinedContentSelector = '#uploadImageDefinedContent';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgbAlertModule],
      declarations: [TestWrapperComponent, KYCUploadImagesComponent, BannerComponent, SvgIconComponent, ButtonComponent],
      providers: [
        {
          provide: RequestVideoPermissionsService,
          useValue: {
            get userVideoPermissions$() {
              return videoPermissionsSubjectMock.asObservable();
            },
            get videoStream$() {
              return videoStreamSubjectMock.asObservable();
            },
            stopStream() {},
            startStream() {},
          },
        },
        {
          provide: KYCTrackingEventsService,
          useValue: {
            trackViewKYCReviewDocumentationImageScreen() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    mockSrcObjectInHTMLVideoElement();
    fixture = TestBed.createComponent(TestWrapperComponent);
    requestVideoPermissionsService = TestBed.inject(RequestVideoPermissionsService);
    kycTrackingEventsService = TestBed.inject(KYCTrackingEventsService);
    de = fixture.debugElement;
    component = de.query(By.directive(KYCUploadImagesComponent)).componentInstance;
    testComponent = fixture.componentInstance;
    testComponent.documentationSelected = MOCK_KYC_DOCUMENTATION;

    component.images$.next(MOCK_EMPTY_KYC_IMAGES);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the header text defined', () => {
    fixture.detectChanges();

    expect(de.nativeElement.querySelector('#headerText').innerHTML).toEqual(testComponent.documentationSelected.label);
  });

  describe('when the user selects the shoot image method', () => {
    beforeEach(() => {
      testComponent.takeImageMethod = KYC_TAKE_IMAGE_OPTIONS.SHOOT;
    });

    describe(`and the user's browser supports the API`, () => {
      beforeEach(() => {
        spyOn(requestVideoPermissionsService, 'startStream');
      });

      describe(`and we are waiting for user's response`, () => {
        beforeEach(() => {
          videoPermissionsSubjectMock.next(VIDEO_PERMISSIONS_STATUS.LOADING);
          fixture.detectChanges();
        });

        it('should set the user permissions as loading', () => {
          let videoPermissions: VIDEO_PERMISSIONS_STATUS;

          component.videoPermissions$.subscribe((permissions: VIDEO_PERMISSIONS_STATUS) => {
            videoPermissions = permissions;
          });

          expect(videoPermissions).toBe(VIDEO_PERMISSIONS_STATUS.LOADING);
        });

        it('should show the loading status', () => {
          expectShouldShowLoadingStatus(true);
        });

        it('should not show the error banner', () => {
          const banner = de.query(By.directive(BannerComponent));
          expect(banner).toBeFalsy();
        });

        it('should not render the camera block', () => {
          expect(de.query(By.css(imageBlockSelector))).toBeFalsy();
        });
      });

      describe('and the user accept the permission', () => {
        beforeEach(() => {
          spyOn(kycTrackingEventsService, 'trackViewKYCReviewDocumentationImageScreen');
          spyOn(component.goBack, 'emit');

          videoStreamSubjectMock.next(MOCK_MEDIA_STREAM);
          videoPermissionsSubjectMock.next(VIDEO_PERMISSIONS_STATUS.ACCEPTED);
        });

        it('should set the user permissions as accepted', () => {
          let videoPermissions: VIDEO_PERMISSIONS_STATUS;

          fixture.detectChanges();
          component.videoPermissions$.subscribe((permissions: VIDEO_PERMISSIONS_STATUS) => {
            videoPermissions = permissions;
          });

          expect(videoPermissions).toBe(VIDEO_PERMISSIONS_STATUS.ACCEPTED);
        });

        it('should show the webcam video in the template', () => {
          fixture.detectChanges();

          expectVideoInDOM(true);
        });

        it('should define the webcam video stream', () => {
          fixture.detectChanges();

          expect(srcObjectMock.value).toStrictEqual(MOCK_MEDIA_STREAM);
        });

        it('should show the camera block', () => {
          fixture.detectChanges();

          expectImageBlockHiddenInDOM(false);
        });

        it('should NOT show an error banner', () => {
          fixture.detectChanges();

          const banner = de.query(By.directive(BannerComponent));
          expect(banner).toBeFalsy();
        });

        it('should NOT show the loading status', () => {
          fixture.detectChanges();

          expectShouldShowLoadingStatus(false);
        });

        it('should not render the input upload image ', () => {
          fixture.detectChanges();

          expectUploadImageInDOM(false);
        });

        describe('and the user must provide two images of the document', () => {
          beforeEach(() => {
            testComponent.imagesNeeded = 2;
          });

          describe('and we are on the front side image step', () => {
            beforeEach(() => {
              component.images$.next(MOCK_EMPTY_KYC_IMAGES);

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

              it('should show the correct take image message in the button', () => {
                const expectedMessage = $localize`:@@kyc_take_photo_view_if_two_sides_front_side_photo_button:Take front side photo`;
                expectTakeImageButtonCorrectMessage(expectedMessage);
              });

              it('should NOT show the retake image button', () => {
                expectRetakeImageButtonInDOM(false);
              });

              it('should show the user video', () => {
                expectVideoHiddenInDom(false);
              });

              it('should NOT show the front side image', () => {
                expectDefinedImageInDOM(false);
              });

              it('should disable the continue button', () => {
                expectContinueButtonDisabled(true);
              });

              describe('and they click on the shoot front side image button', () => {
                beforeEach(() => {
                  spyOn(component.definedImageCanvas.nativeElement.getContext('2d'), 'drawImage');
                  spyOn(component.definedImageCanvas.nativeElement, 'toDataURL').and.returnValue('NEW_IMAGE_SHOOT');

                  de.query(By.css(takeImageButtonSelector)).nativeElement.click();
                  fixture.detectChanges();
                });

                it('should convert the canvas to a jpeg image with hight quality', () => {
                  expect(component.definedImageCanvas.nativeElement.toDataURL).toHaveBeenCalledWith(MIME_TYPES.IMAGE_JPEG, 1);
                });

                it('should draw the image on the screen', () => {
                  expect(component.definedImageCanvas.nativeElement.getContext('2d').drawImage).toHaveBeenCalled();
                });

                it('should track the view KYC review documentation image screen event', () => {
                  shouldTrackViewKYCReviewDocumentationImageScreen();
                });

                it('should update the new front side image', () => {
                  expect(component.images$.value).toStrictEqual({
                    ...component.images$.value,
                    frontSide: 'NEW_IMAGE_SHOOT',
                  });
                });
              });
            });

            describe('and the front side image is defined', () => {
              beforeEach(() => {
                component.images$.next(MOCK_KYC_IMAGES_BASE_64_BACK_NULL);

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

              it('should show the correct retake image message in the button', () => {
                const expectedMessage = $localize`:@@kyc_take_photo_view_if_two_sides_review_front_side_photo_button:Retake front side photo`;
                expectRetakeImageButtonCorrectMessage(expectedMessage);
              });

              it('should not render the user video', () => {
                expectVideoInDOM(false);
              });

              it('should stop all the activated tracks', () => {
                expectAllTracksHaveBeenStopped();
              });

              it('should show the front side image', () => {
                expectDefinedImageInDOM(true);
              });

              it('should enable the continue button', () => {
                expectContinueButtonDisabled(false);
              });

              it('should track the view KYC review documentation image screen event', () => {
                shouldTrackViewKYCReviewDocumentationImageScreen();
              });

              describe('and they click on retake the front side image', () => {
                beforeEach(() => {
                  de.query(By.css(retakeImageButtonSelector)).nativeElement.click();
                });

                it('should remove the front side image', () => {
                  expect(component.images$.value).toStrictEqual({
                    ...component.images$.value,
                    frontSide: null,
                  });
                });

                it('should active the video stream again', () => {
                  expect(requestVideoPermissionsService.startStream).toHaveBeenCalledTimes(2);
                });
              });

              describe('and they click on continue verification button', () => {
                beforeEach(() => {
                  de.query(By.css(continueVerificationButtonSelector)).nativeElement.click();
                });

                it('should go to take the back side image', () => {
                  expect(component.activeStep$.value).toBe(2);
                });

                it('should active the video stream again', () => {
                  expect(requestVideoPermissionsService.startStream).toHaveBeenCalledTimes(2);
                });
              });
            });

            describe('and the user go back', () => {
              beforeEach(() => {
                de.query(By.css(backButtonSelector)).nativeElement.click();
              });

              it('should emit the go back action to the parent', () => {
                expect(component.goBack.emit).toHaveBeenCalledTimes(1);
              });
            });
          });

          describe('and we are on the back side image step', () => {
            beforeEach(() => {
              component.activeStep$.next(2);
              component.images$.next(MOCK_KYC_IMAGES_BASE_64_BACK_NULL);
            });

            it('should NOT show the continue verification button', () => {
              fixture.detectChanges();

              expectContinueButtonInDOM(false);
            });

            it('should show the end verification button', () => {
              fixture.detectChanges();

              expectEndVerificationButtonInDOM(true);
            });

            describe('and the back side image is not defined', () => {
              beforeEach(() => {
                fixture.detectChanges();
              });

              it('should show the correct title', () => {
                const expectedTitle = $localize`:@@kyc_take_photo_view_if_two_sides_back_side_title:Take a back side photo of your document`;

                expectShowCorrectTitle(expectedTitle);
              });

              it('should show the correct subtitle', () => {
                const expectedSubtitle = $localize`:@@kyc_take_photo_view_if_two_sides_back_side_description:To finish the verification process, you just need to take a photo of the back side of your ID document.`;

                expectShowCorrectSubtitle(expectedSubtitle);
              });

              it('should show the take image button', () => {
                expectTakeImageButtonInDOM(true);
              });

              it('should show the correct take image message in the button', () => {
                const expectedMessage = $localize`:@@kyc_take_photo_view_if_two_sides_back_side_continue_button:Take back side photo`;
                expectTakeImageButtonCorrectMessage(expectedMessage);
              });

              it('should NOT show the retake image button', () => {
                expectRetakeImageButtonInDOM(false);
              });

              it('should show the user video', () => {
                expectVideoHiddenInDom(false);
              });

              it('should NOT show the back side image', () => {
                expectDefinedImageInDOM(false);
              });

              it('should disable the end verification button', () => {
                expectEndVerificationButtonDisabled(true);
              });

              describe('and they click on the shoot back side image button', () => {
                beforeEach(() => {
                  spyOn(component.definedImageCanvas.nativeElement.getContext('2d'), 'drawImage');
                  spyOn(component.definedImageCanvas.nativeElement, 'toDataURL').and.returnValue('NEW_BACK_IMAGE_SHOOT');

                  de.query(By.css(takeImageButtonSelector)).nativeElement.click();
                  fixture.detectChanges();
                });

                it('should convert the canvas to a jpeg image with hight quality', () => {
                  expect(component.definedImageCanvas.nativeElement.toDataURL).toHaveBeenCalledWith(MIME_TYPES.IMAGE_JPEG, 1);
                });

                it('should track the view KYC review documentation image screen event', () => {
                  shouldTrackViewKYCReviewDocumentationImageScreen();
                });

                it('should draw the back side image on the screen', () => {
                  expect(component.definedImageCanvas.nativeElement.getContext('2d').drawImage).toHaveBeenCalled();
                });

                it('should update the new back side image', () => {
                  expect(component.images$.value).toStrictEqual({
                    ...component.images$.value,
                    backSide: 'NEW_BACK_IMAGE_SHOOT',
                  });
                });
              });
            });

            describe('and the back side image is defined', () => {
              beforeEach(() => {
                component.images$.next(MOCK_KYC_IMAGES_BASE_64);

                fixture.detectChanges();
              });

              it('should show the correct title', () => {
                const expectedTitle = $localize`:@@kyc_take_photo_view_if_two_sides_review_back_side_title:Check the photo of the back side of your document`;

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

              it('should show the correct retake image message in the button', () => {
                const expectedMessage = $localize`:@@kyc_take_photo_view_if_two_sides_review_back_side_photo_button:Retake back side photo`;
                expectRetakeImageButtonCorrectMessage(expectedMessage);
              });

              it('should not render the user video', () => {
                expectVideoInDOM(false);
              });

              it('should stop all the activated tracks', () => {
                expectAllTracksHaveBeenStopped();
              });

              it('should show the back side image', () => {
                expectDefinedImageInDOM(true);
              });

              it('should enable the end verification button', () => {
                expectEndVerificationButtonDisabled(false);
              });

              it('should track the view KYC review documentation image screen event', () => {
                shouldTrackViewKYCReviewDocumentationImageScreen();
              });

              describe('and they click on retake the back side image', () => {
                beforeEach(() => {
                  de.query(By.css(retakeImageButtonSelector)).nativeElement.click();
                });

                it('should remove the back side image', () => {
                  expect(component.images$.value).toStrictEqual({
                    ...component.images$.value,
                    backSide: null,
                  });
                });

                it('should active the video stream again', () => {
                  expect(requestVideoPermissionsService.startStream).toHaveBeenCalled();
                });
              });

              describe('and they click on end verification button', () => {
                beforeEach(() => {
                  spyOn(component.endVerification, 'emit');
                  de.query(By.css(endVerificationButtonSelector)).nativeElement.click();
                });

                it('should notify to the parent that the verification ends ', () => {
                  expect(component.endVerification.emit).toHaveBeenCalledTimes(1);
                  expect(component.endVerification.emit).toHaveBeenCalledWith(MOCK_KYC_IMAGES_BASE_64);
                });
              });
            });

            describe('and the user go back', () => {
              beforeEach(() => {
                fixture.detectChanges();

                de.query(By.css(backButtonSelector)).nativeElement.click();
              });

              it('should clean the images', () => {
                expect(component.images$.value).toStrictEqual({
                  frontSide: null,
                  backSide: null,
                });
              });

              it('should go to the define first image step', () => {
                expect(component.activeStep$.value).toBe(1);
              });

              it('should active the video stream again', () => {
                expect(requestVideoPermissionsService.startStream).toHaveBeenCalled();
              });
            });
          });
        });

        describe('and the user must provide ONLY one image of the document', () => {
          beforeEach(() => {
            testComponent.imagesNeeded = 1;
            component.images$.next(MOCK_EMPTY_KYC_IMAGES);
          });

          it('should NOT show the continue verification button', () => {
            fixture.detectChanges();

            expectContinueButtonInDOM(false);
          });

          it('should show the end verification button', () => {
            fixture.detectChanges();

            expectEndVerificationButtonInDOM(true);
          });

          describe('and the image is not defined', () => {
            beforeEach(() => {
              fixture.detectChanges();
            });

            it('should show the correct title', () => {
              const expectedTitle = $localize`:@@kyc_take_photo_view_if_one_side_title:Take a photo of your document`;

              expectShowCorrectTitle(expectedTitle);
            });

            it('should show the correct subtitle', () => {
              const expectedSubtitle = $localize`:@@kyc_take_photo_view_if_one_side_description:Go somewhere with good lighting and take the photo. Make sure the document you provide is valid for at least 3 months.`;

              expectShowCorrectSubtitle(expectedSubtitle);
            });

            it('should show the take image button', () => {
              expectTakeImageButtonInDOM(true);
            });

            it('should show the correct take image message in the button', () => {
              const expectedMessage = $localize`:@@kyc_take_photo_view_if_one_side_take_photo_button:Take photo`;
              expectTakeImageButtonCorrectMessage(expectedMessage);
            });

            it('should NOT show the retake image button', () => {
              expectRetakeImageButtonInDOM(false);
            });

            it('should show the user video', () => {
              expectVideoHiddenInDom(false);
            });

            it('should NOT show the front side image', () => {
              expectDefinedImageInDOM(false);
            });

            it('should disable the end verification button', () => {
              expectEndVerificationButtonDisabled(true);
            });

            describe('and they click on the shoot front side image button', () => {
              beforeEach(() => {
                spyOn(component.definedImageCanvas.nativeElement.getContext('2d'), 'drawImage');
                spyOn(component.definedImageCanvas.nativeElement, 'toDataURL').and.returnValue('NEW_IMAGE_SHOOT');

                de.query(By.css(takeImageButtonSelector)).nativeElement.click();
                fixture.detectChanges();
              });

              it('should convert the canvas to a jpeg image with hight quality', () => {
                expect(component.definedImageCanvas.nativeElement.toDataURL).toHaveBeenCalledWith(MIME_TYPES.IMAGE_JPEG, 1);
              });

              it('should draw the front side image on the screen', () => {
                expect(component.definedImageCanvas.nativeElement.getContext('2d').drawImage).toHaveBeenCalled();
              });

              it('should track the view KYC review documentation image screen event', () => {
                shouldTrackViewKYCReviewDocumentationImageScreen();
              });

              it('should update the new front side image', () => {
                expect(component.images$.value).toStrictEqual({
                  ...component.images$.value,
                  frontSide: 'NEW_IMAGE_SHOOT',
                });
              });
            });
          });

          describe('and the image is defined', () => {
            beforeEach(() => {
              component.images$.next(MOCK_KYC_IMAGES_BASE_64_BACK_NULL);

              fixture.detectChanges();
            });

            it('should show the correct title', () => {
              const expectedTitle = $localize`:@@kyc_take_photo_view_if_one_side_review_title:Check the photo of your document`;

              expectShowCorrectTitle(expectedTitle);
            });

            it('should show the correct subtitle', () => {
              const expectedSubtitle = $localize`:@@kyc_take_photo_view_if_one_side_review_description:All the details on your document must be clear and perfectly legible.`;

              expectShowCorrectSubtitle(expectedSubtitle);
            });

            it('should NOT show the take image button', () => {
              expectTakeImageButtonInDOM(false);
            });

            it('should show the retake image button', () => {
              expectRetakeImageButtonInDOM(true);
            });

            it('should show the correct retake image message in the button', () => {
              const expectedMessage = $localize`:@@kyc_take_photo_view_if_one_side_review_retake_photo_button:Retake photo`;
              expectRetakeImageButtonCorrectMessage(expectedMessage);
            });

            it('should not render the user video', () => {
              expectVideoInDOM(false);
            });

            it('should stop all the activated tracks', () => {
              expectAllTracksHaveBeenStopped();
            });

            it('should show the front side image', () => {
              expectDefinedImageInDOM(true);
            });

            it('should enable the end verification button', () => {
              expectEndVerificationButtonDisabled(false);
            });

            it('should track the view KYC review documentation image screen event', () => {
              shouldTrackViewKYCReviewDocumentationImageScreen();
            });

            describe('and they click on retake the front side image', () => {
              beforeEach(() => {
                de.query(By.css(retakeImageButtonSelector)).nativeElement.click();
              });

              it('should remove the front side image', () => {
                expect(component.images$.value).toStrictEqual({
                  ...component.images$.value,
                  frontSide: null,
                });
              });

              it('should active the video stream again', () => {
                expect(requestVideoPermissionsService.startStream).toHaveBeenCalledTimes(1);
              });
            });

            describe('and they click on end verification button', () => {
              beforeEach(() => {
                spyOn(component.endVerification, 'emit');
                de.query(By.css(endVerificationButtonSelector)).nativeElement.click();
              });

              it('should notify to the parent that the verification ends ', () => {
                expect(component.endVerification.emit).toHaveBeenCalledTimes(1);
                expect(component.endVerification.emit).toHaveBeenCalledWith(MOCK_KYC_IMAGES_BASE_64_BACK_NULL);
              });
            });
          });

          describe('and the user go back', () => {
            beforeEach(() => {
              de.query(By.css(backButtonSelector)).nativeElement.click();
            });

            it('should emit the go back action to the parent', () => {
              expect(component.goBack.emit).toHaveBeenCalledTimes(1);
            });
          });
        });
      });

      describe('and the user denied the permission', () => {
        beforeEach(() => {
          videoStreamSubjectMock.next(throwError('denied'));
          videoPermissionsSubjectMock.next(VIDEO_PERMISSIONS_STATUS.DENIED);

          fixture.detectChanges();
        });

        it('should set the user permissions as denied', () => {
          let videoPermissions: VIDEO_PERMISSIONS_STATUS;

          component.videoPermissions$.subscribe((permissions: VIDEO_PERMISSIONS_STATUS) => {
            videoPermissions = permissions;
          });

          expect(videoPermissions).toBe(VIDEO_PERMISSIONS_STATUS.DENIED);
        });

        it('should show an error banner', () => {
          const banner = de.query(By.directive(BannerComponent));
          expect(banner).toBeTruthy();
        });
      });

      describe('and a problem other than permit rejection occurs', () => {
        beforeEach(() => {
          videoStreamSubjectMock.next(throwError('Generic Error'));
          videoPermissionsSubjectMock.next(VIDEO_PERMISSIONS_STATUS.CANNOT_ACCESS);

          fixture.detectChanges();
        });

        it('should set the user permissions as cannot access', () => {
          let videoPermissions: VIDEO_PERMISSIONS_STATUS;

          component.videoPermissions$.subscribe((permissions: VIDEO_PERMISSIONS_STATUS) => {
            videoPermissions = permissions;
          });

          expect(videoPermissions).toBe(VIDEO_PERMISSIONS_STATUS.CANNOT_ACCESS);
        });

        it('should show an error banner', () => {
          const banner = de.query(By.directive(BannerComponent));
          expect(banner).toBeTruthy();
        });
      });
    });

    describe(`and the user's browser does NOT support the API`, () => {
      beforeEach(() => {
        videoStreamSubjectMock.next(throwError('Not Allowed'));
        videoPermissionsSubjectMock.next(VIDEO_PERMISSIONS_STATUS.CANNOT_ACCESS);

        fixture.detectChanges();
      });

      it('should set the user permissions as cannot access', () => {
        let videoPermissions: VIDEO_PERMISSIONS_STATUS;

        component.videoPermissions$.subscribe((permissions: VIDEO_PERMISSIONS_STATUS) => {
          videoPermissions = permissions;
        });

        expect(videoPermissions).toBe(VIDEO_PERMISSIONS_STATUS.CANNOT_ACCESS);
      });

      it('should show an error banner', () => {
        const banner = de.query(By.directive(BannerComponent));
        expect(banner).toBeTruthy();
      });
    });
  });

  describe('when the user selects the upload image method', () => {
    beforeEach(() => {
      spyOn(kycTrackingEventsService, 'trackViewKYCReviewDocumentationImageScreen');
      spyOn(requestVideoPermissionsService, 'startStream');
      testComponent.takeImageMethod = KYC_TAKE_IMAGE_OPTIONS.UPLOAD;
    });

    it('should NOT show the loading status', () => {
      expectShouldShowLoadingStatus(false);
    });

    it('should NOT request video access', () => {
      fixture.detectChanges();

      expect(requestVideoPermissionsService.startStream).not.toHaveBeenCalled();
    });

    it('should show the camera block', () => {
      fixture.detectChanges();

      expectImageBlockHiddenInDOM(false);
    });

    it('should NOT show the user video', () => {
      fixture.detectChanges();

      expectVideoInDOM(false);
    });

    it('should NOT show an error banner', () => {
      fixture.detectChanges();

      const banner = de.query(By.directive(BannerComponent));
      expect(banner).toBeFalsy();
    });

    it('should render the input upload image ', () => {
      fixture.detectChanges();

      expectUploadImageInDOM(true);
    });

    describe('and the user must provide two images of the document', () => {
      beforeEach(() => {
        testComponent.imagesNeeded = 2;
      });

      describe('and we are on the front side image step', () => {
        it('should show the continue verification button', () => {
          fixture.detectChanges();

          expectContinueButtonInDOM(true);
        });

        it('should NOT show the end verification button', () => {
          fixture.detectChanges();

          expectEndVerificationButtonInDOM(false);
        });

        describe('and the front side image is not defined', () => {
          beforeEach(() => {
            component.images$.next(MOCK_EMPTY_KYC_IMAGES);

            fixture.detectChanges();
          });

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

          it('should show the correct take image message in the button', () => {
            const expectedMessage = $localize`:@@kyc_take_photo_view_if_two_sides_front_side_photo_button:Take front side photo`;
            expectTakeImageButtonCorrectMessage(expectedMessage);
          });

          it('should NOT show the retake image button', () => {
            expectRetakeImageButtonInDOM(false);
          });

          it('should show the fallback upload image section', () => {
            expectUploadImageFallbackContentInDOM(true);
          });

          it('should NOT show the image', () => {
            expectUploadImageDefinedContentInDOM(false);
          });

          it('should disable the continue button', () => {
            expectContinueButtonDisabled(true);
          });

          describe('and they click on the upload front side image button', () => {
            beforeEach(() => {
              spyOn(de.query(By.css(uploadImageSelector)).nativeElement, 'click');

              de.query(By.css(takeImageButtonSelector)).nativeElement.click();
            });

            it('should open the input file upload', () => {
              expect(de.query(By.css(uploadImageSelector)).nativeElement.click).toHaveBeenCalledTimes(1);
            });

            describe('and the user selects a front side image', () => {
              beforeEach(() => {
                triggerChangeImageUpload(true);

                fixture.detectChanges();
              });

              it('should show the updated image on the screen', () => {
                const imageContainer: HTMLElement = fixture.debugElement.query(By.css(uploadImageDefinedContentSelector)).nativeElement;
                const selectedImage = MOCK_JPEG_IMG_EVENT().target.result;

                expect(imageContainer.style['background-image']).toStrictEqual('url(' + selectedImage + ')');
              });

              it('should NOT show the fallback upload image section', () => {
                expectUploadImageFallbackContentInDOM(false);
              });

              it('should track the view KYC review documentation image screen event', () => {
                shouldTrackViewKYCReviewDocumentationImageScreen();
              });

              it('should update the selected image', () => {
                expect(component.images$.value).toStrictEqual({
                  ...component.images$.value,
                  frontSide: MOCK_BASE_64_SMALL_IMAGE,
                });
              });
            });

            describe('and the user NOT selects a front side image', () => {
              beforeEach(() => {
                triggerChangeImageUpload(false);

                fixture.detectChanges();
              });

              it('should NOT show the defined front side image', () => {
                expectUploadImageDefinedContentInDOM(false);
              });

              it('should show the fallback upload image section', () => {
                expectUploadImageFallbackContentInDOM(true);
              });

              it('should NOT track the view KYC review documentation image screen event', () => {
                shouldNotTrackViewKYCReviewDocumentationImageScreen();
              });

              it('should NOT update the images', () => {
                expect(component.images$.value).toStrictEqual(MOCK_EMPTY_KYC_IMAGES);
              });
            });
          });
        });

        describe('and the front side image is defined', () => {
          beforeEach(() => {
            component.images$.next(MOCK_KYC_IMAGES_BASE_64_BACK_NULL);

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

          it('should show the correct retake image message in the button', () => {
            const expectedMessage = $localize`:@@kyc_take_photo_view_if_two_sides_review_front_side_photo_button:Retake front side photo`;
            expectRetakeImageButtonCorrectMessage(expectedMessage);
          });

          it('should NOT show the fallback upload image section', () => {
            expectUploadImageFallbackContentInDOM(false);
          });

          it('should show the front side image on the screen', () => {
            const imageContainer: HTMLElement = fixture.debugElement.query(By.css(uploadImageDefinedContentSelector)).nativeElement;
            const selectedImage = MOCK_KYC_IMAGES_BASE_64_BACK_NULL.frontSide;

            expect(imageContainer.style['background-image']).toStrictEqual('url(' + selectedImage + ')');
          });

          it('should enable the continue button', () => {
            expectContinueButtonDisabled(false);
          });

          it('should track the view KYC review documentation image screen event', () => {
            shouldTrackViewKYCReviewDocumentationImageScreen();
          });

          describe('and they click on retake the front side image', () => {
            beforeEach(() => {
              spyOn(component.uploadImage.nativeElement, 'click');
              de.query(By.css(retakeImageButtonSelector)).nativeElement.click();

              fixture.detectChanges();
            });

            it('should show the fallback upload image section', () => {
              expectUploadImageFallbackContentInDOM(true);
            });

            it('should NOT show the image', () => {
              expectUploadImageDefinedContentInDOM(false);
            });

            it('should remove the front side image', () => {
              expect(component.images$.value).toStrictEqual({
                ...component.images$.value,
                frontSide: null,
              });
            });

            it('should clean the file input value', () => {
              expect(component.uploadImage.nativeElement.value).toBeFalsy();
            });

            it('should open the device folder to update a new image', () => {
              expect(component.uploadImage.nativeElement.click).toHaveBeenCalled();
            });
          });

          describe('and they click on continue verification button', () => {
            beforeEach(() => {
              de.query(By.css(continueVerificationButtonSelector)).nativeElement.click();

              fixture.detectChanges();
            });

            it('should go to take the back side image', () => {
              expect(component.activeStep$.value).toBe(2);
            });

            it('should clean the defined image on the screen', () => {
              expect(component.uploadImage.nativeElement.value).toBeFalsy();
            });
          });
        });

        describe('and the user go back', () => {
          beforeEach(() => {
            spyOn(component.goBack, 'emit');
            de.query(By.css(backButtonSelector)).nativeElement.click();
          });

          it('should emit the go back action to the parent', () => {
            expect(component.goBack.emit).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe('and we are on the back side image step', () => {
        beforeEach(() => {
          component.activeStep$.next(2);
        });

        describe('and the back side image is not defined', () => {
          beforeEach(() => {
            component.images$.next(MOCK_KYC_IMAGES_BASE_64_BACK_NULL);

            fixture.detectChanges();
          });

          it('should NOT show the continue verification button', () => {
            fixture.detectChanges();

            expectContinueButtonInDOM(false);
          });

          it('should show the end verification button', () => {
            fixture.detectChanges();

            expectEndVerificationButtonInDOM(true);
          });

          it('should show the correct title', () => {
            const expectedTitle = $localize`:@@kyc_take_photo_view_if_two_sides_back_side_title:Take a back side photo of your document`;

            expectShowCorrectTitle(expectedTitle);
          });

          it('should show the correct subtitle', () => {
            const expectedSubtitle = $localize`:@@kyc_take_photo_view_if_two_sides_back_side_description:To finish the verification process, you just need to take a photo of the back side of your ID document.`;

            expectShowCorrectSubtitle(expectedSubtitle);
          });

          it('should show the take image button', () => {
            expectTakeImageButtonInDOM(true);
          });

          it('should show the correct take image message in the button', () => {
            const expectedMessage = $localize`:@@kyc_take_photo_view_if_two_sides_back_side_continue_button:Take back side photo`;
            expectTakeImageButtonCorrectMessage(expectedMessage);
          });

          it('should NOT show the retake image button', () => {
            expectRetakeImageButtonInDOM(false);
          });

          it('should show the fallback upload image section', () => {
            expectUploadImageFallbackContentInDOM(true);
          });

          it('should NOT show the defined back side image', () => {
            expectUploadImageDefinedContentInDOM(false);
          });

          it('should disable the end verification button', () => {
            expectEndVerificationButtonDisabled(true);
          });

          describe('and they click on the upload back side image button', () => {
            beforeEach(() => {
              spyOn(de.query(By.css(uploadImageSelector)).nativeElement, 'click');

              de.query(By.css(takeImageButtonSelector)).nativeElement.click();
            });

            it('should open the input file upload', () => {
              expect(de.query(By.css(uploadImageSelector)).nativeElement.click).toHaveBeenCalledTimes(1);
            });

            describe('and the user selects a back side image', () => {
              beforeEach(() => {
                triggerChangeImageUpload(true);

                fixture.detectChanges();
              });

              it('should show the updated image on the screen', () => {
                const imageContainer: HTMLElement = fixture.debugElement.query(By.css(uploadImageDefinedContentSelector)).nativeElement;
                const selectedImage = MOCK_JPEG_IMG_EVENT().target.result;

                expect(imageContainer.style['background-image']).toStrictEqual('url(' + selectedImage + ')');
              });

              it('should NOT show the fallback upload image section', () => {
                expectUploadImageFallbackContentInDOM(false);
              });

              it('should track the view KYC review documentation image screen event', () => {
                shouldTrackViewKYCReviewDocumentationImageScreen();
              });

              it('should update the selected image', () => {
                expect(component.images$.value).toStrictEqual({
                  ...component.images$.value,
                  backSide: MOCK_BASE_64_SMALL_IMAGE,
                });
              });
            });

            describe('and the user NOT selects a back side image', () => {
              beforeEach(() => {
                triggerChangeImageUpload(false);

                fixture.detectChanges();
              });

              it('should NOT show the defined back side image', () => {
                expectUploadImageDefinedContentInDOM(false);
              });

              it('should show the fallback upload image section', () => {
                expectUploadImageFallbackContentInDOM(true);
              });

              it('should NOT track the view KYC review documentation image screen event', () => {
                shouldNotTrackViewKYCReviewDocumentationImageScreen();
              });

              it('should NOT update the images', () => {
                expect(component.images$.value).toStrictEqual(MOCK_KYC_IMAGES_BASE_64_BACK_NULL);
              });
            });
          });
        });

        describe('and the back side image is defined', () => {
          beforeEach(() => {
            component.images$.next(MOCK_KYC_IMAGES_BASE_64);

            fixture.detectChanges();
          });

          it('should show the correct title', () => {
            const expectedTitle = $localize`:@@kyc_take_photo_view_if_two_sides_review_back_side_title:Check the photo of the back side of your document`;

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

          it('should show the correct retake image message in the button', () => {
            const expectedMessage = $localize`:@@kyc_take_photo_view_if_two_sides_review_back_side_photo_button:Retake back side photo`;
            expectRetakeImageButtonCorrectMessage(expectedMessage);
          });

          it('should NOT show the fallback upload image section', () => {
            expectUploadImageFallbackContentInDOM(false);
          });

          it('should show the back side image on the screen', () => {
            const imageContainer: HTMLElement = fixture.debugElement.query(By.css(uploadImageDefinedContentSelector)).nativeElement;
            const selectedImage = MOCK_KYC_IMAGES_BASE_64.backSide;

            expect(imageContainer.style['background-image']).toStrictEqual('url(' + selectedImage + ')');
          });

          it('should enable the end verification button', () => {
            expectEndVerificationButtonDisabled(false);
          });

          it('should track the view KYC review documentation image screen event', () => {
            shouldTrackViewKYCReviewDocumentationImageScreen();
          });

          describe('and they click on retake the back side image', () => {
            beforeEach(() => {
              spyOn(component.uploadImage.nativeElement, 'click');
              de.query(By.css(retakeImageButtonSelector)).nativeElement.click();

              fixture.detectChanges();
            });

            it('should show the fallback upload image section', () => {
              expectUploadImageFallbackContentInDOM(true);
            });

            it('should NOT show the image', () => {
              expectUploadImageDefinedContentInDOM(false);
            });

            it('should remove the back side image', () => {
              expect(component.images$.value).toStrictEqual({
                ...component.images$.value,
                backSide: null,
              });
            });

            it('should clean the file input value', () => {
              expect(component.uploadImage.nativeElement.value).toBeFalsy();
            });

            it('should open the device folder to update a new image', () => {
              expect(component.uploadImage.nativeElement.click).toHaveBeenCalled();
            });
          });

          describe('and they click on end verification button', () => {
            beforeEach(() => {
              spyOn(component.endVerification, 'emit');
              de.query(By.css(endVerificationButtonSelector)).nativeElement.click();
            });

            it('should notify to the parent that the verification ends ', () => {
              expect(component.endVerification.emit).toHaveBeenCalledTimes(1);
              expect(component.endVerification.emit).toHaveBeenCalledWith(MOCK_KYC_IMAGES_BASE_64);
            });
          });
        });

        describe('and the user go back', () => {
          beforeEach(() => {
            fixture.detectChanges();

            de.query(By.css(backButtonSelector)).nativeElement.click();
          });

          it('should clean the images', () => {
            expect(component.images$.value).toStrictEqual({
              frontSide: null,
              backSide: null,
            });
          });

          it('should go to the define first image step', () => {
            expect(component.activeStep$.value).toBe(1);
          });
        });
      });
    });

    describe('and the user must provide ONLY one image of the document', () => {
      beforeEach(() => {
        testComponent.imagesNeeded = 1;
        component.images$.next(MOCK_EMPTY_KYC_IMAGES);
      });

      it('should NOT show the continue verification button', () => {
        fixture.detectChanges();

        expectContinueButtonInDOM(false);
      });

      it('should show the end verification button', () => {
        fixture.detectChanges();

        expectEndVerificationButtonInDOM(true);
      });

      describe('and the image is not defined', () => {
        beforeEach(() => {
          fixture.detectChanges();
        });

        it('should show the correct title', () => {
          const expectedTitle = $localize`:@@kyc_take_photo_view_if_one_side_title:Take a photo of your document`;

          expectShowCorrectTitle(expectedTitle);
        });

        it('should show the correct subtitle', () => {
          const expectedSubtitle = $localize`:@@kyc_take_photo_view_if_one_side_description:Go somewhere with good lighting and take the photo. Make sure the document you provide is valid for at least 3 months.`;

          expectShowCorrectSubtitle(expectedSubtitle);
        });

        it('should show the take image button', () => {
          expectTakeImageButtonInDOM(true);
        });

        it('should show the correct take image message in the button', () => {
          const expectedMessage = $localize`:@@kyc_take_photo_view_if_one_side_take_photo_button:Take photo`;
          expectTakeImageButtonCorrectMessage(expectedMessage);
        });

        it('should NOT show the retake image button', () => {
          expectRetakeImageButtonInDOM(false);
        });

        it('should show the fallback upload image section', () => {
          expectUploadImageFallbackContentInDOM(true);
        });

        it('should NOT show the image', () => {
          expectUploadImageDefinedContentInDOM(false);
        });

        it('should disable the end verification button', () => {
          expectEndVerificationButtonDisabled(true);
        });

        describe('and they click on the upload front side image button', () => {
          beforeEach(() => {
            spyOn(de.query(By.css(uploadImageSelector)).nativeElement, 'click');

            de.query(By.css(takeImageButtonSelector)).nativeElement.click();
          });

          it('should open the input file upload', () => {
            expect(de.query(By.css(uploadImageSelector)).nativeElement.click).toHaveBeenCalledTimes(1);
          });

          describe('and the user selects a front side image', () => {
            beforeEach(() => {
              triggerChangeImageUpload(true);

              fixture.detectChanges();
            });

            it('should show the updated image on the screen', () => {
              const imageContainer: HTMLElement = fixture.debugElement.query(By.css(uploadImageDefinedContentSelector)).nativeElement;
              const selectedImage = MOCK_JPEG_IMG_EVENT().target.result;

              expect(imageContainer.style['background-image']).toStrictEqual('url(' + selectedImage + ')');
            });

            it('should NOT show the fallback upload image section', () => {
              expectUploadImageFallbackContentInDOM(false);
            });

            it('should track the view KYC review documentation image screen event', () => {
              shouldTrackViewKYCReviewDocumentationImageScreen();
            });

            it('should update the selected image', () => {
              expect(component.images$.value).toStrictEqual({
                ...component.images$.value,
                frontSide: MOCK_BASE_64_SMALL_IMAGE,
              });
            });
          });

          describe('and the user NOT selects a front side image', () => {
            beforeEach(() => {
              triggerChangeImageUpload(false);

              fixture.detectChanges();
            });

            it('should NOT show the defined front side image', () => {
              expectUploadImageDefinedContentInDOM(false);
            });

            it('should show the fallback upload image section', () => {
              expectUploadImageFallbackContentInDOM(true);
            });

            it('should NOT track the view KYC review documentation image screen event', () => {
              shouldNotTrackViewKYCReviewDocumentationImageScreen();
            });

            it('should NOT update the images', () => {
              expect(component.images$.value).toStrictEqual(MOCK_EMPTY_KYC_IMAGES);
            });
          });
        });
      });

      describe('and the image is defined', () => {
        beforeEach(() => {
          component.images$.next(MOCK_KYC_IMAGES_BASE_64_BACK_NULL);

          fixture.detectChanges();
        });

        it('should show the correct title', () => {
          const expectedTitle = $localize`:@@kyc_take_photo_view_if_one_side_review_title:Check the photo of your document`;

          expectShowCorrectTitle(expectedTitle);
        });

        it('should show the correct subtitle', () => {
          const expectedSubtitle = $localize`:@@kyc_take_photo_view_if_one_side_review_description:All the details on your document must be clear and perfectly legible.`;

          expectShowCorrectSubtitle(expectedSubtitle);
        });

        it('should NOT show the take image button', () => {
          expectTakeImageButtonInDOM(false);
        });

        it('should show the retake image button', () => {
          expectRetakeImageButtonInDOM(true);
        });

        it('should show the correct retake image message in the button', () => {
          const expectedMessage = $localize`:@@kyc_take_photo_view_if_one_side_review_retake_photo_button:Retake photo`;
          expectRetakeImageButtonCorrectMessage(expectedMessage);
        });

        it('should NOT show the fallback upload image section', () => {
          expectUploadImageFallbackContentInDOM(false);
        });

        it('should show the front side image on the screen', () => {
          const imageContainer: HTMLElement = fixture.debugElement.query(By.css(uploadImageDefinedContentSelector)).nativeElement;
          const selectedImage = MOCK_KYC_IMAGES_BASE_64_BACK_NULL.frontSide;

          expect(imageContainer.style['background-image']).toStrictEqual('url(' + selectedImage + ')');
        });

        it('should enable the end verification button', () => {
          expectEndVerificationButtonDisabled(false);
        });

        it('should track the view KYC review documentation image screen event', () => {
          shouldTrackViewKYCReviewDocumentationImageScreen();
        });

        describe('and they click on retake the front side image', () => {
          beforeEach(() => {
            spyOn(component.uploadImage.nativeElement, 'click');
            de.query(By.css(retakeImageButtonSelector)).nativeElement.click();

            fixture.detectChanges();
          });

          it('should show the fallback upload image section', () => {
            expectUploadImageFallbackContentInDOM(true);
          });

          it('should NOT show the image', () => {
            expectUploadImageDefinedContentInDOM(false);
          });

          it('should remove the front side image', () => {
            expect(component.images$.value).toStrictEqual({
              ...component.images$.value,
              frontSide: null,
            });
          });

          it('should clean the file input value', () => {
            expect(component.uploadImage.nativeElement.value).toBeFalsy();
          });

          it('should open the device folder to update a new image', () => {
            expect(component.uploadImage.nativeElement.click).toHaveBeenCalled();
          });
        });

        describe('and they click on end verification button', () => {
          beforeEach(() => {
            spyOn(component.endVerification, 'emit');
            de.query(By.css(endVerificationButtonSelector)).nativeElement.click();
          });

          it('should notify to the parent that the verification ends ', () => {
            expect(component.endVerification.emit).toHaveBeenCalledTimes(1);
            expect(component.endVerification.emit).toHaveBeenCalledWith(MOCK_KYC_IMAGES_BASE_64_BACK_NULL);
          });
        });
      });

      describe('and the user go back', () => {
        beforeEach(() => {
          spyOn(component.goBack, 'emit');
          de.query(By.css(backButtonSelector)).nativeElement.click();
        });

        it('should emit the go back action to the parent', () => {
          expect(component.goBack.emit).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('ngOnDestroy', () => {
    describe('and the user video is active', () => {
      beforeEach(() => {
        testComponent.takeImageMethod = KYC_TAKE_IMAGE_OPTIONS.SHOOT;
        videoStreamSubjectMock.next(MOCK_MEDIA_STREAM);
        videoPermissionsSubjectMock.next(VIDEO_PERMISSIONS_STATUS.ACCEPTED);

        fixture.detectChanges();
      });

      it('should stop all the active track', () => {
        component.ngOnDestroy();

        expectAllTracksHaveBeenStopped();
      });
    });
  });

  function expectShowCorrectTitle(expectedTitle: string): void {
    expect(de.nativeElement.querySelector('.KYCUploadImages__title').innerHTML).toEqual(expectedTitle);
  }

  function expectShowCorrectSubtitle(expectedSubtitle: string) {
    expect(de.nativeElement.querySelector('.KYCUploadImages__subtitle').innerHTML).toEqual(expectedSubtitle);
  }

  function expectTakeImageButtonCorrectMessage(expectedMessage: string): void {
    const button: HTMLElement = de.query(By.css(takeImageButtonSelector)).nativeElement;

    expect(button.textContent).toEqual(expectedMessage);
  }

  function expectRetakeImageButtonCorrectMessage(expectedMessage: string): void {
    const button: HTMLElement = de.query(By.css(retakeImageButtonSelector)).nativeElement;

    expect(button.textContent).toEqual(expectedMessage);
  }

  function expectDefinedImageInDOM(expectIsDefined: boolean): void {
    const definedImage = de.query(By.css(definedImageSelector)).classes;

    expectIsDefined ? expect(definedImage).not.toHaveProperty('d-none', true) : expect(definedImage).toHaveProperty('d-none', true);
  }

  function expectVideoInDOM(expectIsDefined: boolean): void {
    const userSideImage = de.query(By.css(userVideoSelector));

    expectIsDefined ? expect(userSideImage).toBeTruthy() : expect(userSideImage).toBeFalsy();
  }

  function expectVideoHiddenInDom(expectIsHidden: boolean): void {
    const userSideImage = de.query(By.css(userVideoSelector)).classes;

    expectIsHidden ? expect(userSideImage).toHaveProperty('d-none', true) : expect(userSideImage).not.toHaveProperty('d-none', true);
  }

  function expectEndVerificationButtonInDOM(expectIsDefined: boolean): void {
    const endVerificationButton = de.query(By.css(endVerificationButtonSelector));

    expectIsDefined ? expect(endVerificationButton).toBeTruthy() : expect(endVerificationButton).toBeFalsy();
  }

  function expectContinueButtonInDOM(expectIsDefined: boolean): void {
    const continueButton = de.query(By.css(continueVerificationButtonSelector));

    expectIsDefined ? expect(continueButton).toBeTruthy() : expect(continueButton).toBeFalsy();
  }

  function expectContinueButtonDisabled(expectIsDisabled: boolean): void {
    const continueButton = de.query(By.css(continueVerificationButtonSelector)).componentInstance;

    expect(continueButton.disabled).toBe(expectIsDisabled);
  }

  function expectEndVerificationButtonDisabled(expectIsDisabled: boolean): void {
    const endVerificationButton = de.query(By.css(endVerificationButtonSelector)).componentInstance;

    expect(endVerificationButton.disabled).toBe(expectIsDisabled);
  }

  function expectTakeImageButtonInDOM(expectIsDefined: boolean): void {
    const takeImageButton = de.query(By.css(takeImageButtonSelector));

    expectIsDefined ? expect(takeImageButton).toBeTruthy() : expect(takeImageButton).toBeFalsy();
  }

  function expectRetakeImageButtonInDOM(expectIsDefined: boolean): void {
    const retakeImageButton = de.query(By.css(retakeImageButtonSelector));

    expectIsDefined ? expect(retakeImageButton).toBeTruthy() : expect(retakeImageButton).toBeFalsy();
  }

  function expectImageBlockHiddenInDOM(expectIsHidden: boolean): void {
    const imageBlock = de.query(By.css(imageBlockSelector)).classes;

    expectIsHidden ? expect(imageBlock).toHaveProperty('d-none', true) : expect(imageBlock).not.toHaveProperty('d-none', true);
  }

  function expectUploadImageInDOM(expectInDOM: boolean): void {
    const uploadImage = de.query(By.css(uploadImageSelector));

    expectInDOM ? expect(uploadImage).toBeTruthy() : expect(uploadImage).toBeFalsy();
  }

  function expectUploadImageFallbackContentInDOM(expectInDOM: boolean): void {
    const uploadImageFallbackContent = de.query(By.css('#uploadImageFallbackContent'));

    expectInDOM ? expect(uploadImageFallbackContent).toBeTruthy() : expect(uploadImageFallbackContent).toBeFalsy();
  }

  function expectUploadImageDefinedContentInDOM(expectInDOM: boolean): void {
    const uploadImageDefinedContent = de.query(By.css(uploadImageDefinedContentSelector));

    expectInDOM ? expect(uploadImageDefinedContent).toBeTruthy() : expect(uploadImageDefinedContent).toBeFalsy();
  }

  function triggerChangeImageUpload(isImageSelected: boolean): void {
    const MOCK_EVENT = isImageSelected ? MOCK_JPEG_IMG_EVENT() : MOCK_WITHOUT_JPEG_IMG_EVENT();
    spyOn(Image.prototype, 'addEventListener').and.callFake((p1, callback) => callback());
    spyOn(FileReader.prototype, 'addEventListener').and.callFake((p1, callback) => callback(MOCK_EVENT));

    de.query(By.css(uploadImageSelector)).triggerEventHandler('change', MOCK_EVENT);
  }

  function expectShouldShowLoadingStatus(expectInDOM: boolean): void {
    const loading = de.query(By.css(loadingBlockSelector));

    expectInDOM ? expect(loading).toBeTruthy() : expect(loading).toBeFalsy();
  }

  function mockSrcObjectInHTMLVideoElement(): void {
    Object.defineProperty(window.HTMLVideoElement.prototype, 'srcObject', {
      set(mediaStream) {
        srcObjectMock.next(mediaStream);
      },
    });
  }

  function expectAllTracksHaveBeenStopped(): void {
    requestVideoPermissionsService.videoStream$.subscribe((tracks) => {
      tracks.getTracks().forEach((track) => expect(track.stop).toHaveBeenCalled());
    });
  }

  function shouldTrackViewKYCReviewDocumentationImageScreen(): void {
    expect(kycTrackingEventsService.trackViewKYCReviewDocumentationImageScreen).toHaveBeenCalledWith(
      component.documentationSelected.analyticsName
    );
    expect(kycTrackingEventsService.trackViewKYCReviewDocumentationImageScreen).toHaveBeenCalledTimes(1);
  }

  function shouldNotTrackViewKYCReviewDocumentationImageScreen(): void {
    expect(kycTrackingEventsService.trackViewKYCReviewDocumentationImageScreen).not.toHaveBeenCalled();
  }
});
