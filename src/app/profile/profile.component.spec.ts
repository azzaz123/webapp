import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { Observable } from 'rxjs';
import { Response, ResponseOptions } from '@angular/http';
import { NgbButtonsModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MOCK_FULL_USER, USER_DATA, USER_URL, USER_WEB_SLUG } from '../../tests/user.fixtures.spec';
import { UnsubscribeModalComponent } from './unsubscribe-modal/unsubscribe-modal.component';
import { ErrorsService } from '../core/errors/errors.service';
import { HttpService } from '../core/http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../tests/utils.spec';
import { PrivacyService } from '../core/privacy/privacy.service';
import { PrivacyRequestData } from '../core/privacy/privacy.interface';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
  MOCK_PRIVACY_ALLOW,
  MOCK_PRIVACY_DISALLOW,
  MOCK_PRIVACY_UNKNOW_ALLOW,
  MOCK_PRIVACY_UNKNOW_DISALLOW
} from '../core/privacy/privacy.fixtures.spec';
import { ProfileFormComponent } from '../shared/profile/profile-form/profile-form.component';
import { SwitchComponent } from './../shared/switch/switch.component';
import { environment } from '../../environments/environment';

const USER_BIRTH_DATE = '2018-04-12';
const USER_GENDER = 'M';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: UserService;
  let errorsService: ErrorsService;
  let http: HttpService;
  let modalService: NgbModal;
  let privacyService: PrivacyService;
  let mockBackend: MockBackend;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NgbButtonsModule
      ],
      providers: [
        ...TEST_HTTP_PROVIDERS,
        {
          provide: UserService, useValue: {
          user: MOCK_FULL_USER,
          me() {
            return Observable.of(MOCK_FULL_USER);
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
            return {
              result: Promise.resolve(true)
            };
          }
        }
        },
        PrivacyService
      ],
      declarations: [ProfileComponent, ProfileFormComponent, SwitchComponent],
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
    privacyService = TestBed.get(PrivacyService);
    mockBackend = TestBed.get(MockBackend);
    spyOn(userService, 'me').and.callThrough();
    component.formComponent = TestBed.createComponent(ProfileFormComponent).componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {

    it('should call userService.me', () => {
      expect(userService.me).toHaveBeenCalled();
    });

    it('should set the private user variable with the content of the user', () => {
      expect(component.user).toBe(MOCK_FULL_USER);
    });

    it('should set userUrl', () => {
      expect(component.userUrl).toBe(environment.siteUrl.replace('es', 'www') + 'user/' + USER_WEB_SLUG);
    });

    it('should set profileForm with user data', () => {
      expect(component.profileForm.get('first_name').value).toBe(USER_DATA.first_name);
      expect(component.profileForm.get('last_name').value).toBe(USER_DATA.last_name);
      expect(component.profileForm.get('birth_date').value).toBe(USER_BIRTH_DATE);
      expect(component.profileForm.get('gender').value).toBe(USER_GENDER);
    });

    it('should subscribe privacyService allowSegmentation$', () => {
      spyOn(privacyService.allowSegmentation$, 'subscribe');

      component.ngOnInit();

      expect(privacyService.allowSegmentation$.subscribe).toHaveBeenCalled();
    });

    it('should change allowSegmentation value to false when gdrp_display is false', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toBe(environment.baseUrl + 'api/v3/privacy');
        const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(MOCK_PRIVACY_DISALLOW)});
        connection.mockRespond(new Response(res));
      });

      component.ngOnInit();
      privacyService.getPrivacyList().subscribe();

      expect(component.allowSegmentation).toBe(false);
    });

    it('should change allowSegmentation value to true when gdrp_display is true', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toBe(environment.baseUrl + 'api/v3/privacy');
        const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(MOCK_PRIVACY_ALLOW)});
        connection.mockRespond(new Response(res));
      });

      component.ngOnInit();
      privacyService.getPrivacyList().subscribe();

      expect(component.allowSegmentation).toBe(true);
    });

    it('should change allowSegmentation value to false when gdrp_display status is unknow, and value is true', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toBe(environment.baseUrl + 'api/v3/privacy');
        const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(MOCK_PRIVACY_UNKNOW_ALLOW)});
        connection.mockRespond(new Response(res));
      });

      component.ngOnInit();
      privacyService.getPrivacyList().subscribe();

      expect(component.allowSegmentation).toBe(false);
    });

    it('should change allowSegmentation value to false when gdrp_display status is unknow, and value is false', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toBe(environment.baseUrl + 'api/v3/privacy');
        const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(MOCK_PRIVACY_UNKNOW_DISALLOW)});
        connection.mockRespond(new Response(res));
      });

      component.ngOnInit();
      privacyService.getPrivacyList().subscribe();

      expect(component.allowSegmentation).toBe(false);
    });
  });

  describe('canExit', () => {
    it('should call canExit', () => {
      spyOn(component.formComponent, 'canExit');

      component.canExit();

      expect(component.formComponent.canExit).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should call onSubmit', () => {
      spyOn(component.formComponent, 'onSubmit');

      component.onSubmit();

      expect(component.formComponent.onSubmit).toHaveBeenCalled();
    });
  });

  describe('openUnsubscribeModal', () => {
    it('should open modal', () => {
      spyOn(modalService, 'open');

      component.openUnsubscribeModal();

      expect(modalService.open).toHaveBeenCalledWith(UnsubscribeModalComponent, {windowClass: 'unsubscribe'});
    });
  });

  describe('validation', () => {

    it('should set birth_date valid if value is valid', () => {
      component.profileForm.get('birth_date').setValue('1987-05-25');

      expect(component.profileForm.get('birth_date').valid).toBe(true);
    });

    it('should set birth_date invalid if value is invalid', () => {
      component.profileForm.get('birth_date').setValue('19870-05-25');

      expect(component.profileForm.get('birth_date').valid).toBe(false);
    });
  });

  describe('switchAllowSegmentation', () => {
    it('should call updatePrivacy with PrivacyRequestData', () => {
      spyOn(privacyService, 'updatePrivacy').and.returnValue(Observable.of(MOCK_PRIVACY_ALLOW));
      const allowSegmentationData: PrivacyRequestData = {
        gdpr_display: {
          allow: false,
          version: '0'
        }
      };

      component.switchAllowSegmentation(false);

      expect(privacyService.updatePrivacy).toHaveBeenCalledWith(allowSegmentationData);
    });
  });
});
