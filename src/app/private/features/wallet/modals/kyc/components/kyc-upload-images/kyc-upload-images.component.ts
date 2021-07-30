import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { KYCImagesNeeded } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
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

  public imagesTaken = {
    firstImage: null,
    secondImage: null,
  };
  public readonly DEVICE_PERMISSIONS_STATUS = DEVICE_PERMISSIONS_STATUS;
  public readonly KYC_TAKE_IMAGE_OPTIONS = KYC_TAKE_IMAGE_OPTIONS;
  public userDevicePermissions$: Observable<UserDevicePermissions>;
  public errorBannerSpecifications: NgbAlertConfig = {
    type: 'danger',
    dismissible: false,
  };

  constructor(private askPermissionsService: AskPermissionsService) {
    this.userDevicePermissions$ = askPermissionsService.userDevicePermissions$;
  }

  ngAfterViewInit(): void {
    if (this.takeImageMethod === KYC_TAKE_IMAGE_OPTIONS.SHOOT) {
      this.requestCameraPermissions();
    }
  }

  ngOnDestroy(): void {
    const cameraStream = this.userCamera?.nativeElement?.srcObject;

    if (cameraStream) {
      this.endCameraStreamTracking(cameraStream);
    }
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

  public takeImage(): void {
    const imageContainer = this.isFirstImageDefined() ? this.backSideImage.nativeElement : this.frontSideImage.nativeElement;

    imageContainer.getContext('2d').drawImage(this.userCamera.nativeElement, 0, 0, imageContainer.width, imageContainer.height);

    this.defineImage(imageContainer.toDataURL('image/png'));
  }

  private isFirstImageDefined(): boolean {
    return this.imagesTaken.firstImage || this.imagesNeeded === 1;
  }

  private defineImage(newImage): void {
    if (this.isFirstImageDefined()) {
      this.imagesTaken = { ...this.imagesTaken, secondImage: newImage };
    } else {
      this.imagesTaken = { ...this.imagesTaken, firstImage: newImage };
    }
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

  get imagesTakenCounter(): number {
    const firstImage = this.imagesTaken.firstImage;
    const secondImage = this.imagesTaken.secondImage;

    return firstImage && secondImage ? 2 : !firstImage && !secondImage ? 0 : 1;
  }
}
