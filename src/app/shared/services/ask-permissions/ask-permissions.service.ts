import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserPermissions, PERMISSIONS_STATUS } from './user-permissions.interface';

@Injectable()
export class AskPermissionsService {
  public userPermissionsSubject: BehaviorSubject<UserPermissions> = new BehaviorSubject({
    video: null,
    audio: null,
  });

  public askCameraPermissions(): Observable<MediaStream> {
    return this.askPermissions({
      video: { facingMode: 'environment' },
    }).pipe(
      tap(
        () => this.updateUserPermissions({ video: PERMISSIONS_STATUS.ACCEPTED }),
        (error: DOMException) => {
          const errorMessage = error + '';
          const errorPermissionStatus: PERMISSIONS_STATUS = errorMessage.includes('denied')
            ? PERMISSIONS_STATUS.DENIED
            : PERMISSIONS_STATUS.CANNOT_ACCESS;
          this.updateUserPermissions({ video: errorPermissionStatus });
        }
      )
    );
  }

  public askPermissions(mediaToRequest: MediaStreamConstraints): Observable<MediaStream> {
    if (this.isAPIAllowed()) {
      return from(navigator.mediaDevices.getUserMedia(mediaToRequest));
    } else {
      return throwError(null);
    }
  }

  private isAPIAllowed(): boolean {
    return !!navigator.mediaDevices?.getUserMedia;
  }

  private updateUserPermissions(newUserPermissions: UserPermissions): void {
    const updatedPermissions = { ...this.userPermissionsSubject.value, newUserPermissions };
    this.userPermissionsSubject.next(updatedPermissions);
  }
}
