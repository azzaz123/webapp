import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ProfileFormComponent } from './profile-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorsService } from '../../../core/errors/errors.service';
import { USER_DATA } from '../../../../tests/user.fixtures.spec';
import { ExitConfirmationModalComponent } from '../../exit-confirmation-modal/exit-confirmation-modal.component';

describe('ProfileFormComponent', () => {
  let component: ProfileFormComponent;
  let fixture: ComponentFixture<ProfileFormComponent>;
  let modalService: NgbModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileFormComponent],
      providers: [
        {
          provide: NgbModal,
          useValue: {
            open() {
              return {
                result: Promise.resolve(true),
              };
            },
          },
        },
        {
          provide: ErrorsService,
          useValue: {
            i18nError() {},
            i18nSuccess() {},
          },
        },
      ],
    }).compileComponents();
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
      }),
    });
    fixture.detectChanges();
    modalService = TestBed.inject(NgbModal);
  });

  describe('ngOnInit', () => {
    it('should enable the save button if form values changed', () => {
      component.profileForm.patchValue({
        first_name: USER_DATA.first_name,
        last_name: USER_DATA.last_name,
      });

      component.ngOnInit();
      component.profileForm.get('first_name').patchValue('new first_name');

      expect(component.hasNotSavedChanges).toBe(true);
    });

    it('should disable the save button if any form value changed', () => {
      component.profileForm.patchValue({
        first_name: USER_DATA.first_name,
        last_name: USER_DATA.last_name,
      });

      component.ngOnInit();
      component.profileForm.get('first_name').patchValue(USER_DATA.first_name);

      expect(component.hasNotSavedChanges).toBe(false);
    });
  });

  describe('initFormControl', () => {
    it('should disable the save button', () => {
      component.hasNotSavedChanges = true;

      component.initFormControl();

      expect(component.hasNotSavedChanges).toBe(false);
    });

    it('should set the oldFormValue variable with the new form value ', () => {
      component.profileForm.patchValue({
        first_name: 'Alex',
        last_name: USER_DATA.last_name,
      });

      component.initFormControl();

      expect(component.profileForm.value).toEqual({
        ...component.profileForm.value,
        first_name: 'Alex',
      });
    });
  });

  describe('canExit', () => {
    it('should return true if there are no unsaved changes', () => {
      const result = component.canExit();

      expect(result).toBeTruthy();
    });

    it('should open modal if there are unsaved changes', fakeAsync(() => {
      let notSavedChanges: boolean;
      component.hasNotSavedChanges = true;
      spyOn(modalService, 'open').and.callThrough();

      (<Promise<boolean>>component.canExit()).then((value: boolean) => {
        notSavedChanges = value;
      });
      tick();

      expect(modalService.open).toHaveBeenCalledWith(
        ExitConfirmationModalComponent,
        {
          backdrop: 'static',
        }
      );
      expect(notSavedChanges).toBeTruthy();
    }));
  });
});
