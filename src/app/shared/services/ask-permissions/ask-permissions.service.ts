import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserDevicePermissions, DEVICE_PERMISSIONS_STATUS } from './user-device-permissions.interface';

@Injectable()
export class AskPermissionsService {
  private userDevicePermissionsSubject: BehaviorSubject<UserDevicePermissions> = new BehaviorSubject({
    video: null,
    audio: null,
  });

  get userDevicePermissions$(): Observable<UserDevicePermissions> {
    return this.userDevicePermissionsSubject.asObservable();
  }

  public askCameraPermissions(): Observable<MediaStream | never> {
    return this.askPermissions({
      video: { facingMode: 'environment' },
    }).pipe(
      tap(
        () => this.updateUserDevicePermissions({ video: DEVICE_PERMISSIONS_STATUS.ACCEPTED }),
        (error: DOMException) => {
          const errorMessage = error + '';
          const errorPermissionStatus: DEVICE_PERMISSIONS_STATUS = errorMessage.includes('denied')
            ? DEVICE_PERMISSIONS_STATUS.DENIED
            : DEVICE_PERMISSIONS_STATUS.CANNOT_ACCESS;
          this.updateUserDevicePermissions({ video: errorPermissionStatus });
        }
      )
    );
  }

  public askPermissions(mediaToRequest: MediaStreamConstraints): Observable<MediaStream | never> {
    if (this.isAPIAllowed()) {
      return from(navigator.mediaDevices.getUserMedia(mediaToRequest));
    } else {
      return throwError('Not Allowed');
    }
  }

  private isAPIAllowed(): boolean {
    return !!navigator.mediaDevices?.getUserMedia;
  }

  private updateUserDevicePermissions(newUserDevicePermissions: UserDevicePermissions): void {
    const updatedPermissions = { ...this.userDevicePermissionsSubject.value, ...newUserDevicePermissions };
    this.userDevicePermissionsSubject.next(updatedPermissions);
  }
}
