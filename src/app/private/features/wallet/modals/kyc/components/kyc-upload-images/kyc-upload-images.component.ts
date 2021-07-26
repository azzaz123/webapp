import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { KYCPhotosNeeded } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
import { KYC_UPLOAD_IMAGES_STATUS } from '../../enums/kyc-upload-images-status-enum';
import { KYC_TAKE_IMAGE_OPTIONS } from '../kyc-image-options/kyc-image-options.enum';

@Component({
  selector: 'tsl-kyc-upload-images',
  templateUrl: './kyc-upload-images.component.html',
  styleUrls: ['./kyc-upload-images.component.scss'],
})
export class KYCUploadImagesComponent implements OnInit {
  @ViewChild('usersCamera') usersCamera: ElementRef;
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

  private requestCameraPermissions(): void {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.userPermissions = KYC_UPLOAD_IMAGES_STATUS.SUCCEED;
          this.usersCamera.nativeElement.srcObject = stream;
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
      ? 'Debes aceptar los permisos para poder hacer las fotos.'
      : 'Oops, ha ocurrido un error y no podemos acceder a tu cámara.';
  }
}
