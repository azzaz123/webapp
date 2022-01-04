import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CardCvvIsInvalidError,
  CardExpirationDateIsInvalidError,
  CardIsNotAuthorizedError,
  CardNumberIsInvalidError,
  CardOwnerNameIsInvalidError,
  CountryIsoCodeIsInvalidError,
  PlatformResponseIsInvalidError,
} from '@api/core/errors/payments/cards';
import {
  mockCreditCardSyncRequest,
  mockCreditCardSyncRequestEmpty,
  mockFormCreditCardSyncRequest,
  MockPaymentsCreditCardService,
} from '@api/fixtures/payments/cards/credit-card.fixtures.spec';
import { PaymentsCreditCardService } from '@api/payments/cards';
import { Router } from '@angular/router';
import { UuidService } from '@core/uuid/uuid.service';
import { MOCK_EMPTY_CREDIT_CARD_FORM } from '@fixtures/private/wallet/credit-card/credit-card.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NumbersOnlyDirective } from '@shared/directives/numbers-only/numbers-only.directive';
import { SeparateWordByCharacterPipe } from '@shared/pipes/separate-word-by-character/separate-word-by-character.pipe';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { of, throwError, Subject } from 'rxjs';
import { Location } from '@angular/common';

import { CreditCardComponent } from './credit-card.component';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { CREDIT_CARD_TRANSLATIONS } from '@private/features/wallet/translations/credit-card.translations';

describe('CreditCreditCardComponent', () => {
  const messageErrorSelector = '.CreditCard__message--error';
  let component: CreditCardComponent;
  let fixture: ComponentFixture<CreditCardComponent>;
  let paymentsCreditCardService: PaymentsCreditCardService;
  let toastService: ToastService;
  let location: Location;
  let el: HTMLElement;
  let router: Router;

  const backAnchorSelector = '.CreditCard__back';
  const routerEvents: Subject<any> = new Subject();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [CreditCardComponent, ProfileFormComponent, NumbersOnlyDirective, SeparateWordByCharacterPipe],
      providers: [
        FormBuilder,
        ToastService,
        {
          provide: PaymentsCreditCardService,
          useValue: MockPaymentsCreditCardService,
        },
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
    fixture = TestBed.createComponent(CreditCardComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;
    paymentsCreditCardService = TestBed.inject(PaymentsCreditCardService);
    toastService = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
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
      expect(component.creditCardForm.value).toStrictEqual(MOCK_EMPTY_CREDIT_CARD_FORM);
    });
  });

  describe('canExit', () => {
    it('should return the form canExit status', () => {
      const result = component.canExit();

      expect(result).toStrictEqual(component.formComponent.canExit());
    });
  });

  describe('initForm', () => {
    describe(`when we don't have the credit card created yet...`, () => {
      beforeEach(() => {
        spyOn(paymentsCreditCardService, 'get').and.returnValue(throwError(''));
        spyOn(component.formComponent, 'initFormControl');
        spyOn(component.creditCardForm, 'updateValueAndValidity');

        triggerProfileFormInit();
      });

      it('should request the credit card', () => {
        expect(paymentsCreditCardService.get).toHaveBeenCalled();
      });

      it('should initialize the form control', () => {
        expect(component.formComponent.initFormControl).toHaveBeenCalled();
      });

      it('should update the value and the validity of the credit card form ', () => {
        expect(component.creditCardForm.updateValueAndValidity).toHaveBeenCalled();
      });

      it('should set loading to false', () => {
        expect(component.loading).toBe(false);
      });
    });

    describe('when we already have the credit card created...', () => {
      beforeEach(() => {
        spyOn(paymentsCreditCardService, 'get').and.returnValue(of(mockCreditCardSyncRequest));
        spyOn(component.formComponent, 'initFormControl');
        spyOn(component.creditCardForm, 'updateValueAndValidity');

        triggerProfileFormInit();
      });

      it('should request the credit card', () => {
        expect(paymentsCreditCardService.get).toHaveBeenCalled();
      });

      it('should NOT patch the credit card value on the form', () => {
        expect(component.creditCardForm.getRawValue()).toStrictEqual(mockCreditCardSyncRequestEmpty);
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
    describe('and the form is not in progress...', () => {
      describe('when the form is valid...', () => {
        describe('and the credit card is new...', () => {
          beforeEach(() => {
            spyOn(paymentsCreditCardService, 'get').and.returnValue(throwError(''));
            spyOn(toastService, 'show');
            spyOn(router, 'navigate');

            component.initForm();
            component.creditCardForm.setValue(mockFormCreditCardSyncRequest);
          });

          describe('and server notifies a success...', () => {
            beforeEach(() => {
              spyOn(paymentsCreditCardService, 'create').and.returnValue(of(null));

              triggerFormSubmit();
            });

            it('should call the create endpoint with valid data', () => {
              expect(paymentsCreditCardService.create).toHaveBeenCalledWith(mockCreditCardSyncRequest);
            });

            it('should show a succeed message', () => {
              expect(toastService.show).toHaveBeenCalledWith({
                text: CREDIT_CARD_TRANSLATIONS.CREATE_SUCCESS,
                type: TOAST_TYPES.SUCCESS,
              });
            });

            it('should redirect to the bank details page', () => {
              expect(router.navigate).toHaveBeenCalledWith([component.BANK_DETAILS_URL]);
            });
          });

          describe('and server notifies an error...', () => {
            describe('and when the failure is because server notifies card is not authorized', () => {
              beforeEach(() => {
                spyOn(paymentsCreditCardService, 'create').and.returnValue(throwError([new CardIsNotAuthorizedError()]));

                triggerFormSubmit();
              });

              it('should call the create endpoint', () => {
                expect(paymentsCreditCardService.create).toHaveBeenCalledWith(mockCreditCardSyncRequest);
              });

              it('should show an error toast', () => {
                expect(toastService.show).toHaveBeenCalledWith({
                  text: CREDIT_CARD_TRANSLATIONS.MISSING_INFO_ERROR,
                  type: TOAST_TYPES.ERROR,
                });
              });

              it('should mark errors in form', () => {
                expect(component.creditCardForm.get('cardNumber').getError('invalid')).toBeTruthy();
              });

              it('should set the form as pending', () => {
                expect(component.creditCardForm.pending).toBe(true);
              });

              it('should NOT redirect to the bank details page', () => {
                expect(router.navigate).not.toHaveBeenCalled();
              });
            });

            describe('and when the failure is because server notifies card number is not valid', () => {
              beforeEach(() => {
                spyOn(paymentsCreditCardService, 'create').and.returnValue(throwError([new CardNumberIsInvalidError()]));

                triggerFormSubmit();
              });

              it('should call the create endpoint', () => {
                expect(paymentsCreditCardService.create).toHaveBeenCalledWith(mockCreditCardSyncRequest);
              });

              it('should show an error toast', () => {
                expect(toastService.show).toHaveBeenCalledWith({
                  text: CREDIT_CARD_TRANSLATIONS.MISSING_INFO_ERROR,
                  type: TOAST_TYPES.ERROR,
                });
              });

              it('should set errors if the backend return an invalid field', () => {
                expect(component.creditCardForm.get('cardNumber').getError('invalid')).toBeTruthy();
              });

              it('should set the form as pending', () => {
                expect(component.creditCardForm.pending).toBe(true);
              });

              it('should NOT redirect to the bank details page', () => {
                expect(router.navigate).not.toHaveBeenCalled();
              });
            });

            describe('and when the failure is because server notifies card expiration date is not valid', () => {
              beforeEach(() => {
                spyOn(paymentsCreditCardService, 'create').and.returnValue(throwError([new CardExpirationDateIsInvalidError()]));

                triggerFormSubmit();
              });

              it('should call the create endpoint', () => {
                expect(paymentsCreditCardService.create).toHaveBeenCalledWith(mockCreditCardSyncRequest);
              });

              it('should show an error toast', () => {
                expect(toastService.show).toHaveBeenCalledWith({
                  text: CREDIT_CARD_TRANSLATIONS.MISSING_INFO_ERROR,
                  type: TOAST_TYPES.ERROR,
                });
              });

              it('should set errors if the backend return an invalid field', () => {
                expect(component.creditCardForm.get('cardExpirationDate').getError('invalid')).toBeTruthy();
              });

              it('should set the form as pending', () => {
                expect(component.creditCardForm.pending).toBe(true);
              });

              it('should NOT redirect to the bank details page', () => {
                expect(router.navigate).not.toHaveBeenCalled();
              });
            });

            describe('and when the failure is because server notifies card CVX is not valid', () => {
              beforeEach(() => {
                spyOn(paymentsCreditCardService, 'create').and.returnValue(throwError([new CardCvvIsInvalidError()]));

                triggerFormSubmit();
              });

              it('should call the create endpoint', () => {
                expect(paymentsCreditCardService.create).toHaveBeenCalledWith(mockCreditCardSyncRequest);
              });

              it('should show an error toast', () => {
                expect(toastService.show).toHaveBeenCalledWith({
                  text: CREDIT_CARD_TRANSLATIONS.MISSING_INFO_ERROR,
                  type: TOAST_TYPES.ERROR,
                });
              });

              it('should set errors if the backend return an invalid field', () => {
                expect(component.creditCardForm.get('cardCvx').getError('invalid')).toBeTruthy();
              });

              it('should set the form as pending', () => {
                expect(component.creditCardForm.pending).toBe(true);
              });

              it('should NOT redirect to the bank details page', () => {
                expect(router.navigate).not.toHaveBeenCalled();
              });
            });

            describe('and when the failure is because server notifies a non matching error', () => {
              beforeEach(() => {
                spyOn(paymentsCreditCardService, 'create').and.returnValue(throwError([new CountryIsoCodeIsInvalidError()]));

                triggerFormSubmit();
              });

              it('should call the create endpoint', () => {
                expect(paymentsCreditCardService.create).toHaveBeenCalledWith(mockCreditCardSyncRequest);
              });

              it('should show an error toast', () => {
                expect(toastService.show).toHaveBeenCalledWith({
                  text: CREDIT_CARD_TRANSLATIONS.GENERIC_ERROR,
                  type: TOAST_TYPES.ERROR,
                });
              });

              it('should not mark form as pending', () => {
                expect(component.creditCardForm.pending).toBe(false);
              });

              it('should not mark any field as error', () => {
                expect(component.creditCardForm.get('fullName').getError('invalid')).toBeFalsy();
                expect(component.creditCardForm.get('cardNumber').getError('invalid')).toBeFalsy();
                expect(component.creditCardForm.get('cardExpirationDate').getError('invalid')).toBeFalsy();
                expect(component.creditCardForm.get('cardCvx').getError('invalid')).toBeFalsy();
              });

              it('should NOT redirect to the bank details page', () => {
                expect(router.navigate).not.toHaveBeenCalled();
              });
            });
          });
        });
      });

      describe('and the credit card is an existing one...', () => {
        beforeEach(() => {
          spyOn(paymentsCreditCardService, 'get').and.returnValue(of(mockCreditCardSyncRequest));
          spyOn(toastService, 'show');
          spyOn(router, 'navigate');

          component.initForm();
          component.creditCardForm.setValue(mockCreditCardSyncRequest);
        });

        describe('and the petition succeed...', () => {
          beforeEach(() => {
            spyOn(paymentsCreditCardService, 'update').and.returnValue(of(null));

            triggerFormSubmit();
          });

          it('should call the edit endpoint', () => {
            expect(paymentsCreditCardService.update).toHaveBeenCalledWith(mockCreditCardSyncRequest);
          });

          it('should show a succeed CREATE message', () => {
            expect(toastService.show).toHaveBeenCalledWith({
              text: CREDIT_CARD_TRANSLATIONS.CREATE_SUCCESS,
              type: TOAST_TYPES.SUCCESS,
            });
          });

          it('should redirect to the bank details page', () => {
            expect(router.navigate).toHaveBeenCalledWith([component.BANK_DETAILS_URL]);
          });
        });

        describe('and the petition fails...', () => {
          describe('and when the fail is because server notifies owner name is invalid', () => {
            beforeEach(() => {
              spyOn(paymentsCreditCardService, 'update').and.returnValue(throwError([new CardOwnerNameIsInvalidError()]));

              triggerFormSubmit();
            });

            it('should call the edit endpoint', () => {
              expect(paymentsCreditCardService.update).toHaveBeenCalledWith(mockCreditCardSyncRequest);
            });

            it('should set errors if the backend return an invalid field', () => {
              expect(component.creditCardForm.get('fullName').getError('invalid')).toBeTruthy();
            });

            it('should NOT redirect the user', () => {
              expect(router.navigate).not.toHaveBeenCalled();
            });

            it('should set the form as pending', () => {
              expect(component.creditCardForm.pending).toBe(true);
            });

            it('should show an error toast', () => {
              expect(toastService.show).toHaveBeenCalledWith({
                text: CREDIT_CARD_TRANSLATIONS.MISSING_INFO_ERROR,
                type: TOAST_TYPES.ERROR,
              });
            });
          });

          describe('and when the fail is because server notifies that the platform response is invalid', () => {
            beforeEach(() => {
              spyOn(paymentsCreditCardService, 'update').and.returnValue(throwError([new PlatformResponseIsInvalidError()]));

              triggerFormSubmit();
            });

            it('should call the update endpoint', () => {
              expect(paymentsCreditCardService.update).toHaveBeenCalledWith(mockCreditCardSyncRequest);
            });

            it('should show an error toast', () => {
              expect(toastService.show).toHaveBeenCalledWith({
                text: CREDIT_CARD_TRANSLATIONS.GENERIC_ERROR,
                type: TOAST_TYPES.ERROR,
              });
            });

            it('should not mark form as pending', () => {
              expect(component.creditCardForm.pending).toBe(false);
            });

            it('should NOT redirect to the bank details page', () => {
              expect(router.navigate).not.toHaveBeenCalled();
            });
          });
        });
      });
    });

    describe('and the form is already in progress...', () => {
      beforeEach(() => {
        spyOn(paymentsCreditCardService, 'create');
        spyOn(paymentsCreditCardService, 'update');
        component.loadingButton$.next(true);

        component.onSubmit();
        fixture.detectChanges();
      });

      it('should NOT call any endpoint', () => {
        expect(paymentsCreditCardService.create).not.toHaveBeenCalled();
        expect(paymentsCreditCardService.update).not.toHaveBeenCalled();
      });

      it('should mark as disable the save button', () => {
        const saveButton = fixture.debugElement.query(By.css('tsl-button')).nativeElement;

        fixture.detectChanges();

        expect(saveButton.disabled).toBe(true);
      });
    });
  });

  describe('when the form is not valid...', () => {
    beforeEach(() => {
      spyOn(paymentsCreditCardService, 'create');
      spyOn(paymentsCreditCardService, 'update');
      spyOn(toastService, 'show');
      component.creditCardForm.setValue(mockCreditCardSyncRequestEmpty);

      triggerFormSubmit();
      fixture.detectChanges();
    });

    it('should not call the api service', () => {
      expect(paymentsCreditCardService.create).not.toHaveBeenCalled();
      expect(paymentsCreditCardService.update).not.toHaveBeenCalled();
    });

    it('should set the form as pending', () => {
      expect(component.creditCardForm.pending).toBe(true);
    });

    it('should show an error toast', () => {
      expect(toastService.show).toHaveBeenCalledWith({
        text: CREDIT_CARD_TRANSLATIONS.MISSING_INFO_ERROR,
        type: TOAST_TYPES.ERROR,
      });
    });

    it('should mark the incorrect controls as dirty', () => {
      expect(component.creditCardForm.get('fullName').dirty).toBe(true);
      expect(component.creditCardForm.get('cardNumber').dirty).toBe(true);
      expect(component.creditCardForm.get('cardExpirationDate').dirty).toBe(true);
      expect(component.creditCardForm.get('cardCvx').dirty).toBe(true);
    });

    it('should show errors in the template', () => {
      expect(el.querySelectorAll(messageErrorSelector).length).toBe(4);
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
    profileFormElement.triggerEventHandler('handleOnInit', {});
  }

  function triggerFormSubmit(): void {
    const profileFormElement = fixture.debugElement.query(By.css('form'));
    profileFormElement.triggerEventHandler('submit', {});
  }
});
