import {
  AUTHORIZATION_HEADER_NAME,
  TOKEN_SIGNATURE_HEADER_NAME,
  TOKEN_TIMESTAMP_HEADER_NAME,
} from '@core/http/interceptors/token/token.interceptor';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PictureUploadComponent } from './picture-upload.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '@core/user/user.service';
import { ErrorsService } from '@core/errors/errors.service';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { UPLOAD_FILE, UPLOAD_FILE_NAME } from '@fixtures/upload.fixtures.spec';
import { environment } from '@environments/environment';
import { IMAGE_TYPE, OUTPUT_TYPE, UploadFile } from '../../uploader/upload.interface';
import { AccessTokenService } from '@core/http/access-token.service';
import { UploaderService } from '@shared/uploader/uploader.service';
import { of, throwError } from 'rxjs';
import { MockUploaderService } from '@fixtures/uploader.fixtures.spec';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

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
            useClass: MockUploaderService,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureUploadComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    errorsService = TestBed.inject(ErrorsService);
    uploaderService = TestBed.inject(UploaderService);
  });

  describe('onUploadOutput', () => {
    it('should send upload event if event is addedToQueue', () => {
      spyOn<any>(window, 'Date').and.returnValue({ getTime: () => TIMESTAMP });
      spyOn(uploaderService, 'uploadFile').and.callThrough();
      uploaderService.serviceEvents$ = of({
        type: OUTPUT_TYPE.addedToQueue,
        file: UPLOAD_FILE,
        imageType: IMAGE_TYPE.AVATAR,
      });
      const headers = {
        [AUTHORIZATION_HEADER_NAME]: 'Bearer thetoken',
        [TOKEN_SIGNATURE_HEADER_NAME]: 'thesignature',
        [TOKEN_TIMESTAMP_HEADER_NAME]: `${TIMESTAMP}`,
      };

      fixture.detectChanges();

      expect(component.file).toEqual(UPLOAD_FILE);
      expect(uploaderService.uploadFile).toHaveBeenCalledWith(UPLOAD_FILE, {
        url: `${environment.baseUrl}api/v3/users/me/image`,
        method: 'POST',
        fieldName: 'image',
        headers,
        imageType: IMAGE_TYPE.AVATAR,
      });
    });

    it('should set file if event is uploading', () => {
      uploaderService.serviceEvents$ = of({
        type: OUTPUT_TYPE.uploading,
        file: UPLOAD_FILE,
        imageType: IMAGE_TYPE.AVATAR,
      });

      fixture.detectChanges();

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
      spyOn(uploaderService, 'uploadFile').and.returnValue(throwError(file.response));
      uploaderService.serviceEvents$ = of({
        type: OUTPUT_TYPE.addedToQueue,
        file: file,
        imageType: IMAGE_TYPE.AVATAR,
      });

      fixture.detectChanges();

      expect(errorsService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.SERVER_ERROR, ERROR);
    });

    it('should throw error if event is rejected', () => {
      spyOn(errorsService, 'i18nError');
      const ERROR = 'error' as TRANSLATION_KEY;
      uploaderService.serviceEvents$ = of({
        type: OUTPUT_TYPE.rejected,
        file: UPLOAD_FILE,
        reason: ERROR,
        imageType: IMAGE_TYPE.AVATAR,
      });

      fixture.detectChanges();

      expect(errorsService.i18nError).toHaveBeenCalledWith(ERROR, UPLOAD_FILE_NAME);
    });
  });
});
