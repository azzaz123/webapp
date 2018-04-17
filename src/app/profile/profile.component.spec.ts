import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { Observable } from 'rxjs/Observable';
import { NgbButtonsModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { USER_DATA } from '../../tests/user.fixtures.spec';
import { UnsubscribeModalComponent } from './unsubscribe-modal/unsubscribe-modal.component';
import { ErrorsService } from '../core/errors/errors.service';
import { User } from '../core/user/user';
import { ProfileFormComponent } from './profile-form/profile-form.component';

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
  let modalService: NgbModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NgbButtonsModule
      ],
      providers: [
        {
          provide: UserService, useValue: {
          user: MOCK_USER,
          me() {
            return Observable.of(MOCK_USER);
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
        }
      ],
      declarations: [ProfileComponent, ProfileFormComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    errorsService = TestBed.get(ErrorsService);
    modalService = TestBed.get(NgbModal);
    spyOn(userService, 'me').and.callThrough();
    component.formComponent = TestBed.createComponent(ProfileFormComponent).componentInstance;
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
});
