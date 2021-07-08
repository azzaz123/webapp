import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { UuidService } from '@core/uuid/uuid.service';
import {
  MOCK_EMPTY_BANK_ACCOUNT,
  MOCK_BANK_ACCOUNT,
  MOCK_BANK_ACCOUNT_INVALID,
} from '@fixtures/private/wallet/bank-account/bank-account.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NumbersOnlyDirectiveModule } from '@shared/directives/numbers-only/numbers-only.directive.module';
import { SeparateWordByCharacterPipe } from '@shared/pipes/separate-word-by-character/separate-word-by-character.pipe';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { of, Subject, throwError } from 'rxjs';
import { BankAccountApiService } from '@private/features/wallet/services/api/bank-account-api/bank-account-api.service';
import { BankAccountService } from '@private/features/wallet/services/bank-account/bank-account.service';
import { MapBankAccountService } from '@private/features/wallet/services/bank-account/map-bank-account/map-bank-account.service';
import { Location } from '@angular/common';
import {
  FirstNameIsInvalidError,
  IbanCountryIsInvalidError,
  LastNameIsInvalidError,
  PlatformResponseIsInvalidError,
  UniqueBankAccountByUserError,
} from '@private/features/wallet/errors/classes/bank-account';

import { BankAccountComponent } from './bank-account.component';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';

describe('BankAccountComponent', () => {
  const messageErrorSelector = '.BankAccount__message--error';
  const backAnchorSelector = '.BankAccount__back';
  const routerEvents: Subject<any> = new Subject();

  let component: BankAccountComponent;
  let fixture: ComponentFixture<BankAccountComponent>;
  let bankAccountService: BankAccountService;
  let toastService: ToastService;
  let location: Location;
  let i18nService: I18nService;
  let router: Router;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NumbersOnlyDirectiveModule, HttpClientTestingModule],
      declarations: [BankAccountComponent, ProfileFormComponent, SeparateWordByCharacterPipe],
      providers: [
        FormBuilder,
        BankAccountService,
        BankAccountApiService,
        MapBankAccountService,
        Location,
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
        {
          provide: Router,
          useValue: {
            navigate() {},
            events: routerEvents,
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;
    bankAccountService = TestBed.inject(BankAccountService);
    location = TestBed.inject(Location);
    toastService = TestBed.inject(ToastService);
    i18nService = TestBed.inject(I18nService);
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
              text: i18nService.translate(TRANSLATION_KEY.DELIVERY_BANK_ACCOUNT_CREATE_SUCCESS),
              type: TOAST_TYPES.SUCCESS,
            });
          });

          it('should redirect to the bank details page', () => {
            expect(router.navigate).toHaveBeenCalledWith([component.BANK_DETAILS_URL]);
          });
        });

        describe('and the petition fails...', () => {
          describe('and when the fail is because server notifies first name and last name are invalids', () => {
            beforeEach(() => {
              spyOn(bankAccountService, 'create').and.returnValue(
                throwError([new FirstNameIsInvalidError(), new LastNameIsInvalidError()])
              );

              triggerFormSubmit();
            });

            it('should call the create endpoint', () => {
              expect(bankAccountService.create).toHaveBeenCalledWith(MOCK_BANK_ACCOUNT);
            });

            it('should show an error toast', () => {
              expect(toastService.show).toHaveBeenCalledWith({
                text: i18nService.translate(TRANSLATION_KEY.BANK_ACCOUNT_MISSING_INFO_ERROR),
                type: TOAST_TYPES.ERROR,
              });
            });

            it('should set errors if the backend return an invalid field', () => {
              expect(component.bankAccountForm.get('first_name').getError('invalid')).toBeTruthy();
              expect(component.bankAccountForm.get('last_name').getError('invalid')).toBeTruthy();
            });

            it('should mark form as pending', () => {
              expect(component.bankAccountForm.pending).toBe(true);
            });

            it('should NOT redirect to the bank details page', () => {
              expect(router.navigate).not.toHaveBeenCalled();
            });
          });

          describe('and when the fail is because server notifies platform response is invalid', () => {
            beforeEach(() => {
              spyOn(bankAccountService, 'create').and.returnValue(throwError([new PlatformResponseIsInvalidError('')]));

              triggerFormSubmit();
            });

            it('should call the create endpoint', () => {
              expect(bankAccountService.create).toHaveBeenCalledWith(MOCK_BANK_ACCOUNT);
            });

            it('should show an error toast', () => {
              expect(toastService.show).toHaveBeenCalledWith({
                text: i18nService.translate(TRANSLATION_KEY.BANK_ACCOUNT_SAVE_GENERIC_ERROR),
                type: TOAST_TYPES.ERROR,
              });
            });

            it('should not mark form as pending', () => {
              component.onSubmit();

              expect(component.bankAccountForm.pending).toBe(false);
            });

            it('should NOT redirect to the bank details page', () => {
              expect(router.navigate).not.toHaveBeenCalled();
            });
          });
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
            text: i18nService.translate(TRANSLATION_KEY.DELIVERY_BANK_ACCOUNT_EDIT_SUCCESS),
            type: TOAST_TYPES.SUCCESS,
          });
        });

        it('should redirect to the bank details page', () => {
          expect(router.navigate).toHaveBeenCalledWith([component.BANK_DETAILS_URL]);
        });
      });

      describe('and the petition fails...', () => {
        describe('and when the fail is because server notifies iban country is invalid', () => {
          beforeEach(() => {
            spyOn(bankAccountService, 'update').and.returnValue(throwError([new IbanCountryIsInvalidError()]));

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
              text: i18nService.translate(TRANSLATION_KEY.BANK_ACCOUNT_MISSING_INFO_ERROR),
              type: TOAST_TYPES.ERROR,
            });
          });
        });

        describe('and when the fail is because server notifies unique bank account response', () => {
          beforeEach(() => {
            spyOn(bankAccountService, 'update').and.returnValue(throwError([new UniqueBankAccountByUserError('')]));

            triggerFormSubmit();
          });

          it('should call the update endpoint', () => {
            expect(bankAccountService.update).toHaveBeenCalledWith(MOCK_BANK_ACCOUNT);
          });

          it('should show an error toast', () => {
            expect(toastService.show).toHaveBeenCalledWith({
              text: i18nService.translate(TRANSLATION_KEY.BANK_ACCOUNT_SAVE_GENERIC_ERROR),
              type: TOAST_TYPES.ERROR,
            });
          });

          it('should not mark form as pending', () => {
            component.onSubmit();

            expect(component.bankAccountForm.pending).toBe(false);
          });

          it('should NOT redirect to the bank details page', () => {
            expect(router.navigate).not.toHaveBeenCalled();
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
        text: i18nService.translate(TRANSLATION_KEY.BANK_ACCOUNT_MISSING_INFO_ERROR),
        type: TOAST_TYPES.ERROR,
      });
    });

    it('should mark the incorrect controls as dirty', () => {
      expect(component.bankAccountForm.get('postal_code').dirty).toBe(true);
    });

    it('should show errors in the template', () => {
      expect(el.querySelectorAll(messageErrorSelector).length).toBe(1);
    });
  });

  describe('when the user clicks on the back button...', () => {
    it('should go to the previous page', () => {
      spyOn(location, 'back');
      const backButton = fixture.debugElement.query(By.css(backAnchorSelector)).nativeNode;

      backButton.click();

      expect(location.back).toHaveBeenCalled();
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