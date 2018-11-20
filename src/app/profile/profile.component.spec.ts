import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { Observable } from 'rxjs/Observable';
import { Response, ResponseOptions } from '@angular/http';
import { NgbButtonsModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  MOCK_FULL_USER, MOCK_USER, USER_DATA, USER_EXTRA_INFO, USER_LOCATION_COORDINATES,
  USER_URL, MOTORPLAN_DATA
} from '../../tests/user.fixtures.spec';
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
import { I18nService } from '../core/i18n/i18n.service';
import { BecomeProModalComponent } from './become-pro-modal/become-pro-modal.component';
import { LOCATION_MODAL_TIMEOUT } from '../shared/geolocation/location-select/location-select.component';

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
  const mockMotorPlan = {
    type:    'motor_plan_pro',
    subtype: 'sub_premium'
  };
  const componentInstance: any = {
    init: jasmine.createSpy('init')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NgbButtonsModule
      ],
      providers: [
        ...TEST_HTTP_PROVIDERS,
        I18nService,
        {
          provide: UserService, useValue: {
          user: MOCK_FULL_USER,
          me() {
            return Observable.of(MOCK_FULL_USER);
          },
          getMotorPlan() {
            return Observable.of({
              motorPlan: mockMotorPlan
            });
          },
          updateStoreLocation() {
            return Observable.of({})
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
              componentInstance: componentInstance,
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
      expect(component.userUrl).toBe(USER_URL);
    });

    it('should set profileForm with user data', () => {
      expect(component.profileForm.get('first_name').value).toBe(USER_DATA.first_name);
      expect(component.profileForm.get('last_name').value).toBe(USER_DATA.last_name);
      expect(component.profileForm.get('birth_date').value).toBe(USER_BIRTH_DATE);
      expect(component.profileForm.get('gender').value).toBe(USER_GENDER);
      expect(component.profileForm.get('extra_info').value).toEqual(USER_EXTRA_INFO);
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

    it('should subscribe to getMotorPlan', () => {
      spyOn(userService, 'getMotorPlan').and.callThrough();

      component.ngOnInit();

      expect(userService.getMotorPlan).toHaveBeenCalled();
    });

    it('should set the translated user motor plan', () => {
      spyOn(userService, 'getMotorPlan').and.returnValue(Observable.of(MOTORPLAN_DATA));

      component.ngOnInit();

      expect(component.motorPlan).toEqual({subtype: 'sub_premium', label: 'Super Motor Plan'});
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

      expect(component.formComponent.onSubmit).toHaveBeenCalledWith(MOCK_FULL_USER);
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

  describe('openBecomeProModal', () => {
    it('should open modal if user is not featured', () => {
      component.user.featured = false;
      spyOn(modalService, 'open');

      component.openBecomeProModal();

      expect(modalService.open).toHaveBeenCalledWith(BecomeProModalComponent, {windowClass: 'become-pro'});
    });
  });

  describe('open', () => {
    let element: any;
    beforeEach(fakeAsync(() => {
      element = {
        blur() {
        }
      };
      spyOn<any>(element, 'blur');
    }));

    describe('with no user values', () => {
      beforeEach(fakeAsync(() => {
        spyOn(modalService, 'open').and.returnValue({
          componentInstance: componentInstance,
          result: Promise.resolve(USER_LOCATION_COORDINATES)
        });
        spyOn(userService, 'updateStoreLocation').and.callThrough();
        component.open(element);
        tick(LOCATION_MODAL_TIMEOUT);
      }));

      it('should blur element', () => {
        expect(element.blur).toHaveBeenCalled();
      });

      it('should open modal', () => {
        expect(modalService.open).toHaveBeenCalled();
      });

      it('should set location', () => {
        expect(component.profileForm.get('extra_info.address').value).toEqual(USER_LOCATION_COORDINATES.name);
        expect(component.user.extraInfo.latitude).toEqual(USER_LOCATION_COORDINATES.latitude);
        expect(component.user.extraInfo.longitude).toEqual(USER_LOCATION_COORDINATES.longitude);
      });

      it('should call init with no params', () => {
        expect(componentInstance.init).toHaveBeenCalled();
      });

      it('should call updateStoreLocation', () => {
        expect(userService.updateStoreLocation).toHaveBeenCalledWith(USER_LOCATION_COORDINATES);
      });
    });

    describe('with user values', () => {
      it('should set location on modal instance', fakeAsync(() => {
        component.user.extraInfo.latitude = USER_LOCATION_COORDINATES.latitude;
        component.user.extraInfo.longitude = USER_LOCATION_COORDINATES.longitude;
        component.user.extraInfo.address = USER_LOCATION_COORDINATES.name;

        component.open(element);
        tick(LOCATION_MODAL_TIMEOUT);

        expect(componentInstance.init).toHaveBeenCalledWith(USER_LOCATION_COORDINATES);
      }));
    });

  });
});
