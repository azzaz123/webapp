import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { KYCPhotosNeeded } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
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
  @Input() photosNeeded: KYCPhotosNeeded;
  @Input() takeImageMethod: KYC_TAKE_IMAGE_OPTIONS;

  public readonly DEVICE_PERMISSIONS_STATUS = DEVICE_PERMISSIONS_STATUS;
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
