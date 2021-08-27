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
  @ViewChild('frontSideImage') frontSideImage: ElementRef<HTMLCanvasElement>;
  @ViewChild('frontSideImageUpload') frontSideImageUpload: ElementRef<HTMLInputElement>;
  @ViewChild('backSideImage') backSideImage: ElementRef<HTMLCanvasElement>;
  @ViewChild('backSideImageUpload') backSideImageUpload: ElementRef<HTMLInputElement>;

  @Input() imagesNeeded: KYCImagesNeeded;
  @Input() takeImageMethod: KYC_TAKE_IMAGE_OPTIONS;
  @Input() images: KYCImages;

  @Output() imagesChange: EventEmitter<KYCImages> = new EventEmitter();
  @Output() endVerification: EventEmitter<void> = new EventEmitter();
  @Output() goBack: EventEmitter<void> = new EventEmitter();

  public userDevicePermissions$: Observable<UserDevicePermissions>;
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

  public checkIfUploadIsAvailable(imageSide: KYC_IMAGES): void {
    if (this.isUploadImageMethod) {
      if (imageSide === KYC_IMAGES.FRONT_SIDE) {
        this.frontSideImageUpload.nativeElement.click();
      } else {
        this.backSideImageUpload.nativeElement.click();
      }
    }
  }

  public defineImage(e: Event, imageSide: KYC_IMAGES): void {
    const input = e.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];
    this.defineUploadImageAndEmitValue(file, imageSide);
  }

  public takeImage(): void {
    if (this.isShootImageMethod) {
      const imageContainer = this.isFrontSideImageDefined ? this.backSideImage?.nativeElement : this.frontSideImage.nativeElement;

      this.drawImageInCanvas(imageContainer, this.userCamera.nativeElement);

      this.emitNewImage(imageContainer.toDataURL(this.MIME_TYPES.IMAGE_JPEG, 1));
    }
  }

  public removeImage(imageToRemove: KYC_IMAGES): void {
    if (imageToRemove === KYC_IMAGES.FRONT_SIDE) {
      this.emitFrontSideImageChange(null);

      if (this.isUploadImageMethod) {
        this.frontSideImageUpload.nativeElement.value = null;
      }
    }

    if (imageToRemove === KYC_IMAGES.BACK_SIDE) {
      this.emitBackSideImageChange(null);

      if (this.isUploadImageMethod) {
        this.backSideImageUpload.nativeElement.value = null;
      }
    }
  }

  public handleBack(): void {
    this.imagesChange.emit({
      ...this.images,
      frontSide: null,
      backSide: null,
    });

    this.goBack.emit();
  }

  public requestCameraFailed(userCameraPermissions: DEVICE_PERMISSIONS_STATUS): boolean {
    return userCameraPermissions === DEVICE_PERMISSIONS_STATUS.DENIED || userCameraPermissions === DEVICE_PERMISSIONS_STATUS.CANNOT_ACCESS;
  }

  public requestCameraSucceed(userCameraPermissions: DEVICE_PERMISSIONS_STATUS): boolean {
    return userCameraPermissions === DEVICE_PERMISSIONS_STATUS.ACCEPTED;
  }

  public cameraFailedCopy(userCameraPermissions: DEVICE_PERMISSIONS_STATUS): string {
    return userCameraPermissions === DEVICE_PERMISSIONS_STATUS.DENIED
      ? $localize`:@@kyc_camera_access_refused:You must accept the permissions to be able to take photos`
      : $localize`:@@kyc_camera_cannot_access:Oops, an error occurred and we cannot access your camera`;
  }

  public isUploadImageCards(userDevicePermissions: UserDevicePermissions): boolean {
    return (this.isShootImageMethod && this.requestCameraSucceed(userDevicePermissions.video)) || this.isUploadImageMethod;
  }

  public isImageButton(videoPermissionStatus: DEVICE_PERMISSIONS_STATUS): boolean {
    return this.requestCameraSucceed(videoPermissionStatus) || this.isUploadImageMethod;
  }

  public isErrorBanner(videoPermissionStatus: DEVICE_PERMISSIONS_STATUS): boolean {
    return this.requestCameraFailed(videoPermissionStatus) && this.isShootImageMethod;
  }

  public get isUploadImageMethod(): boolean {
    return this.takeImageMethod === KYC_TAKE_IMAGE_OPTIONS.UPLOAD;
  }

  public get isShootImageMethod(): boolean {
    return this.takeImageMethod === KYC_TAKE_IMAGE_OPTIONS.SHOOT;
  }

  public get title(): string {
    return this.isShootImageMethod
      ? $localize`:@@kyc_take_photo_view_if_one_side_title:Take a photo of your document`
      : $localize`:@@kyc_upload_photo_view_title:Upload a photo of your document`;
  }

  public get actionButtonCopy(): string {
    return this.isShootImageMethod
      ? $localize`:@@kyc_request_photo_counter_shoot:Take photo`
      : $localize`:@@kyc_request_photo_counter_upload:Upload photo`;
  }

  public get allImagesAreDefined(): boolean {
    return this.imagesTakenCounter === this.imagesNeeded;
  }

  public get imagesTakenCounter(): number {
    const firstImage = this.images.frontSide;
    const secondImage = this.images.backSide;

    return firstImage && secondImage ? 2 : !firstImage && !secondImage ? 0 : 1;
  }

  public get isFrontSideImageDefined(): boolean {
    return !!this.images.frontSide;
  }

  public get isBackSideImageDefined(): boolean {
    return !!this.images.backSide;
  }

  private defineUploadImageAndEmitValue(file: File, imageSide: KYC_IMAGES): void {
    const imageContainer = imageSide === KYC_IMAGES.FRONT_SIDE ? this.frontSideImage.nativeElement : this.backSideImage?.nativeElement;
    const img = new Image();

    if (file.type.match(this.MIME_TYPES.IMAGE_JPEG)) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', (evt: ProgressEvent<FileReader>) => {
        if (evt.target.readyState === FileReader.DONE && typeof evt.target.result === 'string') {
          const base64Image = evt.target.result;
          img.src = base64Image;
          img.addEventListener('load', () => this.drawImageInCanvas(imageContainer, img));

          if (imageSide === KYC_IMAGES.FRONT_SIDE) {
            this.emitFrontSideImageChange(base64Image);
          } else {
            this.emitBackSideImageChange(base64Image);
          }
        }
      });
    }
  }

  private drawImageInCanvas(imageContainer: HTMLCanvasElement, img: HTMLImageElement): void {
    imageContainer.getContext('2d').drawImage(img, 0, 0, imageContainer.width, imageContainer.height);
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
