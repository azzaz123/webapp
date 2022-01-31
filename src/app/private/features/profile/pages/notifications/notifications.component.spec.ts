import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorsService } from '@core/errors/errors.service';
import { UserService } from '@core/user/user.service';
import { MOCK_FULL_USER } from '@fixtures/user.fixtures.spec';
import { NgbButtonsModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { of } from 'rxjs';
import { UnsubscribeModalComponent } from '../../modal/unsubscribe-modal/unsubscribe-modal.component';
import { NotificationsComponent } from './notifications.component';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { PERMISSIONS } from '@core/user/user-constants';
import { By } from '@angular/platform-browser';
import { MeApiService } from '@api/me/me-api.service';

const USER_BIRTH_DATE = '2018-04-12';
const USER_GENDER = 'M';

@Component({
  selector: 'tsl-stripe-cards',
  template: '',
})
class MockStripeComponent {}

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let modalService: NgbModal;
  let meApiService: MeApiService;
  let errorsService: ErrorsService;
  let permissionsService: NgxPermissionsService;

  const componentInstance: any = {
    init: jasmine.createSpy('init'),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, FormsModule, NgbButtonsModule, NgxPermissionsModule.forRoot()],
        providers: [
          {
            provide: MeApiService,
            useValue: {
              user: MOCK_FULL_USER,
              edit() {
                return of({});
              },
            },
          },
        ],
        declarations: [NotificationsComponent, MockStripeComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    // component.formComponent = TestBed.inject(ProfileFormComponent);
    meApiService = TestBed.inject(MeApiService);
    fixture.detectChanges();
    errorsService = TestBed.inject(ErrorsService);
    modalService = TestBed.inject(NgbModal);
    permissionsService = TestBed.inject(NgxPermissionsService);
  });

  // describe('initForm', () => {
  //   it('should set profileForm with user data', () => {
  //     component.initForm();

  //     expect(component.profileForm.get('birth_date').value).toBe(USER_BIRTH_DATE);
  //     expect(component.profileForm.get('gender').value).toBe(USER_GENDER);
  //   });
  // });

  // describe('onSubmit', () => {
  //   describe('valid form', () => {
  //     beforeEach(() => {
  //       spyOn(userService, 'edit').and.callThrough();
  //       spyOn(errorsService, 'i18nSuccess');
  //       component.profileForm.patchValue({
  //         birth_date: USER_BIRTH_DATE,
  //         gender: USER_GENDER,
  //       });

  //       component.onSubmit();
  //     });

  //     it('should call edit', () => {
  //       expect(userService.edit).toHaveBeenCalledWith({
  //         birth_date: USER_BIRTH_DATE,
  //         gender: USER_GENDER,
  //       });
  //     });

  //     it('should call i18nSuccess', () => {
  //       expect(errorsService.i18nSuccess).toHaveBeenCalledWith(TRANSLATION_KEY.USER_EDITED);
  //     });
  //   });
});
