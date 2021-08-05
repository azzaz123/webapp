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
  @ViewChild('frontSideImage') frontSideImage: ElementRef;
  @ViewChild('backSideImage') backSideImage: ElementRef;

  @Input() imagesNeeded: KYCImagesNeeded;
  @Input() takeImageMethod: KYC_TAKE_IMAGE_OPTIONS;
  @Input() images: KYCImages;

  @Output() imagesChange: EventEmitter<KYCImages> = new EventEmitter();
  @Output() endVerification: EventEmitter<void> = new EventEmitter();
  @Output() goBack: EventEmitter<void> = new EventEmitter();

  public userDevicePermissions$: Observable<UserDevicePermissions>;
  public readonly KYC_TAKE_IMAGE_OPTIONS = KYC_TAKE_IMAGE_OPTIONS;
  public readonly KYC_IMAGES = KYC_IMAGES;
  public readonly errorBannerSpecifications: NgbAlertConfig = {
    type: BANNER_TYPES.DANGER,
    dismissible: false,
  };
  private readonly DEVICE_PERMISSIONS_STATUS = DEVICE_PERMISSIONS_STATUS;

  constructor(private askPermissionsService: AskPermissionsService) {
    this.userDevicePermissions$ = askPermissionsService.userDevicePermissions$;
  }

  ngAfterViewInit(): void {
    if (this.isShootTakeImageMethod) {
      this.requestCameraPermissions();
    }
  }

  ngOnDestroy(): void {
    const cameraStream = this.userCamera?.nativeElement?.srcObject;

    if (cameraStream) {
      this.endCameraStreamTracking(cameraStream);
    }
  }

  public takeImage(): void {
    const imageContainer = this.isFrontSideImageDefined ? this.backSideImage?.nativeElement : this.frontSideImage.nativeElement;

    imageContainer.getContext('2d').drawImage(this.userCamera.nativeElement, 0, 0, imageContainer.width, imageContainer.height);

    this.emitNewImage(imageContainer.toDataURL('image/jpeg', 1));
  }

  public removeImage(imageToRemove: KYC_IMAGES): void {
    if (imageToRemove === KYC_IMAGES.FRONT_SIDE) {
      this.emitFrontSideImageChange(null);
    } else {
      this.emitBackSideImageChange(null);
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

  get isShootTakeImageMethod(): boolean {
    return this.takeImageMethod === KYC_TAKE_IMAGE_OPTIONS.SHOOT;
  }

  get title(): string {
    return this.isShootTakeImageMethod
      ? $localize`:@@kyc_take_photo_view_if_one_side_title:Take a photo of your document`
      : $localize`:@@kyc_upload_photo_view_title:Upload a photo of your document`;
  }

  get actionButtonCopy(): string {
    return this.isShootTakeImageMethod
      ? $localize`:@@kyc_request_photo_counter_shoot:Take photo`
      : $localize`:@@kyc_request_photo_counter_upload:Upload photo`;
  }

  get allImagesAreDefined(): boolean {
    return this.imagesTakenCounter === this.imagesNeeded;
  }

  get imagesTakenCounter(): number {
    const firstImage = this.images.frontSide;
    const secondImage = this.images.backSide;

    return firstImage && secondImage ? 2 : !firstImage && !secondImage ? 0 : 1;
  }

  get isFrontSideImageDefined(): boolean {
    return !!this.images.frontSide;
  }

  get isBackSideImageDefined(): boolean {
    return !!this.images.backSide;
  }
}
