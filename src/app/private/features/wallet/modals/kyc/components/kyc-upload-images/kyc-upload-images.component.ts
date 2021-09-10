import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { KYCImagesNeeded } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
import { KYCImages, KYC_IMAGES } from '@private/features/wallet/interfaces/kyc/kyc-images.interface';
import { BANNER_TYPES } from '@shared/banner/banner-types.enum';
import { MIME_TYPES } from '@shared/enums/mime-types.enum';

import { AskPermissionsService } from '@shared/services/ask-permissions/ask-permissions.service';
import { DEVICE_PERMISSIONS_STATUS, UserDevicePermissions } from '@shared/services/ask-permissions/user-device-permissions.interface';
import { Observable } from 'rxjs';
import { KYC_TAKE_IMAGE_OPTIONS } from '../kyc-image-options/kyc-image-options.enum';

@Component({
  selector: 'tsl-kyc-upload-images',
  templateUrl: './kyc-upload-images.component.html',
  styleUrls: ['./kyc-upload-images.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KYCUploadImagesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('userCamera') userCamera: ElementRef;
  @ViewChild('definedImage') definedImageCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('uploadImage') uploadImage: ElementRef<HTMLInputElement>;

  @Input() imagesNeeded: KYCImagesNeeded;
  @Input() takeImageMethod: KYC_TAKE_IMAGE_OPTIONS;
  @Input() images: KYCImages;
  @Input() documentType: string;

  @Output() imagesChange: EventEmitter<KYCImages> = new EventEmitter();
  @Output() endVerification: EventEmitter<void> = new EventEmitter();
  @Output() goBack: EventEmitter<void> = new EventEmitter();

  public userDevicePermissions$: Observable<UserDevicePermissions>;
  public activeStep: KYCImagesNeeded = 1;
  public readonly KYC_IMAGES = KYC_IMAGES;
  public readonly MIME_TYPES = MIME_TYPES;
  public readonly errorBannerSpecifications: NgbAlertConfig = {
    type: BANNER_TYPES.DANGER,
    dismissible: false,
  };

  constructor(private askPermissionsService: AskPermissionsService) {
    this.userDevicePermissions$ = askPermissionsService.userDevicePermissions$;
  }

  ngAfterViewInit(): void {
    if (this.isShootImageMethod) {
      this.requestCameraPermissions();
    }
  }

  ngOnDestroy(): void {
    const cameraStream = this.userCamera?.nativeElement?.srcObject;

    if (cameraStream) {
      this.endCameraStreamTracking(cameraStream);
    }
  }

  public get title(): string {
    if (this.twoImagesNeeded) {
      if (this.isCurrentImageDefined) {
        return this.activeStep === 1
          ? $localize`:@@kyc_take_photo_view_if_two_sides_review_front_side_title:Check the photo of the front side of your document`
          : $localize`:@@kyc_take_photo_view_if_two_sides_review_back_side_title:Check the photo of the back side of your document`;
      } else {
        return this.activeStep === 1
          ? $localize`:@@kyc_take_photo_view_if_two_sides_front_side_title:Take a photo of the front side of your ID document`
          : $localize`:@@kyc_take_photo_view_if_two_sides_back_side_title:Take a back side photo of your document`;
      }
    } else {
      return this.isCurrentImageDefined
        ? $localize`:@@kyc_take_photo_view_if_one_side_review_title:Check the photo of your document`
        : $localize`:@@kyc_take_photo_view_if_one_side_title:Take a photo of your document`;
    }
  }

  public get subtitle(): string {
    if (this.twoImagesNeeded) {
      if (this.isCurrentImageDefined) {
        return this.activeStep === 1
          ? $localize`:@@kyc_take_photo_view_if_two_sides_review_front_side_description:All the details on your ID document must be clear and perfectly legible.`
          : $localize`:@@kyc_take_photo_view_if_two_sides_review_back_side_description:All the details on your ID document must be clear and perfectly legible.`;
      } else {
        return this.activeStep === 1
          ? $localize`:@@kyc_take_photo_view_if_two_sides_front_side_description:Go somewhere with good lighting, focus the camera on the document, and take the best photo possible.`
          : $localize`:@@kyc_take_photo_view_if_two_sides_back_side_description:To finish the verification process, you just need to take a photo of the back side of your ID document.`;
      }
    } else {
      return this.isCurrentImageDefined
        ? $localize`:@@kyc_take_photo_view_if_one_side_review_description:All the details on your document must be clear and perfectly legible.`
        : $localize`:@@kyc_take_photo_view_if_one_side_description:Go somewhere with good lighting and take the photo. Make sure the document you provide is valid for at least 3 months.`;
    }
  }

  public get takeImageMessage(): string {
    if (this.twoImagesNeeded) {
      return this.activeStep === 1
        ? $localize`:@@kyc_take_photo_view_if_two_sides_front_side_photo_button:Take front side photo`
        : $localize`:@@kyc_take_photo_view_if_two_sides_back_side_continue_button:Take back side photo`;
    } else {
      return $localize`:@@kyc_take_photo_view_if_one_side_take_photo_button:Take photo`;
    }
  }

  public get retakeImageMessage(): string {
    if (this.twoImagesNeeded) {
      return this.activeStep === 1
        ? $localize`:@@kyc_take_photo_view_if_two_sides_review_front_side_photo_button:Retake front side photo`
        : $localize`:@@kyc_take_photo_view_if_two_sides_review_back_side_photo_button:Retake back side photo`;
    } else {
      return $localize`:@@kyc_take_photo_view_if_one_side_review_retake_photo_button:Retake photo`;
    }
  }

  public get isCurrentImageDefined(): boolean {
    if (this.twoImagesNeeded) {
      return this.activeStep === 1 ? !!this.images.frontSide : !!this.images.backSide;
    } else {
      return this.isFrontSideImageDefined;
    }
  }

  public get allImagesAreDefined(): boolean {
    return this.definedImages === this.imagesNeeded;
  }

  public get isShootImageMethod(): boolean {
    return this.takeImageMethod === KYC_TAKE_IMAGE_OPTIONS.SHOOT;
  }

  public get showTakeImageButton(): boolean {
    const oneImageNeededAndNotDefined = this.imagesNeeded === 1 && !this.images.frontSide;
    const firstStepAndFrontSideNotDefined = this.activeStep === 1 && !this.images.frontSide;
    const secondStepAndBackSideNotDefined = this.activeStep === 2 && !this.images.backSide;

    return (
      oneImageNeededAndNotDefined ||
      (this.twoImagesNeeded && firstStepAndFrontSideNotDefined) ||
      (this.twoImagesNeeded && secondStepAndBackSideNotDefined)
    );
  }

  public get showEndVerificationButton(): boolean {
    return this.imagesNeeded === 1 || (this.twoImagesNeeded && this.activeStep === 2);
  }

  public get showContinueButton(): boolean {
    return this.twoImagesNeeded && this.activeStep === 1;
  }

  public get showCameraSvg(): boolean {
    return !this.isCurrentImageDefined && !this.isShootImageMethod;
  }

  public get isContinueButtonActive(): boolean {
    return this.twoImagesNeeded && this.images.frontSide && !this.images.backSide;
  }

  public get showRetakeImageButton(): boolean {
    const oneImageNeededAndDefined = this.imagesNeeded === 1 && !!this.images.frontSide;
    const firstStepAndFrontSideDefined = this.activeStep === 1 && !!this.images.frontSide;
    const secondStepAndBackSideDefined = this.activeStep === 2 && !!this.images.backSide;

    return (
      oneImageNeededAndDefined ||
      (this.twoImagesNeeded && firstStepAndFrontSideDefined) ||
      (this.twoImagesNeeded && secondStepAndBackSideDefined)
    );
  }

  public goToDefineBackImage(): void {
    this.activeStep = 2;
    this.clearImageInput();
  }

  public canUploadOrShootImage(userDevicePermissions: UserDevicePermissions): boolean {
    return (this.isShootImageMethod && !this.isErrorBanner(userDevicePermissions.video)) || this.isUploadImageMethod;
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

    this.defineUploadImageAndEmitValue(file, imageSide);
  }

  public requestCameraSucceed(userCameraPermissions: DEVICE_PERMISSIONS_STATUS): boolean {
    return userCameraPermissions === DEVICE_PERMISSIONS_STATUS.ACCEPTED;
  }

  public cameraFailedCopy(userCameraPermissions: DEVICE_PERMISSIONS_STATUS): string {
    return userCameraPermissions === DEVICE_PERMISSIONS_STATUS.DENIED
      ? $localize`:@@kyc_camera_access_refused:You must accept the permissions to be able to take photos`
      : $localize`:@@kyc_camera_cannot_access:Oops, an error occurred and we cannot access your camera`;
  }

  public isErrorBanner(videoPermissionStatus: DEVICE_PERMISSIONS_STATUS): boolean {
    return this.requestCameraFailed(videoPermissionStatus) && this.isShootImageMethod;
  }

  public handleBack(): void {
    this.imagesChange.emit({
      ...this.images,
      frontSide: null,
      backSide: null,
    });

    if (this.activeStep === 2) {
      this.activeStep = 1;
    } else {
      this.goBack.emit();
    }
  }

  public removeCurrentImage(): void {
    if (this.activeStep === 1) {
      this.emitFrontSideImageChange(null);
    } else {
      this.emitBackSideImageChange(null);
    }

    if (this.isUploadImageMethod) {
      this.clearImageInput();
      this.uploadImage.nativeElement.click();
    }
  }

  private get twoImagesNeeded(): boolean {
    return this.imagesNeeded === 2;
  }

  private get isUploadImageMethod(): boolean {
    return this.takeImageMethod === KYC_TAKE_IMAGE_OPTIONS.UPLOAD;
  }

  private get isFrontSideImageDefined(): boolean {
    return !!this.images.frontSide;
  }

  private get definedImages(): number {
    const firstImage = this.images.frontSide;
    const secondImage = this.images.backSide;

    return firstImage && secondImage ? 2 : !firstImage && !secondImage ? 0 : 1;
  }

  private requestCameraFailed(userCameraPermissions: DEVICE_PERMISSIONS_STATUS): boolean {
    return userCameraPermissions === DEVICE_PERMISSIONS_STATUS.DENIED || userCameraPermissions === DEVICE_PERMISSIONS_STATUS.CANNOT_ACCESS;
  }

  private defineUploadImageAndEmitValue(file: File, imageSide: KYC_IMAGES): void {
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
        this.emitFrontSideImageChange(base64Image);
      } else {
        this.emitBackSideImageChange(base64Image);
      }
    }
  }

  private takeImage(): void {
    const imageContainer = this.definedImageCanvas.nativeElement;

    this.drawImageInCanvas(imageContainer, this.userCamera.nativeElement);
    this.emitNewImage(imageContainer.toDataURL(this.MIME_TYPES.IMAGE_JPEG, 1));
  }

  private drawImageInCanvas(imageContainer: HTMLCanvasElement, img: HTMLImageElement): void {
    imageContainer.getContext('2d').drawImage(img, 0, 0, imageContainer.width, imageContainer.height);
  }

  private clearImageInput(): void {
    this.uploadImage.nativeElement.value = null;
  }

  private emitNewImage(newImage: string): void {
    if (this.isFrontSideImageDefined) {
      this.emitBackSideImageChange(newImage);
    } else {
      this.emitFrontSideImageChange(newImage);
    }
  }

  private emitFrontSideImageChange(newImage: string): void {
    this.imagesChange.emit({
      ...this.images,
      frontSide: newImage,
    });
  }

  private emitBackSideImageChange(newImage: string): void {
    this.imagesChange.emit({
      ...this.images,
      backSide: newImage,
    });
  }

  private requestCameraPermissions(): void {
    this.askPermissionsService.askCameraPermissions().subscribe((stream: MediaStream) => {
      this.userCamera.nativeElement.srcObject = stream;
    });
  }

  private endCameraStreamTracking(cameraStream: MediaStream): void {
    if (cameraStream.getTracks) {
      this.userCamera.nativeElement.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
    }

    this.userCamera.nativeElement.srcObject = null;
  }
}
