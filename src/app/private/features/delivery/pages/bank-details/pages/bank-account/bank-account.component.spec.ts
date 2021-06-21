import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nService } from '@core/i18n/i18n.service';
import { UuidService } from '@core/uuid/uuid.service';
import {
  MOCK_EMPTY_BANK_ACCOUNT,
  MOCK_BANK_ACCOUNT,
  MOCK_BANK_ACCOUNT_INVALID,
} from '@fixtures/private/delivery/bank-account/bank-account.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { NumbersOnlyDirectiveModule } from '@shared/directives/numbers-only/numbers-only.directive.module';
import { SeparateWordByCharacterPipe } from '@shared/pipes/separate-word-by-character/separate-word-by-character.pipe';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { of, throwError } from 'rxjs';
import { DELIVERY_PATHS } from '../../../../delivery-routing-constants';
import { BankAccountApiService } from '../../../../services/api/bank-account-api/bank-account-api.service';
import { BankAccountService } from '../../../../services/bank-account/bank-account.service';
import { MapBankAccountService } from '../../../../services/bank-account/map-bank-account/map-bank-account.service';

import { BankAccountComponent } from './bank-account.component';

describe('BankAccountComponent', () => {
  const messageErrorSelector = '.BankAccount__message--error';
  let component: BankAccountComponent;
  let fixture: ComponentFixture<BankAccountComponent>;
  let bankAccountService: BankAccountService;
  let toastService: ToastService;
  let router: Router;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NumbersOnlyDirectiveModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [BankAccountComponent, ProfileFormComponent, SeparateWordByCharacterPipe],
      providers: [
        FormBuilder,
        BankAccountService,
        BankAccountApiService,
        MapBankAccountService,
        {
          provide: UuidService,
          useValue: {
            getUUID() {
              return 'FAKE_UUID';
            },
          },
        },
        {
          provide: I18nService,
          useValue: {
            translate() {
              return '';
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;
    bankAccountService = TestBed.inject(BankAccountService);
    toastService = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we initialize the form...', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should build the form', () => {
      expect(component.bankAccountForm.value).toStrictEqual(MOCK_EMPTY_BANK_ACCOUNT);
    });

    it('should set the max iban length', () => {
      expect(component.maxLengthIBAN).toBe(49);
    });
  });

  describe('initForm', () => {
    describe(`when we don't have the main bank account created yet...`, () => {
      beforeEach(() => {
        spyOn(bankAccountService, 'get').and.returnValue(of(null));
        spyOn(component.formComponent, 'initFormControl');
        spyOn(component.bankAccountForm, 'updateValueAndValidity');

        triggerProfileFormInit();
      });

      it('should request the main account', () => {
        expect(bankAccountService.get).toHaveBeenCalled();
      });

      it('should initialize the form control', () => {
        expect(component.formComponent.initFormControl).toHaveBeenCalled();
      });

      it('should update the value and the validity of the bank account form ', () => {
        expect(component.bankAccountForm.updateValueAndValidity).toHaveBeenCalled();
      });

      it('should set loading to false', () => {
        expect(component.loading).toBe(false);
      });
    });

    describe('when we already have the main bank account created yet...', () => {
      beforeEach(() => {
        spyOn(bankAccountService, 'get').and.returnValue(of(MOCK_BANK_ACCOUNT));
        spyOn(component.formComponent, 'initFormControl');
        spyOn(component.bankAccountForm, 'updateValueAndValidity');

        triggerProfileFormInit();
      });

      it('should request the main account', () => {
        expect(bankAccountService.get).toHaveBeenCalled();
      });

      it('should patch the main bank account value on the form', () => {
        expect(component.bankAccountForm.getRawValue()).toStrictEqual(MOCK_BANK_ACCOUNT);
      });

      it('should initialize the form control', () => {
        expect(component.formComponent.initFormControl).toHaveBeenCalled();
      });

      it('should set loading to false', () => {
        expect(component.loading).toBe(false);
      });
    });
  });

  describe('onSubmit', () => {
    describe('when the form is valid...', () => {
      describe('and the bank account is new...', () => {
        beforeEach(() => {
          spyOn(bankAccountService, 'get').and.returnValue(of(null));
          spyOn(toastService, 'show');
          spyOn(router, 'navigate');

          component.initForm();
          component.bankAccountForm.setValue(MOCK_BANK_ACCOUNT);
        });

        describe('and the petition succeed...', () => {
          beforeEach(() => {
            spyOn(bankAccountService, 'create').and.returnValue(of(null));

            triggerFormSubmit();
          });

          it('should call the create endpoint', () => {
            expect(bankAccountService.create).toHaveBeenCalledWith(MOCK_BANK_ACCOUNT);
          });

          it('should show a succeed message', () => {
            expect(toastService.show).toHaveBeenCalledWith({
              text: '',
              type: 'success',
            });
          });

          it('should redirect to the bank details page', () => {
            expect(router.navigate).toHaveBeenCalledWith([`${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.BANK_DETAILS}`]);
          });
        });

        describe('and the petition fails...', () => {
          beforeEach(() => {
            spyOn(bankAccountService, 'create').and.returnValue(throwError('network error'));

            triggerFormSubmit();
          });

          it('should call the create endpoint', () => {
            expect(bankAccountService.create).toHaveBeenCalledWith(MOCK_BANK_ACCOUNT);
          });

          it('should show an error toast', () => {
            expect(toastService.show).toHaveBeenCalledWith({
              text: '',
              type: 'error',
            });
          });

          it('should NOT redirect to the bank details page', () => {
            expect(router.navigate).not.toHaveBeenCalled();
          });
        });
      });

      describe('and the bank account is an existing one...', () => {
        beforeEach(() => {
          spyOn(bankAccountService, 'get').and.returnValue(of(MOCK_BANK_ACCOUNT));
          spyOn(toastService, 'show');
          spyOn(router, 'navigate');

          component.initForm();
        });

        describe('and the petition succeed...', () => {
          beforeEach(() => {
            spyOn(bankAccountService, 'update').and.returnValue(of(null));

            triggerFormSubmit();
          });

          it('should call the edit endpoint', () => {
            expect(bankAccountService.update).toHaveBeenCalledWith(MOCK_BANK_ACCOUNT);
          });

          it('should show a succeed message', () => {
            expect(toastService.show).toHaveBeenCalledWith({
              text: '',
              type: 'success',
            });
          });

          it('should redirect to the bank details page', () => {
            expect(router.navigate).toHaveBeenCalledWith([`${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.BANK_DETAILS}`]);
          });
        });

        describe('and the petition fails...', () => {
          beforeEach(() => {
            spyOn(bankAccountService, 'update').and.returnValue(throwError('network'));

            triggerFormSubmit();
          });

          it('should call the edit endpoint', () => {
            expect(bankAccountService.update).toHaveBeenCalledWith(MOCK_BANK_ACCOUNT);
          });

          it('should NOT redirect the user', () => {
            expect(router.navigate).not.toHaveBeenCalled();
          });

          it('should show an error toast', () => {
            expect(toastService.show).toHaveBeenCalledWith({
              text: '',
              type: 'error',
            });
          });
        });
      });
    });

    describe('when the form is not valid...', () => {
      beforeEach(() => {
        spyOn(bankAccountService, 'create');
        spyOn(bankAccountService, 'update');
        spyOn(toastService, 'show');
        component.bankAccountForm.setValue(MOCK_BANK_ACCOUNT_INVALID);

        triggerFormSubmit();
        fixture.detectChanges();
      });

      it('should not call the api service', () => {
        expect(bankAccountService.create).not.toHaveBeenCalled();
        expect(bankAccountService.update).not.toHaveBeenCalled();
      });

      it('should set the form as pending', () => {
        expect(component.bankAccountForm.pending).toBe(true);
      });

      it('should show an error toast', () => {
        expect(toastService.show).toHaveBeenCalledWith({
          text: '',
          type: 'error',
        });
      });

      it('should mark the incorrect controls as dirty', () => {
        expect(component.bankAccountForm.get('postal_code').dirty).toBe(true);
      });

      it('should show errors in the template', () => {
        expect(el.querySelectorAll(messageErrorSelector).length).toBe(1);
      });
    });
  });

  function triggerProfileFormInit(): void {
    const profileFormElement = fixture.debugElement.query(By.directive(ProfileFormComponent));
    profileFormElement.triggerEventHandler('onInit', {});
  }

  function triggerFormSubmit(): void {
    const profileFormElement = fixture.debugElement.query(By.css('form'));
    profileFormElement.triggerEventHandler('submit', {});
  }
});
