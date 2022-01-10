import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UuidService } from '@core/uuid/uuid.service';
import {
  MOCK_EMPTY_BANK_ACCOUNT,
  MOCK_BANK_ACCOUNT,
  MOCK_BANK_ACCOUNT_INVALID,
  MOCK_BANK_ACCOUNT_FORMATTED_IBAN,
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
import { KYCTrackingEventsService } from '@private/features/wallet/modals/kyc/services/kyc-tracking-events/kyc-tracking-events.service';
import { BANK_ACCOUNT_TRANSLATIONS } from '@private/features/wallet/translations/bank-account.translations';
import { DeviceService } from '@core/device/device.service';
import { MockDeviceService } from '@fixtures/device.fixtures.spec';

describe('BankAccountComponent', () => {
  const messageErrorSelector = '.BankAccount__message--error';
  const backAnchorSelector = '.BankAccount__back';
  const KYCInfoMessageSelector = '.BankAccount__KYCMessage';
  const saveButtonRowSelector = '#saveButtonRow';
  const inputIBANselector = '#iban';

  const routerEvents: Subject<any> = new Subject();

  const unformattedIBAN = MOCK_BANK_ACCOUNT.iban.valueOf();
  const formattedIBAN = MOCK_BANK_ACCOUNT_FORMATTED_IBAN.iban.valueOf();

  let component: BankAccountComponent;
  let fixture: ComponentFixture<BankAccountComponent>;
  let bankAccountService: BankAccountService;
  let toastService: ToastService;
  let location: Location;
  let router: Router;
  let el: HTMLElement;
  let kycTrackingEventsService: KYCTrackingEventsService;
  let deviceService: DeviceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NumbersOnlyDirectiveModule, HttpClientTestingModule],
      declarations: [BankAccountComponent, ProfileFormComponent],
      providers: [
        FormBuilder,
        BankAccountService,
        BankAccountApiService,
        MapBankAccountService,
        Location,
        SeparateWordByCharacterPipe,
        {
          provide: DeviceService,
          useValue: MockDeviceService,
        },
        {
          provide: UuidService,
          useValue: {
            getUUID() {
              return 'FAKE_UUID';
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
        {
          provide: KYCTrackingEventsService,
          useValue: {
            trackViewKYCBankAccountInfoScreen() {},
            trackClickKYCConfirmBankAccountInfo() {},
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
    kycTrackingEventsService = TestBed.inject(KYCTrackingEventsService);
    deviceService = TestBed.inject(DeviceService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we initialize the form...', () => {
    beforeEach(() => {
      spyOn(kycTrackingEventsService, 'trackViewKYCBankAccountInfoScreen');
    });

    it('should build the form', () => {
      component.ngOnInit();

      expect(component.bankAccountForm.value).toStrictEqual(MOCK_EMPTY_BANK_ACCOUNT);
    });

    it('should set the max iban length', () => {
      component.ngOnInit();

      expect(component.maxLengthIBAN).toBe(49);
    });

    describe('and is KYC...', () => {
      beforeEach(() => {
        component.isKYC = true;

        component.ngOnInit();
      });

      it('should request to the KYC analytics service to track the page view event', () => {
        expect(kycTrackingEventsService.trackViewKYCBankAccountInfoScreen).toHaveBeenCalledTimes(1);
      });

      describe('and the bank account is new', () => {
        beforeEach(() => {
          initializeForm(true);
        });

        it('should show the correct title', () => {
          const expectedTitle = $localize`:@@kyc_bank_account_view_if_empty_title:Add the bank account where you wish to receive payment for your sales`;

          expect(fixture.debugElement.nativeElement.querySelector('#bankAccountTitle').innerHTML).toContain(expectedTitle);
        });
      });

      describe('and the bank account was already provided', () => {
        beforeEach(() => {
          initializeForm(false);
        });

        it('should show the correct title', () => {
          const expectedTitle = $localize`:@@kyc_bank_account_view_if_already_filled_title:Please check your bank account details are correct`;

          expect(fixture.debugElement.nativeElement.querySelector('#bankAccountTitle').innerHTML).toContain(expectedTitle);
        });
      });
    });

    describe('and is not KYC...', () => {
      beforeEach(() => {
        component.isKYC = false;

        component.ngOnInit();
      });

      it('should NOT request to the KYC analytics service to track the page view event', () => {
        expect(kycTrackingEventsService.trackViewKYCBankAccountInfoScreen).not.toHaveBeenCalled();
      });

      describe('and the bank account is new', () => {
        beforeEach(() => {
          initializeForm(true);
        });

        it('should show the correct title', () => {
          const expectedTitle = $localize`:@@delivery_add_bank_account_title:Add bank account`;

          expect(fixture.debugElement.nativeElement.querySelector('#bankAccountTitle').innerHTML).toEqual(expectedTitle);
        });
      });

      describe('and the bank account was already provided', () => {
        beforeEach(() => {
          initializeForm(false);
        });

        it('should show the correct title', () => {
          const expectedTitle = $localize`:@@delivery_edit_bank_account_title:Edit bank account`;

          expect(fixture.debugElement.nativeElement.querySelector('#bankAccountTitle').innerHTML).toEqual(expectedTitle);
        });
      });
    });
  });

  describe('canExit', () => {
    describe('and we are in KYC process', () => {
      beforeEach(() => {
        component.isKYC = true;
      });

      it('should return true', () => {
        const result = component.canExit();

        expect(result).toStrictEqual(true);
      });
    });

    describe('and we are NOT in KYC process', () => {
      beforeEach(() => {
        component.isKYC = false;
      });
      it('should return the form canExit status', () => {
        const result = component.canExit();

        expect(result).toStrictEqual(component.formComponent.canExit());
      });
    });
  });

  describe('initForm', () => {
    describe(`when we don't have the main bank account created yet...`, () => {
      beforeEach(() => {
        spyOn(component.formComponent, 'initFormControl');
        spyOn(component.bankAccountForm, 'updateValueAndValidity');

        initializeForm(true);
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
        expect(component.loading$.value).toBe(false);
      });
    });

    describe('when we already have the main bank account created...', () => {
      beforeEach(() => {
        spyOn(component.formComponent, 'initFormControl');
        spyOn(component.bankAccountForm, 'updateValueAndValidity');

        initializeForm(false);
      });

      it('should request the main account', () => {
        expect(bankAccountService.get).toHaveBeenCalled();
      });

      it('should patch the main bank account value on the form', () => {
        expect(component.bankAccountForm.getRawValue()).toStrictEqual(MOCK_BANK_ACCOUNT_FORMATTED_IBAN);
      });

      it('should initialize the form control', () => {
        expect(component.formComponent.initFormControl).toHaveBeenCalled();
      });

      it('should set loading to false', () => {
        expect(component.loading$.value).toBe(false);
      });
    });
  });

  describe('onSubmit', () => {
    describe('and the form is not in progress...', () => {
      beforeEach(() => {
        spyOn(kycTrackingEventsService, 'trackClickKYCConfirmBankAccountInfo');
      });

      describe('and is KYC...', () => {
        beforeEach(() => {
          initializeForm(true);
          component.isKYC = true;
        });

        describe('and we click on the save form button...', () => {
          beforeEach(() => {
            triggerFormSubmit();
          });

          it('should request to the KYC analytics service to track the click event', () => {
            expect(kycTrackingEventsService.trackClickKYCConfirmBankAccountInfo).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe('and is not KYC...', () => {
        beforeEach(() => {
          initializeForm(true);
          component.isKYC = false;
        });

        describe('and we click on the save form button...', () => {
          beforeEach(() => {
            triggerFormSubmit();
          });
          it('should NOT request to the KYC analytics service to track the click event', () => {
            expect(kycTrackingEventsService.trackClickKYCConfirmBankAccountInfo).not.toHaveBeenCalled();
          });
        });
      });

      describe('when the form is valid...', () => {
        describe('and the bank account is new...', () => {
          beforeEach(() => {
            spyOn(toastService, 'show');
            spyOn(router, 'navigate');

            initializeForm(true);
            component.bankAccountForm.setValue(MOCK_BANK_ACCOUNT);
          });

          describe('and the petition succeed...', () => {
            beforeEach(() => {
              spyOn(bankAccountService, 'create').and.returnValue(of(null));

              triggerFormSubmit();
            });

            it('should call the create endpoint', () => {
              expect(bankAccountService.create).toHaveBeenCalledTimes(1);
              expect(bankAccountService.create).toHaveBeenCalledWith(MOCK_BANK_ACCOUNT_FORMATTED_IBAN);
            });

            it('should show a succeed message', () => {
              expect(toastService.show).toHaveBeenCalledWith({
                text: BANK_ACCOUNT_TRANSLATIONS.ADD_SUCCESS,
                type: TOAST_TYPES.SUCCESS,
              });
            });

            it('should redirect to the bank details page', () => {
              expect(router.navigate).toHaveBeenCalledTimes(1);
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
                expect(bankAccountService.create).toHaveBeenCalledTimes(1);
                expect(bankAccountService.create).toHaveBeenCalledWith(MOCK_BANK_ACCOUNT_FORMATTED_IBAN);
              });

              it('should show an error toast', () => {
                expect(toastService.show).toHaveBeenCalledWith({
                  text: BANK_ACCOUNT_TRANSLATIONS.MISSING_INFO_ERROR,
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
                expect(bankAccountService.create).toHaveBeenCalledTimes(1);
                expect(bankAccountService.create).toHaveBeenCalledWith(MOCK_BANK_ACCOUNT_FORMATTED_IBAN);
              });

              it('should show an error toast', () => {
                expect(toastService.show).toHaveBeenCalledWith({
                  text: BANK_ACCOUNT_TRANSLATIONS.SAVE_GENERIC_ERROR,
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

        describe('and the bank account is an existing one...', () => {
          beforeEach(() => {
            spyOn(toastService, 'show');
            spyOn(router, 'navigate');

            initializeForm(false);
          });

          describe('and the petition succeed...', () => {
            describe('and we are NOT on KYC mode', () => {
              beforeEach(() => {
                spyOn(bankAccountService, 'update').and.returnValue(of(null));

                triggerFormSubmit();
              });

              it('should call the edit endpoint', () => {
                expect(bankAccountService.update).toHaveBeenCalledTimes(1);
                expect(bankAccountService.update).toHaveBeenCalledWith(MOCK_BANK_ACCOUNT_FORMATTED_IBAN);
              });

              it('should show a succeed message', () => {
                expect(toastService.show).toHaveBeenCalledWith({
                  text: BANK_ACCOUNT_TRANSLATIONS.EDIT_SUCCESS,
                  type: TOAST_TYPES.SUCCESS,
                });
              });

              it('should redirect to the bank details page', () => {
                expect(router.navigate).toHaveBeenCalledTimes(1);
                expect(router.navigate).toHaveBeenCalledWith([component.BANK_DETAILS_URL]);
              });
            });

            describe('and we are on KYC mode', () => {
              beforeEach(() => {
                component.isKYC = true;
                spyOn(component.bankAccountSaved, 'emit');
                spyOn(bankAccountService, 'update').and.returnValue(of(null));

                triggerFormSubmit();
              });

              it('should call the edit endpoint', () => {
                expect(bankAccountService.update).toHaveBeenCalledTimes(1);
                expect(bankAccountService.update).toHaveBeenCalledWith(MOCK_BANK_ACCOUNT_FORMATTED_IBAN);
              });

              it('should show a succeed message', () => {
                expect(toastService.show).toHaveBeenCalledWith({
                  text: BANK_ACCOUNT_TRANSLATIONS.EDIT_SUCCESS,
                  type: TOAST_TYPES.SUCCESS,
                });
              });

              it('should NOT redirect to the bank details page', () => {
                expect(router.navigate).not.toHaveBeenCalled();
              });

              it('should notify that the bank account have been saved', () => {
                expect(component.bankAccountSaved.emit).toHaveBeenCalledTimes(1);
              });
            });
          });

          describe('and the petition fails...', () => {
            describe('and when the fail is because server notifies iban country is invalid', () => {
              beforeEach(() => {
                spyOn(bankAccountService, 'update').and.returnValue(throwError([new IbanCountryIsInvalidError()]));

                triggerFormSubmit();
              });

              it('should call the edit endpoint', () => {
                expect(bankAccountService.update).toHaveBeenCalledTimes(1);
                expect(bankAccountService.update).toHaveBeenCalledWith(MOCK_BANK_ACCOUNT_FORMATTED_IBAN);
              });

              it('should NOT redirect the user', () => {
                expect(router.navigate).not.toHaveBeenCalled();
              });

              it('should show an error toast', () => {
                expect(toastService.show).toHaveBeenCalledWith({
                  text: BANK_ACCOUNT_TRANSLATIONS.MISSING_INFO_ERROR,
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
                expect(bankAccountService.update).toHaveBeenCalledTimes(1);
                expect(bankAccountService.update).toHaveBeenCalledWith(MOCK_BANK_ACCOUNT_FORMATTED_IBAN);
              });

              it('should show an error toast', () => {
                expect(toastService.show).toHaveBeenCalledWith({
                  text: BANK_ACCOUNT_TRANSLATIONS.SAVE_GENERIC_ERROR,
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

      describe('and the form is not valid...', () => {
        beforeEach(() => {
          spyOn(bankAccountService, 'create');
          spyOn(bankAccountService, 'update');
          spyOn(toastService, 'show');
          initializeForm(true);
        });

        describe('and we try to save it...', () => {
          beforeEach(() => {
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
              text: BANK_ACCOUNT_TRANSLATIONS.MISSING_INFO_ERROR,
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
      });
    });

    describe('and the form is already in progress...', () => {
      describe('and the bank account is being created...', () => {
        beforeEach(() => {
          initializeForm(true);
          spyOn(bankAccountService, 'create');
          component.loadingButton$.next(true);

          component.onSubmit();
          fixture.detectChanges();
        });

        it('should NOT call any endpoint', () => {
          expect(bankAccountService.create).not.toHaveBeenCalled();
        });

        it('should mark as disable the save button', () => {
          const saveButton = fixture.debugElement.query(By.css('tsl-button')).nativeElement;

          fixture.detectChanges();

          expect(saveButton.disabled).toBe(true);
        });
      });

      describe('and the bank account is being edited...', () => {
        beforeEach(() => {
          initializeForm(false);
          spyOn(bankAccountService, 'update');
          component.loadingButton$.next(true);

          component.onSubmit();
          fixture.detectChanges();
        });

        it('should NOT call any endpoint', () => {
          expect(bankAccountService.update).not.toHaveBeenCalled();
        });

        it('should mark as disable the save button', () => {
          const saveButton = fixture.debugElement.query(By.css('tsl-button')).nativeElement;

          fixture.detectChanges();

          expect(saveButton.disabled).toBe(true);
        });
      });
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

  describe('when the component is NOT on the KYC page...', () => {
    beforeEach(() => {
      component.isKYC = false;
      initializeForm(true);
    });

    it('should show the back button', () => {
      const back = fixture.debugElement.query(By.css(backAnchorSelector));

      expect(back).toBeTruthy();
    });

    it('should NOT show the informative message', () => {
      const KYCMessage = fixture.debugElement.query(By.css(KYCInfoMessageSelector));

      expect(KYCMessage).toBeFalsy();
    });

    it('should NOT apply the bottom style', () => {
      const bottomButtonStyle = fixture.debugElement.query(By.css(saveButtonRowSelector)).classes;

      expect(bottomButtonStyle).not.toHaveProperty('mb-4');
    });
  });

  describe('when the component is on the KYC page...', () => {
    beforeEach(() => {
      component.isKYC = true;

      initializeForm(true);
    });

    it('should NOT show the back button', () => {
      const back = fixture.debugElement.query(By.css(backAnchorSelector));

      expect(back).toBeFalsy();
    });

    it('should show the informative message', () => {
      const KYCMessage = fixture.debugElement.query(By.css(KYCInfoMessageSelector));

      expect(KYCMessage).toBeTruthy();
    });

    describe('and we click on the cross button...', () => {
      beforeEach(() => {
        spyOn(component.closeModal, 'emit');

        fixture.debugElement.query(By.css('.BankAccount__cross')).nativeElement.click();
      });

      it('should close the modal', () => {
        expect(component.closeModal.emit).toHaveBeenCalledTimes(1);
      });

      it('should apply the bottom style', () => {
        const bottomButtonStyle = fixture.debugElement.query(By.css(saveButtonRowSelector)).classes;

        expect(bottomButtonStyle).toHaveProperty('mb-4', true);
      });
    });
  });

  describe('when device operating system is Android', () => {
    beforeEach(() => {
      spyOn(deviceService, 'getOSName').and.returnValue('Android');
      component.ngOnInit();
      component.loading$.next(false);

      fixture.detectChanges();
    });

    it('should NOT format IBAN while user types into the field', () => {
      component.bankAccountForm.get('iban').patchValue(unformattedIBAN);

      const result = component.bankAccountForm.get('iban').value;
      expect(result).toEqual(unformattedIBAN);
    });

    it('should update IBAN only when user loses focus for IBAN input field', () => {
      const inputIBAN = fixture.debugElement.query(By.css(inputIBANselector));

      component.bankAccountForm.get('iban').patchValue(unformattedIBAN);
      inputIBAN.triggerEventHandler('blur', {});

      const result = component.bankAccountForm.get('iban').value;
      expect(result).toEqual(formattedIBAN);
    });
  });

  describe('when device operating system is not Android', () => {
    it('should format IBAN while user types into the field', () => {
      component.bankAccountForm.get('iban').patchValue(unformattedIBAN);

      const result = component.bankAccountForm.get('iban').value;
      expect(result).toEqual(formattedIBAN);
    });
  });

  function triggerProfileFormInit(): void {
    const profileFormElement = fixture.debugElement.query(By.directive(ProfileFormComponent));
    profileFormElement.triggerEventHandler('handleOnInit', {});
  }

  function triggerFormSubmit(): void {
    const profileFormElement = fixture.debugElement.query(By.css('form'));
    profileFormElement.triggerEventHandler('submit', {});
  }

  function initializeForm(isFormEmpty: boolean): void {
    const result = isFormEmpty ? null : MOCK_BANK_ACCOUNT;
    spyOn(bankAccountService, 'get').and.returnValue(of(result));

    triggerProfileFormInit();
    fixture.detectChanges();
  }
});
