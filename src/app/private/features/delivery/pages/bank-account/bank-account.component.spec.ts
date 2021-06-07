import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { UuidService } from '@core/uuid/uuid.service';
import { MOCK_EMPTY_BANK_ACCOUNT, MOCK_BANK_ACCOUNT } from '@fixtures/private/delivery/bank-account/bank-account.fixtures.spec';
import { NumbersOnlyDirectiveModule } from '@shared/directives/numbers-only/numbers-only.directive.module';
import { SeparateWordByCharacterPipe } from '@shared/pipes/separate-word-by-character/separate-word-by-character.pipe';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { of } from 'rxjs';
import { BankAccountApiService } from '../../services/api/bank-account-api/bank-account-api.service';
import { BankAccountService } from '../../services/bank-account/bank-account.service';
import { MapBankAccountService } from '../../services/bank-account/map-bank-account/map-bank-account.service';

import { BankAccountComponent } from './bank-account.component';

describe('BankAccountComponent', () => {
  let component: BankAccountComponent;
  let fixture: ComponentFixture<BankAccountComponent>;
  let bankAccountService: BankAccountService;

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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountComponent);
    component = fixture.componentInstance;
    bankAccountService = TestBed.inject(BankAccountService);
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
        describe('and the petition succeed...', () => {
          it('should show a succeed message', () => {});
          it('should redirect to the bank details page', () => {});
        });
        describe('and the petition fails...', () => {
          it('should show an error toast', () => {});
        });
      });

      describe('and the bank account is an existing one...', () => {
        describe('and the petition succeed...', () => {
          it('should show a succeed message', () => {});
          it('should redirect to the bank details page', () => {});
        });
        describe('and the petition fails...', () => {
          it('should show an error toast', () => {});
        });
      });
    });

    describe('when the form is not valid...', () => {
      it('should set the form as pending', () => {});
      it('should show an error toast', () => {});
      it('should mark the incorrect controls as dirty', () => {});
      it('should show errors in the template', () => {});
    });
  });

  function triggerProfileFormInit(): void {
    const profileFormElement = fixture.debugElement.query(By.directive(ProfileFormComponent));
    profileFormElement.triggerEventHandler('onInit', {});
  }
});
