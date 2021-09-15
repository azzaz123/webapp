import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  AfterViewInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { KYCImagesNeeded } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
import { KYCImages, KYC_IMAGES } from '@private/features/wallet/interfaces/kyc/kyc-images.interface';
import { BANNER_TYPES } from '@shared/banner/banner-types.enum';
import { MIME_TYPES } from '@shared/enums/mime-types.enum';
import { RequestVideoPermissionsService } from '@shared/services/video/request-video-permissions/request-video-permissions.service';
import { VIDEO_PERMISSIONS_STATUS } from '@shared/services/video/request-video-permissions/video-permissions-status.interface';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KYC_TAKE_IMAGE_OPTIONS } from '../kyc-image-options/kyc-image-options.enum';

@Component({
  selector: 'tsl-kyc-upload-images',
  templateUrl: './kyc-upload-images.component.html',
  styleUrls: ['./kyc-upload-images.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KYCUploadImagesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('userVideo') userVideo: ElementRef;
  @ViewChild('definedImage') definedImageCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('uploadImage') uploadImage: ElementRef<HTMLInputElement>;

  @Input() imagesNeeded: KYCImagesNeeded;
  @Input() takeImageMethod: KYC_TAKE_IMAGE_OPTIONS;
  @Input() headerText: string;

  @Output() endVerification: EventEmitter<KYCImages> = new EventEmitter();
  @Output() goBack: EventEmitter<void> = new EventEmitter();

  public readonly MIME_TYPES = MIME_TYPES;
  public readonly VIDEO_PERMISSIONS_STATUS = VIDEO_PERMISSIONS_STATUS;
  public readonly errorBannerSpecifications: NgbAlertConfig = {
    type: BANNER_TYPES.DANGER,
    dismissible: false,
  };

  public readonly activeStep$: BehaviorSubject<KYCImagesNeeded> = new BehaviorSubject<KYCImagesNeeded>(1);
  public readonly images$: BehaviorSubject<KYCImages> = new BehaviorSubject<KYCImages>({
    frontSide: null,
    backSide: null,
  });

  public title$: Observable<string> = this.buildTitleObservable();
  public subtitle$: Observable<string> = this.buildSubtitleObservable();
  public takeImageMessage$: Observable<string> = this.buildTakeImageMessageObservable();
  public retakeImageMessage$: Observable<string> = this.buildRetakeImageMessageObservable();

  public videoPermissions$: Observable<VIDEO_PERMISSIONS_STATUS> = this.buildVideoPermissionsObservable();
  public videoStream$: Observable<MediaStream | null>;

  public showImageBlock$: Observable<boolean> = this.buildShowImageBlockObservable();
  public showCameraSvg$: Observable<boolean> = this.buildShowCameraSvgObservable();
  public showTakeImageButton$: Observable<boolean> = this.buildShowTakeImageButtonObservable();
  public showRetakeImageButton$: Observable<boolean> = this.buildShowRetakeImageButtonObservable();
  public isContinueButtonActive$: Observable<boolean> = this.buildIsContinueButtonActiveObservable();
  public isEndVerificationButtonActive$: Observable<boolean> = this.buildIsEndVerificationButtonActiveObservable();
  public isCurrentImageDefined$: Observable<boolean> = this.buildIsCurrentImageDefinedObservable();
  public showEndVerificationButton$: Observable<boolean> = this.buildShowEndVerificationButtonObservable();
  public showContinueButton$: Observable<boolean> = this.buildShowContinueButtonObservable();

  constructor(private requestVideoPermissionsService: RequestVideoPermissionsService) {}

  ngAfterViewInit(): void {
    if (this.isShootImageMethod) {
      this.requestVideoStream();
    }
  }

  ngOnDestroy(): void {
    const videoStream = this.userVideo?.nativeElement?.srcObject;

    if (videoStream) {
      this.endVideoStreamTracking(videoStream);
    }
  }

  public get isShootImageMethod(): boolean {
    return this.takeImageMethod === KYC_TAKE_IMAGE_OPTIONS.SHOOT;
  }

  public goToDefineBackImage(): void {
    this.activeStep$.next(2);
    this.clearImageInput();
  }

  public uploadOrShootImage(): void {
    if (this.isUploadImageMethod) {
      this.uploadImage.nativeElement.click();
    } else {
      this.takeImage();
    }
  }

  public defineImage(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const imageSide = !this.isFrontSideImageDefined ? KYC_IMAGES.FRONT_SIDE : KYC_IMAGES.BACK_SIDE;

    this.uploadImageAndUpdateIt(file, imageSide);
  }

  public handleBack(): void {
    const activeStep: KYCImagesNeeded = this.activeStep$.value;

    if (activeStep === 2) {
      this.images$.next({
        ...this.images$.value,
        frontSide: null,
        backSide: null,
      });

      this.activeStep$.next(1);
    } else {
      this.goBack.emit();
    }
  }

  public removeCurrentImage(): void {
    const activeStep = this.activeStep$.value;

    if (activeStep === 1) {
      this.updateFrontSideImage(null);
    } else {
      this.updateBackSideImage(null);
    }

    if (this.isUploadImageMethod) {
      this.clearImageInput();
      this.uploadImage.nativeElement.click();
    }
  }

  public emitEndVerification(): void {
    this.endVerification.emit(this.images$.value);
  }

  private get twoImagesNeeded(): boolean {
    return this.imagesNeeded === 2;
  }

  private get isUploadImageMethod(): boolean {
    return this.takeImageMethod === KYC_TAKE_IMAGE_OPTIONS.UPLOAD;
  }

  private get isFrontSideImageDefined(): boolean {
    return !!this.images$.value.frontSide;
  }

  private checkIfCurrentImageIsDefined(images: KYCImages, activeStep: KYCImagesNeeded): boolean {
    if (this.twoImagesNeeded) {
      return activeStep === 1 ? !!images.frontSide : !!images.backSide;
    } else {
      return this.isFrontSideImageDefined;
    }
  }

  private requestVideoStream(): void {
    this.requestVideoPermissionsService.request().subscribe((stream: MediaStream) => {
      this.userVideo.nativeElement.srcObject = stream;
    });
  }

  private uploadImageAndUpdateIt(file: File, imageSide: KYC_IMAGES): void {
    if (file.type.match(this.MIME_TYPES.IMAGE_JPEG)) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', (evt: ProgressEvent<FileReader>) => this.handleUploadedImage(evt, imageSide));
    }
  }

  private handleUploadedImage(evt: ProgressEvent<FileReader>, imageSide: KYC_IMAGES): void {
    const imageContainer = this.definedImageCanvas.nativeElement;
    const isFileReaderDone = evt.target.readyState === FileReader.DONE;
    const { result: base64Image } = evt.target;
    const img = new Image();

    if (isFileReaderDone && typeof base64Image === 'string') {
      img.src = base64Image;
      img.addEventListener('load', () => this.drawImageInCanvas(imageContainer, img));

      if (imageSide === KYC_IMAGES.FRONT_SIDE) {
        this.updateFrontSideImage(base64Image);
      } else {
        this.updateBackSideImage(base64Image);
      }
    }
  }

  private takeImage(): void {
    const imageContainer = this.definedImageCanvas.nativeElement;

    this.drawImageInCanvas(imageContainer, this.userVideo.nativeElement);
    this.updateImages(imageContainer.toDataURL(this.MIME_TYPES.IMAGE_JPEG, 1));
  }

  private drawImageInCanvas(imageContainer: HTMLCanvasElement, img: HTMLImageElement): void {
    imageContainer.getContext('2d').drawImage(img, 0, 0, imageContainer.width, imageContainer.height);
  }

  private clearImageInput(): void {
    this.uploadImage.nativeElement.value = null;
  }

  private updateImages(newImage: string): void {
    if (this.isFrontSideImageDefined) {
      this.updateBackSideImage(newImage);
    } else {
      this.updateFrontSideImage(newImage);
    }
  }

  private updateFrontSideImage(newImage: string): void {
    this.images$.next({
      ...this.images$.value,
      frontSide: newImage,
    });
  }

  private updateBackSideImage(newImage: string): void {
    this.images$.next({
      ...this.images$.value,
      backSide: newImage,
    });
  }

  private endVideoStreamTracking(videoStream: MediaStream): void {
    if (videoStream.getTracks) {
      this.userVideo.nativeElement.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
    }

    this.userVideo.nativeElement.srcObject = null;
  }

  private buildIsContinueButtonActiveObservable(): Observable<boolean> {
    return this.images$.pipe(map((images: KYCImages) => this.twoImagesNeeded && !!images.frontSide && !images.backSide));
  }

  private buildIsEndVerificationButtonActiveObservable(): Observable<boolean> {
    return this.images$.pipe(
      map((images: KYCImages) => {
        const firstImage = images.frontSide;
        const secondImage = images.backSide;
        const definedImages = firstImage && secondImage ? 2 : !firstImage && !secondImage ? 0 : 1;

        return definedImages === this.imagesNeeded;
      })
    );
  }

  private buildTitleObservable(): Observable<string> {
    return this.imagesAndActiveStep$().pipe(
      map(([images, activeStep]: [KYCImages, KYCImagesNeeded]) => {
        const isDefined = this.checkIfCurrentImageIsDefined(images, activeStep);

        if (this.twoImagesNeeded) {
          if (isDefined) {
            return activeStep === 1
              ? $localize`:@@kyc_take_photo_view_if_two_sides_review_front_side_title:Check the photo of the front side of your document`
              : $localize`:@@kyc_take_photo_view_if_two_sides_review_back_side_title:Check the photo of the back side of your document`;
          } else {
            return activeStep === 1
              ? $localize`:@@kyc_take_photo_view_if_two_sides_front_side_title:Take a photo of the front side of your ID document`
              : $localize`:@@kyc_take_photo_view_if_two_sides_back_side_title:Take a back side photo of your document`;
          }
        } else {
          return isDefined
            ? $localize`:@@kyc_take_photo_view_if_one_side_review_title:Check the photo of your document`
            : $localize`:@@kyc_take_photo_view_if_one_side_title:Take a photo of your document`;
        }
      })
    );
  }

  private buildSubtitleObservable(): Observable<string> {
    return this.imagesAndActiveStep$().pipe(
      map(([images, activeStep]: [KYCImages, KYCImagesNeeded]) => {
        const isDefined = this.checkIfCurrentImageIsDefined(images, activeStep);

        if (this.twoImagesNeeded) {
          if (isDefined) {
            return activeStep === 1
              ? $localize`:@@kyc_take_photo_view_if_two_sides_review_front_side_description:All the details on your ID document must be clear and perfectly legible.`
              : $localize`:@@kyc_take_photo_view_if_two_sides_review_back_side_description:All the details on your ID document must be clear and perfectly legible.`;
          } else {
            return activeStep === 1
              ? $localize`:@@kyc_take_photo_view_if_two_sides_front_side_description:Go somewhere with good lighting, focus the camera on the document, and take the best photo possible.`
              : $localize`:@@kyc_take_photo_view_if_two_sides_back_side_description:To finish the verification process, you just need to take a photo of the back side of your ID document.`;
          }
        } else {
          return isDefined
            ? $localize`:@@kyc_take_photo_view_if_one_side_review_description:All the details on your document must be clear and perfectly legible.`
            : $localize`:@@kyc_take_photo_view_if_one_side_description:Go somewhere with good lighting and take the photo. Make sure the document you provide is valid for at least 3 months.`;
        }
      })
    );
  }

  private buildTakeImageMessageObservable(): Observable<string> {
    return this.activeStep$.pipe(
      map((activeStep: KYCImagesNeeded) => {
        if (this.twoImagesNeeded) {
          return activeStep === 1
            ? $localize`:@@kyc_take_photo_view_if_two_sides_front_side_photo_button:Take front side photo`
            : $localize`:@@kyc_take_photo_view_if_two_sides_back_side_continue_button:Take back side photo`;
        } else {
          return $localize`:@@kyc_take_photo_view_if_one_side_take_photo_button:Take photo`;
        }
      })
    );
  }

  private buildRetakeImageMessageObservable(): Observable<string> {
    return this.activeStep$.pipe(
      map((activeStep: KYCImagesNeeded) => {
        if (this.twoImagesNeeded) {
          return activeStep === 1
            ? $localize`:@@kyc_take_photo_view_if_two_sides_review_front_side_photo_button:Retake front side photo`
            : $localize`:@@kyc_take_photo_view_if_two_sides_review_back_side_photo_button:Retake back side photo`;
        } else {
          return $localize`:@@kyc_take_photo_view_if_one_side_review_retake_photo_button:Retake photo`;
        }
      })
    );
  }

  private buildVideoPermissionsObservable(): Observable<VIDEO_PERMISSIONS_STATUS> {
    return this.requestVideoPermissionsService.userVideoPermissions$;
  }

  private buildShowEndVerificationButtonObservable(): Observable<boolean> {
    return this.activeStep$.pipe(
      map((activeStep: KYCImagesNeeded) => this.imagesNeeded === 1 || (this.twoImagesNeeded && activeStep === 2))
    );
  }

  private buildShowCameraSvgObservable(): Observable<boolean> {
    return this.imagesAndActiveStep$().pipe(
      map(([images, activeStep]: [KYCImages, KYCImagesNeeded]) => this.checkIfCurrentImageIsDefined(images, activeStep)),
      map((isDefined: boolean) => !isDefined && !this.isShootImageMethod)
    );
  }

  private buildShowTakeImageButtonObservable(): Observable<boolean> {
    return this.imagesAndActiveStep$().pipe(
      map(([images, activeStep]: [KYCImages, KYCImagesNeeded]) => {
        const oneImageNeededAndNotDefined = this.imagesNeeded === 1 && !images.frontSide;
        const firstStepAndFrontSideNotDefined = activeStep === 1 && !images.frontSide;
        const secondStepAndBackSideNotDefined = activeStep === 2 && !images.backSide;

        return (
          oneImageNeededAndNotDefined ||
          (this.twoImagesNeeded && firstStepAndFrontSideNotDefined) ||
          (this.twoImagesNeeded && secondStepAndBackSideNotDefined)
        );
      })
    );
  }

  private buildShowRetakeImageButtonObservable(): Observable<boolean> {
    return this.imagesAndActiveStep$().pipe(
      map(([images, activeStep]: [KYCImages, KYCImagesNeeded]) => {
        const oneImageNeededAndDefined = this.imagesNeeded === 1 && !!images.frontSide;
        const firstStepAndFrontSideDefined = activeStep === 1 && !!images.frontSide;
        const secondStepAndBackSideDefined = activeStep === 2 && !!images.backSide;

        return (
          oneImageNeededAndDefined ||
          (this.twoImagesNeeded && firstStepAndFrontSideDefined) ||
          (this.twoImagesNeeded && secondStepAndBackSideDefined)
        );
      })
    );
  }

  private buildShowContinueButtonObservable(): Observable<boolean> {
    return this.activeStep$.pipe(map((activeStep: KYCImagesNeeded) => this.twoImagesNeeded && activeStep === 1));
  }

  private buildShowImageBlockObservable(): Observable<boolean> {
    return this.requestVideoPermissionsService.userVideoPermissions$.pipe(
      map((videoPermissions: VIDEO_PERMISSIONS_STATUS) => {
        const isLoadingOrAccepted =
          videoPermissions === VIDEO_PERMISSIONS_STATUS.ACCEPTED || videoPermissions === VIDEO_PERMISSIONS_STATUS.LOADING;

        return (isLoadingOrAccepted && this.isShootImageMethod) || this.isUploadImageMethod;
      })
    );
  }

  private buildIsCurrentImageDefinedObservable(): Observable<boolean> {
    return this.imagesAndActiveStep$().pipe(
      map(([images, activeStep]: [KYCImages, KYCImagesNeeded]) => {
        if (this.twoImagesNeeded) {
          return activeStep === 1 ? !!images.frontSide : !!images.backSide;
        } else {
          return this.isFrontSideImageDefined;
        }
      })
    );
  }

  private imagesAndActiveStep$(): Observable<[KYCImages, KYCImagesNeeded]> {
    return combineLatest([this.images$.asObservable(), this.activeStep$.asObservable()]);
  }
}
