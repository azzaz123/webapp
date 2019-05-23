import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { competitorLinks, ProfileInfoComponent } from './profile-info.component';
import { NgbButtonsModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../core/http/http.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { UserService } from '../../core/user/user.service';
import { MockBackend } from '@angular/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { I18nService } from '../../core/i18n/i18n.service';
import { Observable } from 'rxjs';
import {
  MOCK_FULL_USER,
  USER_DATA,
  USER_EXTRA_INFO,
  USER_LOCATION_COORDINATES
} from '../../../tests/user.fixtures.spec';
import { ProfileFormComponent } from '../../shared/profile/profile-form/profile-form.component';
import { SwitchComponent } from '../../shared/switch/switch.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UnsubscribeModalComponent } from '../unsubscribe-modal/unsubscribe-modal.component';
import { BecomeProModalComponent } from '../become-pro-modal/become-pro-modal.component';
import { LOCATION_MODAL_TIMEOUT } from '../../shared/geolocation/location-select/location-select.component';
import { StripeService } from '../../core/stripe/stripe.service';

const USER_BIRTH_DATE = '2018-04-12';
const USER_GENDER = 'M';

describe('ProfileInfoComponent', () => {
  let component: ProfileInfoComponent;
  let fixture: ComponentFixture<ProfileInfoComponent>;
  let userService: UserService;
  let errorsService: ErrorsService;
  let http: HttpService;
  let modalService: NgbModal;
  let stripeService: StripeService;
  let mockBackend: MockBackend;

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
          updateStoreLocation() {
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
            return {
              componentInstance: componentInstance,
              result: Promise.resolve(true)
            };
          }
        }
        },
        {
          provide: StripeService, useValue: {
          isPaymentMethodStripe() {
            return true
          }
        }
        },
      ],
      declarations: [ProfileInfoComponent, ProfileFormComponent, SwitchComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileInfoComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    errorsService = TestBed.get(ErrorsService);
    http = TestBed.get(HttpService);
    modalService = TestBed.get(NgbModal);
    stripeService = TestBed.get(StripeService);
    mockBackend = TestBed.get(MockBackend);
    spyOn(userService, 'me').and.callThrough();
    component.formComponent = TestBed.createComponent(ProfileFormComponent).componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {

    it('should call userService.me', () => {
      expect(userService.me).toHaveBeenCalled();
    });

    it('should call stripeService.isPaymentMethodStripe', () => {
      spyOn(stripeService, 'isPaymentMethodStripe').and.returnValue(true);

      component.ngOnInit();

      expect(stripeService.isPaymentMethodStripe).toHaveBeenCalled();
      expect(component.isStripe).toBe(true);
    });

    it('should set profileForm with user data', () => {
      expect(component.profileForm.get('first_name').value).toBe(USER_DATA.first_name);
      expect(component.profileForm.get('last_name').value).toBe(USER_DATA.last_name);
      expect(component.profileForm.get('birth_date').value).toBe(USER_BIRTH_DATE);
      expect(component.profileForm.get('gender').value).toBe(USER_GENDER);
      expect(component.profileForm.get('extra_info').value).toEqual(USER_EXTRA_INFO);
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

    it('should not call submit  when have competitors link', () => {
      spyOn(component.formComponent, 'onSubmit');

      competitorLinks.forEach(competitorLink => {
        component.profileForm.get('extra_info').get('link').setValue(competitorLink);
        component.onSubmit();

        expect(component.formComponent.onSubmit).not.toHaveBeenCalled();
      });
    });

    it('should throw error toast when have competitors link', () => {
      spyOn(errorsService, 'i18nError');

      competitorLinks.forEach(competitorLink => {
        component.profileForm.get('extra_info').get('link').setValue(competitorLink);
        component.onSubmit();

        expect(errorsService.i18nError).toHaveBeenCalledWith('linkError');
      });
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
