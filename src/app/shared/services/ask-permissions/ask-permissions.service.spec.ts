import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MOCK_MEDIA_STREAM } from '@fixtures/media-stream.fixtures.spec';

import { AskPermissionsService } from './ask-permissions.service';
import { PERMISSIONS_STATUS, UserPermissions } from './user-permissions.interface';

describe('AskPermissionsService', () => {
  let service: AskPermissionsService;
  const cameraMediaStreamConstraints = {
    video: { facingMode: 'environment' },
  };
  const audioMediaStreamConstraints = { audio: true };
  const MOCK_PERMISION_DENIED_ERROR = 'DOMException: Permission denied';
  const MOCK_PERMISION_GENERIC_ERROR = 'General Error';
  const MOCK_NOT_ALLOWED_ERROR = 'Not Allowed';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AskPermissionsService],
    });
    service = TestBed.inject(AskPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we ask for camera permissions...', () => {
    describe(`and the user's browser supports the API`, () => {
      describe('and the user accept the permission', () => {
        beforeEach(() => {
          setPermissionsAsAccepted();
          spyOn(navigator.mediaDevices, 'getUserMedia').and.callThrough();
        });

        it('should ask the user for the camera permission', () => {
          service.askCameraPermissions().subscribe();

          expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith(cameraMediaStreamConstraints);
        });

        it('should define the video permission as accepted', fakeAsync(() => {
          let cameraPermissions: PERMISSIONS_STATUS;

          service.askCameraPermissions().subscribe();
          tick();
          service.userPermissionsSubject.subscribe((userPermissions: UserPermissions) => {
            cameraPermissions = userPermissions.video;
          });

          expect(cameraPermissions).toBe(PERMISSIONS_STATUS.ACCEPTED);
        }));

        it('should return the stream', fakeAsync(() => {
          let cameraStream: MediaStream;

          service.askCameraPermissions().subscribe((stream: MediaStream) => {
            cameraStream = stream;
          });
          tick();

          expect(cameraStream).toStrictEqual(MOCK_MEDIA_STREAM);
        }));
      });

      describe('and the user denied the permission', () => {
        beforeEach(() => {
          setPermissionsError(true);
          spyOn(navigator.mediaDevices, 'getUserMedia').and.callThrough();
        });

        it('should ask the user for the camera permission', () => {
          service.askCameraPermissions().subscribe();

          expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith(cameraMediaStreamConstraints);
        });

        it('should define the video permission as denied', fakeAsync(() => {
          let cameraPermissions: PERMISSIONS_STATUS;

          service.askCameraPermissions().subscribe({ error: () => {} });
          tick();
          service.userPermissionsSubject.subscribe((userPermissions: UserPermissions) => {
            cameraPermissions = userPermissions.video;
          });

          expect(cameraPermissions).toBe(PERMISSIONS_STATUS.DENIED);
        }));

        it('should return an error', fakeAsync(() => {
          let error;

          service.askCameraPermissions().subscribe({ error: (e) => (error = e) });
          tick();

          expect(error).toBe(MOCK_PERMISION_DENIED_ERROR);
        }));
      });

      describe('and a generic error happens', () => {
        beforeEach(() => {
          setPermissionsError(false);
          spyOn(navigator.mediaDevices, 'getUserMedia').and.callThrough();
        });

        it('should ask the user for the camera permission', () => {
          service.askCameraPermissions().subscribe();

          expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith(cameraMediaStreamConstraints);
        });

        it('should define the video permission as cannot access', fakeAsync(() => {
          let cameraPermissions: PERMISSIONS_STATUS;

          service.askCameraPermissions().subscribe({ error: () => {} });
          tick();
          service.userPermissionsSubject.subscribe((userPermissions: UserPermissions) => {
            cameraPermissions = userPermissions.video;
          });

          expect(cameraPermissions).toBe(PERMISSIONS_STATUS.CANNOT_ACCESS);
        }));

        it('should return an error', fakeAsync(() => {
          let error;

          service.askCameraPermissions().subscribe({
            error: (e) => (error = e),
          });
          tick();

          expect(error).toBe(MOCK_PERMISION_GENERIC_ERROR);
        }));
      });
    });

    describe(`and the user's browser DON'T supports the API`, () => {
      beforeEach(() => {
        setPermissionsAsNotSupported();
      });

      it('should define the video permission as cannot access', fakeAsync(() => {
        let cameraPermissions: PERMISSIONS_STATUS;

        service.askCameraPermissions().subscribe({ error: () => {} });
        tick();
        service.userPermissionsSubject.subscribe((userPermissions: UserPermissions) => {
          cameraPermissions = userPermissions.video;
        });

        expect(cameraPermissions).toBe(PERMISSIONS_STATUS.CANNOT_ACCESS);
      }));

      it('should return a not allowed error', fakeAsync(() => {
        let error;

        service.askCameraPermissions().subscribe({
          error: (e) => (error = e),
        });
        tick();

        expect(error).toBe(MOCK_NOT_ALLOWED_ERROR);
      }));
    });
  });

  describe('when we ask for custom permissions', () => {
    describe(`and the user's browser supports the API`, () => {
      describe('and the user accept the permission', () => {
        beforeEach(() => {
          setPermissionsAsAccepted();
          spyOn(navigator.mediaDevices, 'getUserMedia').and.callThrough();
        });

        it('should ask the user for the custom permissions', () => {
          service.askPermissions(audioMediaStreamConstraints).subscribe();

          expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith(audioMediaStreamConstraints);
        });

        it('should return the stream', fakeAsync(() => {
          let mediaStream: MediaStream;

          service.askPermissions(audioMediaStreamConstraints).subscribe((stream) => {
            mediaStream = stream;
          });
          tick();

          expect(mediaStream).toBe(MOCK_MEDIA_STREAM);
        }));
      });

      describe('and the user deny the permission', () => {
        beforeEach(() => {
          setPermissionsError(true);
          spyOn(navigator.mediaDevices, 'getUserMedia').and.callThrough();
        });

        it('should return an error', fakeAsync(() => {
          let error;

          service.askPermissions(audioMediaStreamConstraints).subscribe({
            error: (e) => (error = e),
          });
          tick();

          expect(error).toBe(MOCK_PERMISION_DENIED_ERROR);
        }));
      });
    });

    describe(`and the user's browser DON'T supports the API`, () => {
      beforeEach(() => {
        setPermissionsAsNotSupported();
      });

      it('should return a not allowed error', fakeAsync(() => {
        let error;

        service.askPermissions(audioMediaStreamConstraints).subscribe({
          error: (e) => (error = e),
        });
        tick();

        expect(error).toBe(MOCK_NOT_ALLOWED_ERROR);
      }));
    });
  });

  function setPermissionsAsNotSupported(): void {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: () => null,
    });
  }

  function setPermissionsError(isPermissionDenied: boolean): void {
    const error = isPermissionDenied ? MOCK_PERMISION_DENIED_ERROR : MOCK_PERMISION_GENERIC_ERROR;

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
