import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { VIDEO_PERMISSIONS_STATUS } from './video-permissions-status.interface';

@Injectable()
export class RequestVideoPermissionsService {
  public get videoStream$(): Observable<MediaStream | null> {
    return this.videoStreamSubject.asObservable();
  }

  public get userVideoPermissions$(): Observable<VIDEO_PERMISSIONS_STATUS> {
    return this.videoPermissionsSubject.asObservable();
  }

  private readonly videoPermissionsSubject: BehaviorSubject<VIDEO_PERMISSIONS_STATUS> = new BehaviorSubject<VIDEO_PERMISSIONS_STATUS>(
    VIDEO_PERMISSIONS_STATUS.LOADING
  );

  private readonly videoStreamSubject: BehaviorSubject<MediaStream | null> = new BehaviorSubject(null);

  public startStream(): void {
    if (this.isAPIAllowed()) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: 'environment' },
        })
        .then(
          (stream: MediaStream) => {
            this.videoStream = stream;
            this.userVideoPermissions = VIDEO_PERMISSIONS_STATUS.ACCEPTED;
          },
          (error: DOMException) => this.defineVideoPermissionsError(error)
        );
    } else {
      this.userVideoPermissions = VIDEO_PERMISSIONS_STATUS.CANNOT_ACCESS;
    }
  }

  public stopStream(): void {
    this.videoStream$.pipe(take(1)).subscribe((videoStream: MediaStream) => {
      if (videoStream?.getTracks) {
        videoStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
    });
  }

  private set userVideoPermissions(newPermissions: VIDEO_PERMISSIONS_STATUS) {
    this.videoPermissionsSubject.next(newPermissions);
  }

  private set videoStream(stream: MediaStream) {
    this.videoStreamSubject.next(stream);
  }

  private isAPIAllowed(): boolean {
    return !!navigator.mediaDevices?.getUserMedia;
  }

  private defineVideoPermissionsError(error: DOMException): void {
    const errorMessage = error + '';
    // FIXME: take a look at handling error in the future		Date: 2021/08/03
    const errorPermissionStatus: VIDEO_PERMISSIONS_STATUS = errorMessage.includes('denied')
      ? VIDEO_PERMISSIONS_STATUS.DENIED
      : VIDEO_PERMISSIONS_STATUS.CANNOT_ACCESS;
    this.userVideoPermissions = errorPermissionStatus;
  }
}
