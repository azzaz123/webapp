import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MOCK_MEDIA_STREAM } from '@fixtures/media-stream.fixtures.spec';
import { RequestVideoPermissionsService } from './request-video-permissions.service';
import { VIDEO_PERMISSIONS_STATUS } from './video-permissions-status.interface';

describe('RequestVideoPermissionsService', () => {
  let service: RequestVideoPermissionsService;
  const videoMediaStreamConstraints = {
    video: { facingMode: 'environment' },
  };
  const MOCK_PERMISSION_DENIED_ERROR = 'DOMException: Permission denied';
  const MOCK_PERMISION_GENERIC_ERROR = 'General Error';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestVideoPermissionsService],
    });
    service = TestBed.inject(RequestVideoPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we ask for video permissions...', () => {
    describe(`and the user's browser supports the API`, () => {
      describe('and the user accept the permission', () => {
        beforeEach(() => {
          setPermissionsAsAccepted();
          spyOn(navigator.mediaDevices, 'getUserMedia').and.callThrough();

          service.request();
        });

        it('should ask the user for the video permission', () => {
          expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith(videoMediaStreamConstraints);
        });

        it('should define the video permission as accepted', fakeAsync(() => {
          let videoPermissions: VIDEO_PERMISSIONS_STATUS;

          tick();
          service.userVideoPermissions$.subscribe((result: VIDEO_PERMISSIONS_STATUS) => (videoPermissions = result));

          expect(videoPermissions).toBe(VIDEO_PERMISSIONS_STATUS.ACCEPTED);
        }));

        it('should return the video stream', fakeAsync(() => {
          let videoStream: MediaStream;

          service.videoStream$.subscribe((stream: MediaStream) => {
            videoStream = stream;
          });
          tick();

          expect(videoStream).toStrictEqual(MOCK_MEDIA_STREAM);
        }));
      });

      describe('and the user denied the permission', () => {
        beforeEach(() => {
          setPermissionsError(true);
          spyOn(navigator.mediaDevices, 'getUserMedia').and.callThrough();

          service.request();
        });

        it('should ask the user for the video permission', () => {
          expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith(videoMediaStreamConstraints);
        });

        it('should define the video permission as denied', fakeAsync(() => {
          let videoPermissions: VIDEO_PERMISSIONS_STATUS;

          tick();
          service.userVideoPermissions$.subscribe((result: VIDEO_PERMISSIONS_STATUS) => (videoPermissions = result));

          expect(videoPermissions).toBe(VIDEO_PERMISSIONS_STATUS.DENIED);
        }));

        it('should NOT define the video stream', fakeAsync(() => {
          expectVideoStreamNotDefined();
        }));
      });

      describe('and a generic error happens', () => {
        beforeEach(() => {
          setPermissionsError(false);
          spyOn(navigator.mediaDevices, 'getUserMedia').and.callThrough();

          service.request();
        });

        it('should ask the user for the video permission', () => {
          expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith(videoMediaStreamConstraints);
        });

        it('should define the video permission as cannot access', fakeAsync(() => {
          let videoPermissions: VIDEO_PERMISSIONS_STATUS;

          tick();
          service.userVideoPermissions$.subscribe((result: VIDEO_PERMISSIONS_STATUS) => (videoPermissions = result));

          expect(videoPermissions).toBe(VIDEO_PERMISSIONS_STATUS.CANNOT_ACCESS);
        }));

        it('should NOT define the video stream', fakeAsync(() => {
          expectVideoStreamNotDefined();
        }));
      });
    });

    describe(`and the user's browser does NOT support the API`, () => {
      beforeEach(() => {
        setPermissionsAsNotSupported();
      });

      it('should define the video permission as cannot access', fakeAsync(() => {
        let videoPermissions: VIDEO_PERMISSIONS_STATUS;

        service.request();
        tick();
        service.userVideoPermissions$.subscribe((result: VIDEO_PERMISSIONS_STATUS) => (videoPermissions = result));

        expect(videoPermissions).toBe(VIDEO_PERMISSIONS_STATUS.CANNOT_ACCESS);
      }));

      it('should NOT define the video stream', fakeAsync(() => {
        expectVideoStreamNotDefined();
      }));
    });
  });

  describe('when the video stream is already defined...', () => {
    describe('and we ask for stop the video stream...', () => {
      beforeEach(() => {
        setPermissionsAsAccepted();
        service.request();
      });

      it('should close all the video tracks', () => {
        service.stopStream();

        service.videoStream$.subscribe((tracks) => {
          tracks.getTracks().forEach((track) => expect(track.stop).toHaveBeenCalled());
        });
      });
    });
  });

  function expectVideoStreamNotDefined() {
    let videoStream: MediaStream;

    service.videoStream$.subscribe((stream: MediaStream) => {
      videoStream = stream;
    });
    tick();

    expect(videoStream).toBeFalsy();
  }

  function setPermissionsAsNotSupported(): void {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: () => null,
    });
  }

  function setPermissionsError(isPermissionDenied: boolean): void {
    const error = isPermissionDenied ? MOCK_PERMISSION_DENIED_ERROR : MOCK_PERMISION_GENERIC_ERROR;

    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: () => Promise.reject(error),
      },
    });
  }

  function setPermissionsAsAccepted(): void {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: () => Promise.resolve(MOCK_MEDIA_STREAM),
      },
    });
  }
});
