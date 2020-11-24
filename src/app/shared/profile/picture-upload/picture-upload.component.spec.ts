import {
  TOKEN_AUTHORIZATION_HEADER_NAME,
  TOKEN_SIGNATURE_HEADER_NAME,
  TOKEN_TIMESTAMP_HEADER_NAME,
} from './../../../core/http/interceptors/token.interceptor';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PictureUploadComponent } from './picture-upload.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '../../../core/user/user.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { MOCK_USER } from '../../../../tests/user.fixtures.spec';
import {
  UPLOAD_FILE,
  UPLOAD_FILE_ID,
  UPLOAD_FILE_NAME,
} from '../../../../tests/upload.fixtures.spec';
import { environment } from '../../../../environments/environment';
import { UploadFile, UploadInput } from '../../uploader/upload.interface';
import { AccessTokenService } from '../../../core/http/access-token.service';

describe('PictureUploadComponent', () => {
  let component: PictureUploadComponent;
  let fixture: ComponentFixture<PictureUploadComponent>;
  let userService: UserService;
  let errorsService: ErrorsService;
  const TIMESTAMP = 123456789;

  beforeEach(async(() => {
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
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userService = TestBed.inject(UserService);
    errorsService = TestBed.inject(ErrorsService);
  });

  describe('onUploadOutput', () => {
    let uploadEvent: UploadInput;

    beforeEach(() => {
      component.uploadInput.subscribe((event) => {
        uploadEvent = event;
      });
    });

    it('should send upload event if event is addedToQueue', () => {
      spyOn<any>(window, 'Date').and.returnValue({ getTime: () => TIMESTAMP });
      const headers = {
        [TOKEN_AUTHORIZATION_HEADER_NAME]: 'Bearer thetoken',
        [TOKEN_SIGNATURE_HEADER_NAME]: 'thesignature',
        [TOKEN_TIMESTAMP_HEADER_NAME]: `${TIMESTAMP}`,
      };
      component.onUploadOutput({
        type: 'addedToQueue',
        file: UPLOAD_FILE,
      });

      expect(component.file).toEqual(UPLOAD_FILE);
      expect(uploadEvent).toEqual({
        type: 'uploadFile',
        url: `${environment.baseUrl}api/v3/users/me/image`,
        method: 'POST',
        fieldName: 'image',
        headers,
        file: UPLOAD_FILE,
      });
    });

    it('should set file if event is uploading', () => {
      component.onUploadOutput({
        type: 'uploading',
        file: UPLOAD_FILE,
      });

      expect(component.file).toEqual(UPLOAD_FILE);
    });

    it('should send remove event and set image if event is done and status 204', () => {
      const file = { ...UPLOAD_FILE };
      file.progress.data.responseStatus = 204;

      component.onUploadOutput({
        type: 'done',
        file: file,
      });

      expect(uploadEvent).toEqual({
        type: 'remove',
        id: UPLOAD_FILE_ID,
      });
      expect(userService.user.image.urls_by_size.medium).toBe(
        UPLOAD_FILE.preview
      );
    });

    it('should show error if event is done and status not 204', () => {
      spyOn(errorsService, 'i18nError');
      const file = <UploadFile>{ ...UPLOAD_FILE };
      const ERROR = 'error';
      file.progress.data.responseStatus = 0;
      file.response = {
        message: ERROR,
      };

      component.onUploadOutput({
        type: 'done',
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
        type: 'rejected',
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
