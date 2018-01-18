import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TEST_HTTP_PROVIDERS, User, USER_DATA, HttpService, IMAGE } from 'shield';
import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { Observable } from 'rxjs/Observable';
import { NgbButtonsModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { USER_EDIT_DATA, USER_LOCATION_COORDINATES } from '../../tests/user.fixtures';
import { UPLOAD_FILE, UPLOAD_FILE_ID } from '../../tests/upload.fixtures';
import { UploadInput } from 'ngx-uploader';
import { environment } from '../../environments/environment';
import { UnsubscribeModalComponent } from './unsubscribe-modal/unsubscribe-modal.component';
import { ErrorsService } from '../core/errors/errors.service';

const MOCK_USER = new User(
  USER_DATA.id,
  USER_DATA.micro_name,
  USER_DATA.image,
  USER_DATA.location,
  USER_DATA.stats,
  USER_DATA.validations,
  USER_DATA.verification_level,
  USER_DATA.scoring_stars,
  USER_DATA.scoring_starts,
  USER_DATA.response_rate,
  USER_DATA.online,
  USER_DATA.type,
  USER_DATA.received_reports,
  USER_DATA.web_slug,
  USER_DATA.first_name,
  USER_DATA.last_name,
  USER_DATA.birth_date,
  USER_DATA.gender
);

const USER_BIRTH_DATE = '1987-02-10';
const USER_GENDER = 'M';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: UserService;
  let errorsService: ErrorsService;
  let http: HttpService;
  let modalService: NgbModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NgbButtonsModule
      ],
      providers: [
        ...TEST_HTTP_PROVIDERS,
        {
          provide: UserService, useValue: {
          user: MOCK_USER,
          me() {
            return Observable.of(MOCK_USER);
          },
          edit() {
            return Observable.of({});
          }
        }
        },
        {
          provide: 'SUBDOMAIN', useValue: 'www'
        },
        {
          provide: ErrorsService, useValue: {
          i18nError() {
          },
          i18nSuccess() {
          }
        }
        },
        {
          provide: NgbModal, useValue: {
          open() {
          }
        }
        }
      ],
      declarations: [ProfileComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    errorsService = TestBed.get(ErrorsService);
    http = TestBed.get(HttpService);
    modalService = TestBed.get(NgbModal);
    spyOn(userService, 'me').and.callThrough();
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {

    it('should call userService.me', () => {
      expect(userService.me).toHaveBeenCalled();
    });

    it('should set the private user variable with the content of the user', () => {
      expect(component.user).toBe(MOCK_USER);
    });

    it('should set userUrl', () => {
      expect(component.userUrl).toBe('https://www.wallapop.com/user/webslug-l1kmzn82zn3p');
    });

    it('should set profileForm with user data', () => {
      expect(component.profileForm.get('first_name').value).toBe(USER_DATA.first_name);
      expect(component.profileForm.get('last_name').value).toBe(USER_DATA.last_name);
      expect(component.profileForm.get('birth_date').value).toBe(USER_BIRTH_DATE);
      expect(component.profileForm.get('gender').value).toBe(USER_GENDER);
    });
  });

  describe('onSubmit', () => {

    describe('valid form', () => {

      beforeEach(() => {
        spyOn(userService, 'edit').and.callThrough();
        spyOn(errorsService, 'i18nSuccess');
        component.profileForm.patchValue(USER_EDIT_DATA);
        component.profileForm.get('location.address').patchValue(USER_LOCATION_COORDINATES.name);
        component.profileForm.get('location.latitude').patchValue(USER_LOCATION_COORDINATES.latitude);
        component.profileForm.get('location.longitude').patchValue(USER_LOCATION_COORDINATES.longitude);

        component.onSubmit();
      });

      it('should call edit', () => {
        expect(userService.edit).toHaveBeenCalledWith(USER_EDIT_DATA);
      });

      it('should call i18nSuccess', () => {
        expect(errorsService.i18nSuccess).toHaveBeenCalledWith('userEdited');
      });
    });

    describe('invalid form', () => {

      beforeEach(() => {
        spyOn(errorsService, 'i18nError');
        component.profileForm.get('first_name').patchValue('');
        component.profileForm.get('last_name').patchValue('');
        component.profileForm.get('birth_date').patchValue('');
        component.profileForm.get('gender').patchValue('');

        component.onSubmit();
      });

      it('should set dirty invalid fields', () => {
        expect(component.profileForm.get('first_name').dirty).toBeTruthy();
        expect(component.profileForm.get('last_name').dirty).toBeTruthy();
        expect(component.profileForm.get('birth_date').dirty).toBeTruthy();
        expect(component.profileForm.get('gender').dirty).toBeTruthy();
        expect(component.profileForm.get('location.address').dirty).toBeTruthy();
      });

      it('should call i18nError if form is invalid', () => {
        expect(errorsService.i18nError).toHaveBeenCalledWith('formErrors');
      });
    });
  });

  describe('onUploadOutput', () => {

    let uploadEvent: UploadInput;

    beforeEach(() => {
      component.uploadInput.subscribe((event) => {
        uploadEvent = event;
      });
    });

    it('should send upload event if event is addedToQueue', () => {
      const headers = {
        'Authorization': 'Bearer thetoken'
      };
      spyOn(http, 'getOptions').and.returnValue({
        headers: {
          toJSON() {
            return headers;
          }
        }
      });

      component.onUploadOutput({
        type: 'addedToQueue',
        file: UPLOAD_FILE
      });

      expect(component.file).toEqual(UPLOAD_FILE);
      expect(uploadEvent).toEqual({
        type: 'uploadFile',
        url: environment.baseUrl + 'api/v3/users/me/image',
        method: 'POST',
        fieldName: 'image',
        headers: headers,
        file: UPLOAD_FILE
      });
      expect(http.getOptions).toHaveBeenCalledWith(null, 'api/v3/users/me/image', 'POST');
    });

    it('should set file if event is uploading', () => {
      component.onUploadOutput({
        type: 'uploading',
        file: UPLOAD_FILE
      });

      expect(component.file).toEqual(UPLOAD_FILE);
    });

    it('should send remove event and set image if event is done and status 204', () => {
      const file = {...UPLOAD_FILE};
      file.progress.data.responseStatus = 204;

      component.onUploadOutput({
        type: 'done',
        file: file
      });

      expect(uploadEvent).toEqual({
        type: 'remove',
        id: UPLOAD_FILE_ID
      });
      expect(userService.user.image.urls_by_size.medium).toBe(UPLOAD_FILE.preview);
    });

    it('should shoew error if event is done and status not 204', () => {
      spyOn(errorsService, 'i18nError');
      const file = {...UPLOAD_FILE};
      file.progress.data.responseStatus = 0;

      component.onUploadOutput({
        type: 'done',
        file: file
      });

      expect(errorsService.i18nError).toHaveBeenCalledWith('serverError');
    });

  });

  describe('openUnsubscribeModal', () => {
    it('should open modal', () => {
      spyOn(modalService, 'open');

      component.openUnsubscribeModal();

      expect(modalService.open).toHaveBeenCalledWith(UnsubscribeModalComponent, {windowClass: 'unsubscribe'});
    });
  });
});
