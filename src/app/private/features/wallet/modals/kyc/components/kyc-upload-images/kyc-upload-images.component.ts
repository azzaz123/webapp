import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { KYCPhotosNeeded } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
import { AskPermissionsService } from '@shared/services/ask-permissions/ask-permissions.service';
import { PERMISSIONS_STATUS, UserPermissions } from '@shared/services/ask-permissions/user-permissions.interface';
import { BehaviorSubject } from 'rxjs';
import { KYC_TAKE_IMAGE_OPTIONS } from '../kyc-image-options/kyc-image-options.enum';

@Component({
  selector: 'tsl-kyc-upload-images',
  templateUrl: './kyc-upload-images.component.html',
  styleUrls: ['./kyc-upload-images.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KYCUploadImagesComponent implements OnInit, OnDestroy {
  @ViewChild('userCamera') userCamera: ElementRef;
  @Input() photosNeeded: KYCPhotosNeeded;
  @Input() takeImageMethod: KYC_TAKE_IMAGE_OPTIONS;

  public readonly PERMISSIONS_STATUS = PERMISSIONS_STATUS;
  public userPermissionsSubject: BehaviorSubject<UserPermissions>;
  public errorBannerSpecifications: NgbAlertConfig = {
    type: 'danger',
    dismissible: false,
  };

  constructor(private askPermissionsService: AskPermissionsService) {
    this.userPermissionsSubject = askPermissionsService.userPermissionsSubject;
  }

  ngOnInit(): void {
    if (this.takeImageMethod === KYC_TAKE_IMAGE_OPTIONS.SHOOT) {
      this.requestCameraPermissions();
    }
  }

  ngOnDestroy(): void {
    this.endCameraStreamTracking();
  }

  public requestCameraFailed(userCameraPermissions: PERMISSIONS_STATUS): boolean {
    return userCameraPermissions === PERMISSIONS_STATUS.DENIED || userCameraPermissions === PERMISSIONS_STATUS.CANNOT_ACCESS;
  }

  public requestCameraSucceed(userCameraPermissions: PERMISSIONS_STATUS): boolean {
    return userCameraPermissions === PERMISSIONS_STATUS.ACCEPTED;
  }

  public cameraFailedCopy(userCameraPermissions: PERMISSIONS_STATUS): string {
    return userCameraPermissions === PERMISSIONS_STATUS.DENIED
      ? $localize`:@@kyc_camera_access_refused:You must accept the permissions to be able to take photos`
      : $localize`:@@kyc_camera_cannot_access:Oops, an error occurred and we cannot access your camera`;
  }

  private requestCameraPermissions(): void {
    this.askPermissionsService.askCameraPermissions().subscribe((stream: MediaStream) => {
      this.userCamera.nativeElement.srcObject = stream;
    });
  }

  private endCameraStreamTracking(): void {
    if (this.userCamera?.nativeElement?.srcObject) {
      this.userCamera.nativeElement.srcObject.getTracks().forEach((track) => {
        track.stop();
      });

      this.userCamera.nativeElement.srcObject = null;
    }
  }
}
