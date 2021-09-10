import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { mockCreditCard } from '@api/fixtures/payments/cards/credit-card.fixtures.spec';
import { PaymentsCreditCardService } from '@api/payments/cards';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { I18nService } from '@core/i18n/i18n.service';
import { MOCK_BANK_ACCOUNT } from '@fixtures/private/wallet/bank-account/bank-account.fixtures.spec';
import { BankAccount } from '@private/features/wallet/interfaces/bank-account/bank-account-api.interface';
import { BankAccountService } from '@private/features/wallet/services/bank-account/bank-account.service';
import { AddCreditCardComponent } from '@shared/add-credit-card/add-credit-card.component';
import { PaymentsCardInfoComponent } from '@shared/payments-card-info/payments-card-info.component';
import { BehaviorSubject, of, throwError } from 'rxjs';

import * as moment from 'moment';

import { BankDetailsOverviewComponent } from './bank-details-overview.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { MockToastService } from '@fixtures/toast-service.fixtures.spec';
import { MockWalletSharedErrorActionService } from '@fixtures/private/wallet/shared/wallet-shared-error-action.fixtures.spec';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { WalletSharedErrorActionService } from '@private/features/wallet/shared/error-action';
import { BankAccountTrackingEventsService } from '../../services/bank-account-tracking-events/bank-account-tracking-events.service';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { KYCBannerApiService } from '@private/features/wallet/services/api/kyc-banner-api.service';

describe('BankDetailsOverviewComponent', () => {
  const creditCardInfoSelector = '#creditCard';
  const addCreditCardSelector = '#addCreditCard';
  const bankAccountInfoSelector = '#bankAccount';
  const addBankAccountSelector = '#addBankAccount';

  const creditCardSubjectMock: BehaviorSubject<CreditCard> = new BehaviorSubject<CreditCard>(mockCreditCard);
  const bankAccountSubjectMock: BehaviorSubject<BankAccount> = new BehaviorSubject<BankAccount>(MOCK_BANK_ACCOUNT);

  let component: BankDetailsOverviewComponent;
  let fixture: ComponentFixture<BankDetailsOverviewComponent>;
  let bankAccountService: BankAccountService;
  let paymentsCreditCardService: PaymentsCreditCardService;
  let toastService: ToastService;
  let i18nService: I18nService;
  let modalService: NgbModal;
  let router: Router;
  let bankAccountTrackingEventsService: BankAccountTrackingEventsService;
  let de: DebugElement;
  let errorActionService: WalletSharedErrorActionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BankDetailsOverviewComponent, AddCreditCardComponent, PaymentsCardInfoComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        {
          provide: BankAccountService,
          useValue: {
            delete() {},
            get bankAccount$() {
              return bankAccountSubjectMock;
            },
            get() {
              return of(MOCK_BANK_ACCOUNT);
            },
          },
        },
        {
          provide: PaymentsCreditCardService,
          useValue: {
            delete() {},
            get creditCard$() {
              return creditCardSubjectMock;
            },
            get() {
              return of(mockCreditCard);
            },
          },
        },
        I18nService,
        { provide: ToastService, useClass: MockToastService },
        {
          provide: WalletSharedErrorActionService,
          useValue: MockWalletSharedErrorActionService,
        },
        BankAccountTrackingEventsService,
        KYCBannerApiService,
        { provide: AnalyticsService, useClass: MockAnalyticsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankDetailsOverviewComponent);
    component = fixture.componentInstance;
    bankAccountService = TestBed.inject(BankAccountService);
    paymentsCreditCardService = TestBed.inject(PaymentsCreditCardService);
    toastService = TestBed.inject(ToastService);
    i18nService = TestBed.inject(I18nService);
    router = TestBed.inject(Router);
    modalService = TestBed.inject(NgbModal);
    errorActionService = TestBed.inject(WalletSharedErrorActionService);
    bankAccountTrackingEventsService = TestBed.inject(BankAccountTrackingEventsService);
    de = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(paymentsCreditCardService, 'get').and.returnValue(of(mockCreditCard));
      spyOn(bankAccountService, 'get').and.returnValue(of(MOCK_BANK_ACCOUNT));

      component.ngOnInit();
    });

    it('should get the credit card', () => {
      expect(paymentsCreditCardService.get).toHaveBeenCalledTimes(1);
    });

    it('should get the bank account', () => {
      expect(bankAccountService.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('when we have credit card...', () => {
    beforeEach(() => {
      creditCardSubjectMock.next(mockCreditCard);

      fixture.detectChanges();
    });

    it('should show their credit card info', () => {
      expect(de.query(By.css(creditCardInfoSelector))).toBeTruthy();
    });

    it('should NOT should the add credit card', () => {
      expect(de.query(By.css(addCreditCardSelector))).toBeFalsy();
    });

    describe('when clicking into the delete credit card button...', () => {
      describe('and we accept the action', () => {
        beforeEach(() => {
          spyOn(toastService, 'show');
          spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve(), componentInstance: { ConfirmationModalComponent } });
        });

        describe('and the action succeed', () => {
          beforeEach(() => {
            spyOn(paymentsCreditCardService, 'delete').and.returnValue(of(null));
            const bankAccountCard = fixture.debugElement.query(By.css(creditCardInfoSelector));

            bankAccountCard.triggerEventHandler('deleteCardClick', {});
          });

          it('should open the delete confirmation modal', () => {
            expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
          });

          it('should call the delete credit card service', () => {
            expect(paymentsCreditCardService.delete).toHaveBeenCalled();
          });

          it('should show a succeed toast', () => {
            expect(toastService.show).toHaveBeenCalledWith({
              text: i18nService.translate(TRANSLATION_KEY.DELIVERY_CREDIT_CARD_DELETE_SUCCESS),
              type: TOAST_TYPES.SUCCESS,
            });
          });
        });

        describe('and the action fails...', () => {
          beforeEach(() => {
            spyOn(paymentsCreditCardService, 'delete').and.returnValue(throwError('network error'));
            const bankAccountCard = fixture.debugElement.query(By.css(creditCardInfoSelector));

            bankAccountCard.triggerEventHandler('deleteCardClick', {});
          });

          it('should open the delete confirmation modal', () => {
            expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
          });

          it('should call the delete credit card service', () => {
            expect(paymentsCreditCardService.delete).toHaveBeenCalled();
          });

          it('should show an error toast', () => {
            expect(toastService.show).toHaveBeenCalledWith({
              text: i18nService.translate(TRANSLATION_KEY.DELIVERY_CREDIT_CARD_DELETE_ERROR),
              type: TOAST_TYPES.ERROR,
            });
          });
        });
      });

      describe(`and we don't accept the action`, () => {
        beforeEach(() => {
          spyOn(bankAccountService, 'delete');
          spyOn(modalService, 'open').and.returnValue({ result: Promise.reject(), componentInstance: { ConfirmationModalComponent } });
          const bankAccountCard = fixture.debugElement.query(By.css(bankAccountInfoSelector));

          bankAccountCard.triggerEventHandler('deleteCardClick', {});
        });

        it('should open the delete confirmation modal', () => {
          expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
        });

        it('should NOT call the delete credit card service', () => {
          expect(bankAccountService.delete).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe(`when we don't have credit card...`, () => {
    beforeEach(() => {
      creditCardSubjectMock.next(null);

      fixture.detectChanges();
    });

    it('should NOT show their credit card info', () => {
      expect(de.query(By.css(creditCardInfoSelector))).toBeFalsy();
    });

    it('should should the add credit card', () => {
      expect(de.query(By.css(addCreditCardSelector))).toBeTruthy();
    });

    describe('when clicking to the add credit card button...', () => {
      beforeEach(() => {
        spyOn(router, 'navigate');
        const addCreditCard = de.query(By.css(addCreditCardSelector)).nativeNode;

        addCreditCard.click();
      });

      it('should redirect to the credit card form', () => {
        expect(router.navigate).toHaveBeenCalledWith([component.CREDIT_CARD_FORM_LINK]);
      });
    });
  });

  describe('when we have bank account...', () => {
    beforeEach(() => {
      bankAccountSubjectMock.next(MOCK_BANK_ACCOUNT);

      fixture.detectChanges();
    });

    it('should show their bank account card info', () => {
      expect(de.query(By.css(bankAccountInfoSelector))).toBeTruthy();
    });

    it('should NOT should the add bank account card', () => {
      expect(de.query(By.css(addBankAccountSelector))).toBeFalsy();
    });

    describe('when clicking to the edit/change bank account button...', () => {
      beforeEach(() => {
        spyOn(router, 'navigate');
        spyOn(bankAccountTrackingEventsService, 'trackClickAddEditBankAccount');
        const bankAccountCard = fixture.debugElement.query(By.css(bankAccountInfoSelector));

        bankAccountCard.triggerEventHandler('changeCardClick', {});
      });

      it('should redirect to the bank account form', () => {
        expect(router.navigate).toHaveBeenCalledWith([component.BANK_ACCOUNT_FORM_LINK]);
      });

      it('should track event to analytics', () => {
        expect(bankAccountTrackingEventsService.trackClickAddEditBankAccount).toHaveBeenCalledTimes(1);
        expect(bankAccountTrackingEventsService.trackClickAddEditBankAccount).toHaveBeenCalledWith(true);
      });
    });

    describe('when clicking into the delete bank account button...', () => {
      describe('and we accept the action', () => {
        beforeEach(() => {
          spyOn(toastService, 'show');
          spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve(), componentInstance: { ConfirmationModalComponent } });
        });

        describe('and the action succeed', () => {
          beforeEach(() => {
            spyOn(bankAccountService, 'delete').and.returnValue(of(null));
            const bankAccountCard = fixture.debugElement.query(By.css(bankAccountInfoSelector));

            bankAccountCard.triggerEventHandler('deleteCardClick', {});
          });

          it('should open the delete confirmation modal', () => {
            expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
          });

          it('should call the delete bank account service', () => {
            expect(bankAccountService.delete).toHaveBeenCalled();
          });

          it('should show a succeed toast', () => {
            expect(toastService.show).toHaveBeenCalledWith({
              text: i18nService.translate(TRANSLATION_KEY.DELIVERY_BANK_ACCOUNT_DELETE_SUCCESS),
              type: TOAST_TYPES.SUCCESS,
            });
          });
        });

        describe('and the action fails...', () => {
          beforeEach(() => {
            spyOn(bankAccountService, 'delete').and.returnValue(throwError('network error'));
            const bankAccountCard = fixture.debugElement.query(By.css(bankAccountInfoSelector));

            bankAccountCard.triggerEventHandler('deleteCardClick', {});
          });

          it('should open the delete confirmation modal', () => {
            expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
          });

          it('should call the delete bank account service', () => {
            expect(bankAccountService.delete).toHaveBeenCalled();
          });

          it('should show an error toast', () => {
            expect(toastService.show).toHaveBeenCalledWith({
              text: i18nService.translate(TRANSLATION_KEY.DELIVERY_BANK_ACCOUNT_DELETE_ERROR),
              type: TOAST_TYPES.ERROR,
            });
          });
        });
      });

      describe(`and we don't accept the action`, () => {
        beforeEach(() => {
          spyOn(bankAccountService, 'delete');
          spyOn(modalService, 'open').and.returnValue({ result: Promise.reject(), componentInstance: { ConfirmationModalComponent } });
          const bankAccountCard = fixture.debugElement.query(By.css(bankAccountInfoSelector));

          bankAccountCard.triggerEventHandler('deleteCardClick', {});
        });

        it('should open the delete confirmation modal', () => {
          expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
        });

        it('should NOT call the delete bank account service', () => {
          expect(bankAccountService.delete).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe(`when we don't have bank account...`, () => {
    beforeEach(() => {
      bankAccountSubjectMock.next(null);

      fixture.detectChanges();
    });

    it('should NOT show their bank account card info', () => {
      expect(de.query(By.css(bankAccountInfoSelector))).toBeFalsy();
    });

    it('should should the add bank account card', () => {
      expect(de.query(By.css(addBankAccountSelector))).toBeTruthy();
    });

    describe('when clicking to the add bank account button...', () => {
      beforeEach(() => {
        spyOn(router, 'navigate');
        spyOn(bankAccountTrackingEventsService, 'trackClickAddEditBankAccount');
        const addBankAccountCard = de.query(By.css(addBankAccountSelector)).nativeNode;

        addBankAccountCard.click();
      });

      it('should redirect to the bank account form', () => {
        expect(router.navigate).toHaveBeenCalledWith([component.BANK_ACCOUNT_FORM_LINK]);
      });

      it('should track event to analytics', () => {
        expect(bankAccountTrackingEventsService.trackClickAddEditBankAccount).toHaveBeenCalledTimes(1);
        expect(bankAccountTrackingEventsService.trackClickAddEditBankAccount).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('when redirecting the user...', () => {
    it('should navigate to the specified URL', () => {
      spyOn(router, 'navigate');

      component.redirect(component.CREDIT_CARD_FORM_LINK);

      expect(router.navigate).toHaveBeenCalledWith([component.CREDIT_CARD_FORM_LINK]);
    });
  });

  describe('when formatting the credit card date', () => {
    it('should return the date formatted by MM/YYYY', () => {
      const formattedDate = moment(mockCreditCard.expirationDate).format('MM/YYYY');

      expect(component.formattedCreditCardDate(mockCreditCard.expirationDate)).toBe(formattedDate);
    });
  });

  describe('when formatting the bank account owner name and surname', () => {
    it('should return the name and the surname together', () => {
      const formattedName = `${MOCK_BANK_ACCOUNT.first_name} ${MOCK_BANK_ACCOUNT.last_name}`;

      expect(component.formattedBankAccountName(MOCK_BANK_ACCOUNT)).toBe(formattedName);
    });
  });

  describe('when formatting the bank account IBAN', () => {
    it('should return the last four digits', () => {
      expect(component.formattedBankAccountIBAN(MOCK_BANK_ACCOUNT.iban)).toBe('8273');
    });
  });
});
describe('BankDetailsOverviewComponent', () => {
  describe('WHEN there is an error retrieving data', () => {
    let component: BankDetailsOverviewComponent;
    let fixture: ComponentFixture<BankDetailsOverviewComponent>;
    let bankAccountService: BankAccountService;
    let paymentsCreditCardService: PaymentsCreditCardService;
    let errorActionService: WalletSharedErrorActionService;
    let bankAccountTrackingEventsService: BankAccountTrackingEventsService;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [BankDetailsOverviewComponent, AddCreditCardComponent, PaymentsCardInfoComponent],
        imports: [RouterTestingModule, HttpClientTestingModule],
        providers: [
          {
            provide: BankAccountService,
            useValue: {
              delete() {},
              get bankAccount$() {
                return throwError('There is an error!');
              },
              get() {
                return of(MOCK_BANK_ACCOUNT);
              },
            },
          },
          {
            provide: PaymentsCreditCardService,
            useValue: {
              delete() {},
              get creditCard$() {
                return throwError('There is an error!');
              },
              get() {
                return of(mockCreditCard);
              },
            },
          },
          {
            provide: WalletSharedErrorActionService,
            useValue: MockWalletSharedErrorActionService,
          },
          BankAccountTrackingEventsService,
          KYCBannerApiService,
          { provide: AnalyticsService, useClass: MockAnalyticsService },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(BankDetailsOverviewComponent);
      component = fixture.componentInstance;
      bankAccountService = TestBed.inject(BankAccountService);
      paymentsCreditCardService = TestBed.inject(PaymentsCreditCardService);
      errorActionService = TestBed.inject(WalletSharedErrorActionService);
      bankAccountTrackingEventsService = TestBed.inject(BankAccountTrackingEventsService);

      fixture.detectChanges();
    });

    describe('WHEN there is an error retrieving the bank acount data', () => {
      let errorActionSpy;

      beforeEach(() => {
        errorActionSpy = spyOn(errorActionService, 'show');
      });
      describe('AND WHEN retrieving the raw data', () => {
        it('should show the generic error catcher', fakeAsync(() => {
          jest.spyOn(bankAccountService, 'bankAccount$', 'get').mockReturnValue(throwError('The server is broken'));

          component.bankAccount$.subscribe(
            () => {},
            (error) => {
              expect(errorActionSpy).toHaveBeenCalledTimes(1);
              flush();
            }
          );
        }));
      });
      describe('AND WHEN retrieving the formatted data', () => {
        it('should show the generic error catcher', fakeAsync(() => {
          spyOn(bankAccountService, 'get').and.returnValue(throwError('The server is broken'));

          expect(() => {
            component.ngOnInit();
            fixture.detectChanges();
            tick();
          }).toThrowError();
          flush();

          expect(errorActionSpy).toHaveBeenCalledTimes(1);
        }));
      });
    });
    describe('WHEN there is an error retrieving the credit card data', () => {
      let errorActionSpy;

      beforeEach(() => {
        errorActionSpy = spyOn(errorActionService, 'show');
      });
      describe('AND WHEN retrieving the raw data', () => {
        it('should show the generic error catcher', fakeAsync(() => {
          jest.spyOn(paymentsCreditCardService, 'creditCard$', 'get').mockReturnValue(throwError('The server is broken'));

          component.creditCard$.subscribe(
            () => {},
            (error) => {
              expect(errorActionSpy).toHaveBeenCalledTimes(1);
              flush();
            }
          );
        }));
      });
      describe('AND WHEN retrieving the formatted data', () => {
        it('should show the generic error catcher', fakeAsync(() => {
          spyOn(paymentsCreditCardService, 'get').and.returnValue(throwError('The server is broken'));

          expect(() => {
            component.ngOnInit();
            fixture.detectChanges();
            tick();
          }).toThrowError();
          flush();

          expect(errorActionSpy).toHaveBeenCalledTimes(1);
        }));
      });
    });
  });
});
