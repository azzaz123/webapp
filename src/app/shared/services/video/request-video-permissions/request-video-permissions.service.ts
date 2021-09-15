import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { VIDEO_PERMISSIONS_STATUS } from './video-permissions-status.interface';

@Injectable()
export class RequestVideoPermissionsService {
  private videoPermissionsSubject: BehaviorSubject<VIDEO_PERMISSIONS_STATUS> = new BehaviorSubject<VIDEO_PERMISSIONS_STATUS>(
    VIDEO_PERMISSIONS_STATUS.LOADING
  );

  public get userVideoPermissions$(): Observable<VIDEO_PERMISSIONS_STATUS> {
    return this.videoPermissionsSubject.asObservable();
  }

  public request(): Observable<MediaStream | never> {
    return this.requestMediaStream({
      video: { facingMode: 'environment' },
    }).pipe(
      tap(
        () => (this.userVideoPermissions = VIDEO_PERMISSIONS_STATUS.ACCEPTED),
        (error: DOMException) => {
          const errorMessage = error + '';
          // FIXME: take a look at handling error in the future		Date: 2021/08/03
          const errorPermissionStatus: VIDEO_PERMISSIONS_STATUS = errorMessage.includes('denied')
            ? VIDEO_PERMISSIONS_STATUS.DENIED
            : VIDEO_PERMISSIONS_STATUS.CANNOT_ACCESS;
          this.userVideoPermissions = errorPermissionStatus;
        }
      )
    );
  }

  private set userVideoPermissions(newPermissions: VIDEO_PERMISSIONS_STATUS) {
    this.videoPermissionsSubject.next(newPermissions);
  }

  private requestMediaStream(mediaToRequest: MediaStreamConstraints): Observable<MediaStream | never> {
    if (this.isAPIAllowed()) {
      return from(navigator.mediaDevices.getUserMedia(mediaToRequest));
    } else {
      return throwError('Not Allowed');
    }
  }

  private isAPIAllowed(): boolean {
    return !!navigator.mediaDevices?.getUserMedia;
  }
}
