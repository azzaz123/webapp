import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, LOCALE_ID } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { DEFAULT_ERROR_TOAST } from '@layout/toast/core/constants/default-toasts';
import { HelpLocaleId } from '@core/external-links/customer-help/customer-help-constants';
import {
  MockPaymentsWalletsService,
  MOCK_PAYMENTS_WALLETS_MAPPED_MONEY,
  MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY,
} from '@api/fixtures/payments/wallets/payments-wallets.fixtures.spec';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { WalletTransferAmountComponent } from '@private/features/wallet/modals/transfer/components/amount/wallet-transfer-amount.component';

import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'tsl-fake-component',
  templateUrl: './wallet-transfer-amount.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class FakeComponent extends WalletTransferAmountComponent {
  constructor(
    @Inject(LOCALE_ID) locale: HelpLocaleId,
    changeDetectorRef: ChangeDetectorRef,
    paymentsWalletsService: PaymentsWalletsService,
    toastService: ToastService
  ) {
    super(locale, changeDetectorRef, paymentsWalletsService, toastService);
  }
}

describe('WalletTransferAmountComponent', () => {
  let component: WalletTransferAmountComponent;
  let fixture: ComponentFixture<WalletTransferAmountComponent>;
  let decimalPipe: DecimalPipe;
  let toastService: ToastService;
  let walletService: PaymentsWalletsService;

  const walletTransferAmountSelector = '.WalletTransferAmount';
  const walletTransferAmountSpinnerSelector = `${walletTransferAmountSelector}__spinner`;
  const walletTransferAmountFigureSelector = `${walletTransferAmountSelector}__figure`;
  const walletTransferAmountFigureIntegerSelector = `${walletTransferAmountFigureSelector}__integer`;
  const walletTransferAmountFigureDecimalSelector = `${walletTransferAmountFigureSelector}__decimal`;
  const walletTransferAmountFigureResetSelector = `${walletTransferAmountFigureSelector}__reset`;
  const walletTransferAmountFigureRangeSelector = `${walletTransferAmountSelector}__range`;
  const walletTransferAmountCtaSelector = `${walletTransferAmountSelector}__CTA`;
  const walletTransferAmountErrorSelector = `${walletTransferAmountSelector}__error`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent, FakeComponent, SvgIconComponent],
      imports: [CommonModule, FormsModule, HttpClientTestingModule],
      providers: [{ provide: PaymentsWalletsService, useClass: MockPaymentsWalletsService }, DecimalPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    decimalPipe = TestBed.inject(DecimalPipe);
    toastService = TestBed.inject(ToastService);
    walletService = TestBed.inject(PaymentsWalletsService);

    fixture = TestBed.createComponent(FakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('WHEN displaying the view', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('WHEN showing the Wallet balance', () => {
    describe('AND WHEN while waiting for wallet payment server response', () => {
      it('should show a loading animation', fakeAsync(() => {
        const delayedTime = 2000;

        jest
          .spyOn(walletService, 'walletBalance$', 'get')
          .mockReturnValue(of(MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY).pipe(delay(delayedTime)));
        jest.spyOn(component, 'showSpinner', 'get').mockReturnValue(true);

        component.ngOnInit();
        fixture.detectChanges();

        const loadingContainerRef = fixture.debugElement.query(By.css(walletTransferAmountSpinnerSelector));
        expect(loadingContainerRef).toBeTruthy();

        discardPeriodicTasks();
      }));

      describe('AND WHEN server responses', () => {
        it('should not show the loading animation', fakeAsync(() => {
          const delayedTime = 2000;
          jest
            .spyOn(walletService, 'walletBalance$', 'get')
            .mockReturnValue(of(MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY).pipe(delay(delayedTime)));
          jest.spyOn(component, 'showSpinner', 'get').mockReturnValue(false);

          component.ngOnInit();
          tick(delayedTime);
          fixture.detectChanges();

          const loadingContainerRef = fixture.debugElement.query(By.css(walletTransferAmountSpinnerSelector));
          expect(loadingContainerRef).toBeFalsy();
        }));
      });
    });

    describe('AND WHEN user has a balance of 0 in the Wallet', () => {
      beforeEach(() => {
        jest.spyOn(walletService, 'walletBalance$', 'get').mockReturnValue(of(MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY));

        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should show 0 in the integer part', () => {
        const expectedIntegerValue = MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY.amount.integer.toString();
        const integerValue = fixture.debugElement.query(By.css(walletTransferAmountFigureIntegerSelector)).nativeElement.value;

        expect(integerValue).toEqual(expectedIntegerValue);
      });

      it('should show 0 in the decimal part', () => {
        const expectedDecimalValue = decimalPipe.transform(MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY.amount.decimals, '2.0-0');
        const decimalValue = fixture.debugElement.query(By.css(walletTransferAmountFigureDecimalSelector)).nativeElement.value;

        expect(decimalValue).toEqual(expectedDecimalValue);
      });

      it('should show the reset button', () => {
        const resetButton = fixture.debugElement.query(By.css(walletTransferAmountFigureResetSelector));

        expect(resetButton).toBeTruthy();
      });

      it('should show 0 in the range', () => {
        const expectedRangeValue = `<span>Maximum ${MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY.amount.toString()} ${
          MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY.currency.symbol
        } - Minimum 0,5 €</span>`;
        const rangeValue = fixture.debugElement.query(By.css(walletTransferAmountFigureRangeSelector)).nativeElement.innerHTML;

        expect(rangeValue).toEqual(expectedRangeValue);
      });
    });

    describe('AND WHEN there is no balance', () => {
      beforeEach(() => {
        jest.spyOn(walletService, 'walletBalance$', 'get').mockReturnValue(of(null));

        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should not show balance information', () => {
        const balanceInfo = fixture.debugElement.query(By.css(walletTransferAmountFigureSelector));

        expect(balanceInfo).toBeFalsy();
      });

      it('should not show the CTA', () => {
        const ctaButton = fixture.debugElement.query(By.css(walletTransferAmountCtaSelector));

        expect(ctaButton).toBeFalsy();
      });
    });

    describe('AND WHEN user has some money in the Wallet', () => {
      beforeEach(() => {
        jest.spyOn(walletService, 'walletBalance$', 'get').mockReturnValue(of(MOCK_PAYMENTS_WALLETS_MAPPED_MONEY));

        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should show the interger part of the money in the balance', () => {
        const expectedIntegerValue = MOCK_PAYMENTS_WALLETS_MAPPED_MONEY.amount.integer.toString();
        const integerValue = fixture.debugElement.query(By.css(walletTransferAmountFigureIntegerSelector)).nativeElement.value;

        expect(integerValue).toEqual(expectedIntegerValue);
      });

      it('should show the decimal part of the money in the balance', () => {
        const expectedDecimalValue = decimalPipe.transform(MOCK_PAYMENTS_WALLETS_MAPPED_MONEY.amount.decimals, '2.0-0');
        const decimalValue = fixture.debugElement.query(By.css(walletTransferAmountFigureDecimalSelector)).nativeElement.value;

        expect(decimalValue).toEqual(expectedDecimalValue);
      });

      it('should show the reset button', () => {
        const resetButton = fixture.debugElement.query(By.css(walletTransferAmountFigureResetSelector));

        expect(resetButton).toBeTruthy();
      });

      it('should show the amount of money in the range', () => {
        const expectedRangeValue = `<span>Maximum ${MOCK_PAYMENTS_WALLETS_MAPPED_MONEY.amount.toString()} ${
          MOCK_PAYMENTS_WALLETS_MAPPED_MONEY.currency.symbol
        } - Minimum 0,5 €</span>`;
        const rangeValue = fixture.debugElement.query(By.css(walletTransferAmountFigureRangeSelector)).nativeElement.innerHTML;

        expect(rangeValue).toEqual(expectedRangeValue);
      });
    });

    describe('AND WhEN there is an error from the server side', () => {
      beforeEach(() => {
        jest.spyOn(walletService, 'walletBalance$', 'get').mockReturnValue(throwError('F in chat'));
        spyOn(toastService, 'show');

        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should show an empty error state', () => {
        const errorContainerRef = fixture.debugElement.query(By.css(walletTransferAmountErrorSelector));

        expect(errorContainerRef).toBeTruthy();
      });

      it('should show a toast with a generic message', () => {
        expect(toastService.show).toHaveBeenCalledWith(DEFAULT_ERROR_TOAST);
      });
    });
  });
});
