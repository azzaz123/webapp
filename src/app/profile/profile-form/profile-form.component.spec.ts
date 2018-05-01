import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ProfileFormComponent } from './profile-form.component';
import { ExitConfirmationModalComponent } from '../../catalog/edit/exit-confirmation-modal/exit-confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../core/user/user.service';
import { USER_DATA, USER_EDIT_DATA, USER_LOCATION_COORDINATES } from '../../../tests/user.fixtures.spec';
import { Observable } from 'rxjs/Observable';
import { ErrorsService } from '../../core/errors/errors.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

describe('ProfileFormComponent', () => {
  let component: ProfileFormComponent;
  let fixture: ComponentFixture<ProfileFormComponent>;
  let modalService: NgbModal;
  let userService: UserService;
  let errorsService: ErrorsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileFormComponent ],
      providers: [
        {
          provide: NgbModal, useValue: {
          open() {
            return {
              result: Promise.resolve(true)
            };
          }
        }
        },
        {
          provide: UserService, useValue: {
          edit() {
            return Observable.of({});
          }
        }
        },
        {
          provide: ErrorsService, useValue: {
          i18nError() {
          },
          i18nSuccess() {
          }
        }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFormComponent);
    component = fixture.componentInstance;
    component.profileForm = new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      birth_date: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      location: new FormGroup({
        address: new FormControl('', Validators.required),
        latitude: new FormControl(),
        longitude: new FormControl(),
      })
    });
    fixture.detectChanges();
    modalService = TestBed.get(NgbModal);
    userService = TestBed.get(UserService);
    errorsService = TestBed.get(ErrorsService);
  });

  describe('ngOnInit', () => {

    it('should detect changed if form values changes', () => {
      component.profileForm.patchValue({
        first_name: USER_DATA.first_name,
        last_name: USER_DATA.last_name
      });

      component.ngOnInit();

      component.profileForm.get('first_name').patchValue('new first_name');
      fixture.detectChanges();

      expect(component['hasNotSavedChanges']).toBe(true);
    });
  });

  describe('canExit', () => {
    it('should return true if there are no unsaved changes', () => {
      const result = component.canExit();

      expect(result).toBeTruthy();
    });

    it('should open modal if there are unsaved changes', fakeAsync(() => {
      let notSavedChanges: boolean;
      component['hasNotSavedChanges'] = true;
      spyOn(modalService, 'open').and.callThrough();

      (<Promise<boolean>>component.canExit()).then((value: boolean) => {
        notSavedChanges = value;
      });
      tick();

      expect(modalService.open).toHaveBeenCalledWith(ExitConfirmationModalComponent, {
        backdrop: 'static'
      });
      expect(notSavedChanges).toBeTruthy();
    }));
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
        component['hasNotSavedChanges'] = true;

        component.onSubmit();
      });

      it('should call edit', () => {
        expect(userService.edit).toHaveBeenCalledWith(USER_EDIT_DATA);
      });

      it('should call i18nSuccess', () => {
        expect(errorsService.i18nSuccess).toHaveBeenCalledWith('userEdited');
      });

      it('should set hasNotSavedChanges to false', () => {
        expect(component['hasNotSavedChanges']).toBe(false);
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

});
