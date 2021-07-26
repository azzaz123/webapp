import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { KYCPhotosNeeded } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
import { KYC_UPLOAD_IMAGES_STATUS } from '../../enums/kyc-upload-images-status-enum';
import { KYC_TAKE_IMAGE_OPTIONS } from '../kyc-image-options/kyc-image-options.enum';

@Component({
  selector: 'tsl-kyc-upload-images',
  templateUrl: './kyc-upload-images.component.html',
  styleUrls: ['./kyc-upload-images.component.scss'],
})
export class KYCUploadImagesComponent implements OnInit, OnDestroy {
  @ViewChild('userCamera') userCamera: ElementRef;
  @Input() photosNeeded: KYCPhotosNeeded;
  @Input() takeImageMethod: KYC_TAKE_IMAGE_OPTIONS;

  public readonly KYC_UPLOAD_IMAGES_STATUS = KYC_UPLOAD_IMAGES_STATUS;
  public userPermissions: KYC_UPLOAD_IMAGES_STATUS;
  public errorBannerSpecifications: NgbAlertConfig = {
    type: 'danger',
    dismissible: false,
  };

  constructor() {}

  ngOnInit(): void {
    if (this.takeImageMethod === KYC_TAKE_IMAGE_OPTIONS.SHOOT) {
      this.requestCameraPermissions();
    }
  }

  ngOnDestroy(): void {
    this.endCameraStreamTracking();
  }

  public endCameraStreamTracking(): void {
    this.userCamera.nativeElement.srcObject.getTracks().forEach((track) => {
      track.stop();
    });

    this.userCamera.nativeElement.srcObject.srcObject = null;
  }

  private requestCameraPermissions(): void {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.userPermissions = KYC_UPLOAD_IMAGES_STATUS.SUCCEED;
          this.userCamera.nativeElement.srcObject = stream;
        })
        .catch((error: DOMException) => {
          const errorMessage = error + '';
          if (errorMessage.includes('Permission denied')) {
            this.userPermissions = KYC_UPLOAD_IMAGES_STATUS.DENIED;
          } else {
            this.userPermissions = KYC_UPLOAD_IMAGES_STATUS.CANNOT_ACCESS;
          }
        });
    } else {
      this.userPermissions = KYC_UPLOAD_IMAGES_STATUS.CANNOT_ACCESS;
    }
  }

  get requestCameraFailed(): boolean {
    return this.userPermissions === KYC_UPLOAD_IMAGES_STATUS.DENIED || this.userPermissions === KYC_UPLOAD_IMAGES_STATUS.CANNOT_ACCESS;
  }

  get cameraFailedCopy(): string {
    return this.userPermissions === KYC_UPLOAD_IMAGES_STATUS.DENIED
      ? $localize`:@@kyc_camera_access_refused:You must accept the permissions to be able to take photos`
      : $localize`:@@kyc_camera_cannot_access:Oops, an error occurred and we cannot access your camera`;
  }
}
