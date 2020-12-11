import {
  TOKEN_AUTHORIZATION_HEADER_NAME,
  TOKEN_SIGNATURE_HEADER_NAME,
  TOKEN_TIMESTAMP_HEADER_NAME,
} from '@core/http/interceptors/token.interceptor';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PictureUploadComponent } from './picture-upload.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '@core/user/user.service';
import { ErrorsService } from '@core/errors/errors.service';
import { MOCK_USER } from '../../../../tests/user.fixtures.spec';
import {
  UPLOAD_FILE,
  UPLOAD_FILE_NAME,
} from '../../../../tests/upload.fixtures.spec';
import { environment } from '@environments/environment';
import {
  imageType,
  OutputType,
  UploadFile,
} from '../../uploader/upload.interface';
import { AccessTokenService } from '@core/http/access-token.service';
import { UploaderService } from '@shared/uploader/uploader.service';
import { of, throwError } from 'rxjs';

describe('PictureUploadComponent', () => {
  let component: PictureUploadComponent;
  let fixture: ComponentFixture<PictureUploadComponent>;
  let userService: UserService;
  let errorsService: ErrorsService;
  const TIMESTAMP = 123456789;
  let uploaderService: UploaderService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PictureUploadComponent],
        providers: [
          {
            provide: UserService,
            useValue: {
              user: MOCK_USER,
            },
          },
          {
            provide: ErrorsService,
            useValue: {
              i18nError() {},
            },
          },
          {
            provide: AccessTokenService,
            useValue: {
              accessToken: 'thetoken',
              getTokenSignature() {
                return 'thesignature';
              },
            },
          },
          {
            provide: UploaderService,
            useValue: {
              uploadFile() {
                return of(null);
              },
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userService = TestBed.inject(UserService);
    errorsService = TestBed.inject(ErrorsService);
    uploaderService = TestBed.inject(UploaderService);
  });

  describe('onUploadOutput', () => {
    it('should send upload event if event is addedToQueue', () => {
      spyOn<any>(window, 'Date').and.returnValue({ getTime: () => TIMESTAMP });
      spyOn(uploaderService, 'uploadFile').and.callThrough();
      const headers = {
        [TOKEN_AUTHORIZATION_HEADER_NAME]: 'Bearer thetoken',
        [TOKEN_SIGNATURE_HEADER_NAME]: 'thesignature',
        [TOKEN_TIMESTAMP_HEADER_NAME]: `${TIMESTAMP}`,
      };
      component.onUploadOutput({
        type: OutputType.addedToQueue,
        file: UPLOAD_FILE,
      });

      expect(component.file).toEqual(UPLOAD_FILE);
      expect(uploaderService.uploadFile).toHaveBeenCalledWith(UPLOAD_FILE, {
        url: `${environment.baseUrl}api/v3/users/me/image`,
        method: 'POST',
        fieldName: 'image',
        headers,
        imageType: imageType.AVATAR,
      });
    });

    it('should set file if event is uploading', () => {
      component.onUploadOutput({
        type: OutputType.uploading,
        file: UPLOAD_FILE,
      });

      expect(component.file).toEqual(UPLOAD_FILE);
    });

    it('should show error if event is done and status not 204', () => {
      spyOn(errorsService, 'i18nError');
      const file = <UploadFile>{ ...UPLOAD_FILE };
      const ERROR = 'error';
      file.progress.data.responseStatus = 0;
      file.response = {
        message: ERROR,
      };

      spyOn(uploaderService, 'uploadFile').and.returnValue(
        throwError(file.response)
      );

      component.onUploadOutput({
        type: OutputType.addedToQueue,
        file: file,
      });

      expect(errorsService.i18nError).toHaveBeenCalledWith(
        'serverError',
        ERROR
      );
    });

    it('should throw error if event is rejected', () => {
      spyOn(errorsService, 'i18nError');
      const ERROR = 'error';

      component.onUploadOutput({
        type: OutputType.rejected,
        file: UPLOAD_FILE,
        reason: ERROR,
      });

      expect(errorsService.i18nError).toHaveBeenCalledWith(
        ERROR,
        UPLOAD_FILE_NAME
      );
    });
  });
});
