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
  public userCameraPermissions: KYC_UPLOAD_IMAGES_STATUS;
  public errorBannerSpecifications: NgbAlertConfig = {
    type: 'danger',
    dismissible: false,
  };

  ngOnInit(): void {
    if (this.takeImageMethod === KYC_TAKE_IMAGE_OPTIONS.SHOOT) {
      this.requestCameraPermissions();
    }
  }

  ngOnDestroy(): void {
    this.endCameraStreamTracking();
  }

  private requestCameraPermissions(): void {
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream: MediaStream) => {
          this.userCameraPermissions = KYC_UPLOAD_IMAGES_STATUS.ACCEPTED;
          this.userCamera.nativeElement.srcObject = stream;
        })
        .catch((error: DOMException) => {
          const errorMessage = error + '';
          this.userCameraPermissions = errorMessage.includes('Permission denied')
            ? KYC_UPLOAD_IMAGES_STATUS.DENIED
            : KYC_UPLOAD_IMAGES_STATUS.CANNOT_ACCESS;
        });
    } else {
      this.userCameraPermissions = KYC_UPLOAD_IMAGES_STATUS.CANNOT_ACCESS;
    }
  }

  private endCameraStreamTracking(): void {
    if (this.userCamera?.nativeElement?.srcObject) {
      this.userCamera.nativeElement.srcObject.getTracks().forEach((track) => {
        track.stop();
      });

      this.userCamera.nativeElement.srcObject = null;
    }
  }

  get requestCameraFailed(): boolean {
    return (
      this.userCameraPermissions === KYC_UPLOAD_IMAGES_STATUS.DENIED ||
      this.userCameraPermissions === KYC_UPLOAD_IMAGES_STATUS.CANNOT_ACCESS
    );
  }

  get cameraFailedCopy(): string {
    return this.userCameraPermissions === KYC_UPLOAD_IMAGES_STATUS.DENIED
      ? $localize`:@@kyc_camera_access_refused:You must accept the permissions to be able to take photos`
      : $localize`:@@kyc_camera_cannot_access:Oops, an error occurred and we cannot access your camera`;
  }
}
