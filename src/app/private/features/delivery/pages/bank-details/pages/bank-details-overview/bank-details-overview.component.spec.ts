import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { mockCreditCard } from '@api/fixtures/payments/cards/credit-card.fixtures.spec';
import { PaymentsCreditCardService } from '@api/payments/cards';
import { I18nService } from '@core/i18n/i18n.service';
import { MOCK_BANK_ACCOUNT } from '@fixtures/private/delivery/bank-account/bank-account.fixtures.spec';
import { BankAccount } from '@private/features/delivery/interfaces/bank-account/bank-account-api.interface';
import { BankAccountService } from '@private/features/delivery/services/bank-account/bank-account.service';
import { AddCreditCardComponent } from '@shared/add-credit-card/add-credit-card.component';
import { CreditCardInfoComponent } from '@shared/credit-card-info/credit-card-info.component';
import { BehaviorSubject } from 'rxjs';

import { BankDetailsOverviewComponent } from './bank-details-overview.component';

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
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BankDetailsOverviewComponent, AddCreditCardComponent, CreditCardInfoComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: BankAccountService,
          useValue: {
            get() {
              return bankAccountSubjectMock;
            },
          },
        },
        {
          provide: PaymentsCreditCardService,
          useValue: {
            get() {
              return creditCardSubjectMock;
            },
          },
        },
        I18nService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankDetailsOverviewComponent);
    component = fixture.componentInstance;
    bankAccountService = TestBed.inject(BankAccountService);
    paymentsCreditCardService = TestBed.inject(PaymentsCreditCardService);
    de = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
      describe('and we accept the confirmation modal', () => {
        it('should delete the credit card', () => {});
      });

      describe(`and we don't accept the confirmation modal`, () => {
        it('should NOT delete the credit card', () => {});
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
      it('should redirect to the credit card form', () => {});
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
      it('should redirect to the bank account form', () => {});
    });

    describe('when clicking into the delete bank account button...', () => {
      describe('and we accept the confirmation modal', () => {
        it('should delete the bank account', () => {});
      });

      describe(`and we don't accept the confirmation modal`, () => {
        it('should NOT delete the bank account', () => {});
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
      it('should redirect to the bank account form', () => {});
    });
  });

  describe('when redirecting the user...', () => {
    it('should navigate to the correct URL', () => {});
  });

  describe('when formatting the credit card date', () => {
    it('should return the date formatted by MM/YYYY', () => {});
  });

  describe('when formatting the bank account owner name and surname', () => {
    it('should return the name and the surname together', () => {});
  });

  describe('when formatting the bank account IBAN', () => {
    it('should return the last four digits', () => {});
  });
});
