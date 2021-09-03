import { DecimalPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  MockPaymentsWalletsService,
  MOCK_PAYMENTS_WALLETS_MAPPED_MONEY,
  MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY,
} from '@api/fixtures/payments/wallets/payments-wallets.fixtures.spec';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { DEFAULT_ERROR_TOAST } from '@layout/toast/core/constants/default-toasts';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { ToastModule } from '@layout/toast/toast.module';
import { WalletSharedErrorActionService } from '@private/features/wallet/shared/error-action';
import { ButtonComponent } from '@shared/button/button.component';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { WalletBalanceInfoComponent } from './wallet-balance-info.component';
import { MockWalletSharedErrorActionService } from '@fixtures/private/wallet/shared/wallet-shared-error-action.fixtures.spec';

describe('WalletBalanceInfoComponent', () => {
  let component: WalletBalanceInfoComponent;
  let fixture: ComponentFixture<WalletBalanceInfoComponent>;
  let walletService: PaymentsWalletsService;
  let decimalPipe: DecimalPipe;
  let toastService: ToastService;
  let errorActionService: WalletSharedErrorActionService;

  const walletBalanceInfoParentSelector = '.WalletBalanceInfo';
  const walletBalanceInfoLoadingSelector = `${walletBalanceInfoParentSelector}__loading`;
  const walletBalanceInfoErrorSelector = `${walletBalanceInfoParentSelector}__error`;
  const walletBalanceInfoAmmountSelector = `${walletBalanceInfoParentSelector}__amount`;
  const walletBalanceInfoIntegerSelector = `${walletBalanceInfoAmmountSelector}__integer`;
  const walletBalanceInfoDecimalSelector = `${walletBalanceInfoAmmountSelector}__decimal`;
  const walletBalanceInfoWithPositiveBalance = `${walletBalanceInfoAmmountSelector}--hasPositiveBalance`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonModule, ToastModule, SvgIconModule, HttpClientTestingModule],
      declarations: [WalletBalanceInfoComponent],
      providers: [
        { provide: PaymentsWalletsService, useClass: MockPaymentsWalletsService },
        DecimalPipe,
        {
          provide: WalletSharedErrorActionService,
          useValue: MockWalletSharedErrorActionService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletBalanceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    walletService = TestBed.inject(PaymentsWalletsService);
    decimalPipe = TestBed.inject(DecimalPipe);
    toastService = TestBed.inject(ToastService);
    errorActionService = TestBed.inject(WalletSharedErrorActionService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when showing the Wallet balance', () => {
    describe('and while waiting for server response', () => {
      it('should show a loading animation', fakeAsync(() => {
        component.loading = true;
        const delayedTime = 2000;
        jest
          .spyOn(walletService, 'walletBalance$', 'get')
          .mockReturnValue(of(MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY).pipe(delay(delayedTime)));
        component.ngOnInit();
        fixture.detectChanges();

        const loadingContainerRef = fixture.debugElement.query(By.css(walletBalanceInfoLoadingSelector));
        expect(loadingContainerRef).toBeTruthy();
        discardPeriodicTasks();
      }));

      describe('and when server responses', () => {
        it('should not show the loading animation', fakeAsync(() => {
          component.loading = true;
          const delayedTime = 2000;
          jest
            .spyOn(walletService, 'walletBalance$', 'get')
            .mockReturnValue(of(MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY).pipe(delay(delayedTime)));
          component.ngOnInit();
          tick(delayedTime);
          fixture.detectChanges();

          const loadingContainerRef = fixture.debugElement.query(By.css(walletBalanceInfoLoadingSelector));
          expect(loadingContainerRef).toBeFalsy();
        }));
      });
    });

    describe('and when the user has a balance of 0 in the Wallet', () => {
      beforeEach(() => {
        jest.spyOn(walletService, 'walletBalance$', 'get').mockReturnValue(of(MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY));
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should show 0 as balance', () => {
        const expectedIntegerValue = MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY.amount.integer.toString();
        const expectedDecimalValue = decimalPipe.transform(MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY.amount.decimals, '2.0-0');
        const integerValue = fixture.debugElement.query(By.css(walletBalanceInfoIntegerSelector)).nativeElement.innerHTML;
        const decimalValue = fixture.debugElement.query(By.css(walletBalanceInfoDecimalSelector)).nativeElement.innerHTML;

        expect(integerValue).toEqual(expectedIntegerValue);
        expect(decimalValue).toEqual(expectedDecimalValue);
      });

      it('should disable the transfer money button', () => {
        const buttonComponentRef: ButtonComponent = fixture.debugElement.query(By.directive(ButtonComponent)).componentInstance;
        expect(buttonComponentRef.disabled).toBe(true);
      });

      it('should display balance with the non positive balance style', () => {
        const containerWithPositiveBalanceRef = fixture.debugElement.query(By.css(walletBalanceInfoWithPositiveBalance));
        expect(containerWithPositiveBalanceRef).toBeFalsy();
      });
    });

    describe('and when the user has some money in the Wallet', () => {
      beforeEach(() => {
        jest.spyOn(walletService, 'walletBalance$', 'get').mockReturnValue(of(MOCK_PAYMENTS_WALLETS_MAPPED_MONEY));
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should show the money in the balance', () => {
        const expectedIntegerValue = MOCK_PAYMENTS_WALLETS_MAPPED_MONEY.amount.integer.toString();
        const expectedDecimalValue = decimalPipe.transform(MOCK_PAYMENTS_WALLETS_MAPPED_MONEY.amount.decimals, '2.0-0');
        const integerValue = fixture.debugElement.query(By.css(walletBalanceInfoIntegerSelector)).nativeElement.innerHTML;
        const decimalValue = fixture.debugElement.query(By.css(walletBalanceInfoDecimalSelector)).nativeElement.innerHTML;

        expect(integerValue).toEqual(expectedIntegerValue);
        expect(decimalValue).toEqual(expectedDecimalValue);
      });

      it('should activate the transfer money button', () => {
        const buttonComponentRef: ButtonComponent = fixture.debugElement.query(By.directive(ButtonComponent)).componentInstance;
        expect(buttonComponentRef.disabled).toBe(false);
      });

      it('should display balance with the positive balance style', () => {
        const containerWithPositiveBalanceRef = fixture.debugElement.query(By.css(walletBalanceInfoWithPositiveBalance));
        expect(containerWithPositiveBalanceRef).toBeTruthy();
      });
    });

    describe('and when there is an error from the server side', () => {
      beforeEach(() => {
        jest.spyOn(walletService, 'walletBalance$', 'get').mockReturnValue(throwError('F in chat'));
        spyOn(toastService, 'show');
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should show an empty error state', () => {
        const errorContainerRef = fixture.debugElement.query(By.css(walletBalanceInfoErrorSelector));
        expect(errorContainerRef).toBeTruthy();
      });

      it('should show a toast with a generic message', () => {
        expect(toastService.show).toHaveBeenCalledWith(DEFAULT_ERROR_TOAST);
      });
    });

    describe('WHEN there is an error retrieving the balance info', () => {
      let errorActionSpy;

      beforeEach(() => {
        errorActionSpy = spyOn(errorActionService, 'show');
      });
      it('should show the generic error catcher', fakeAsync(() => {
        jest.spyOn(walletService, 'walletBalance$', 'get').mockReturnValue(throwError('The server is broken'));

        component.ngOnInit();

        expect(errorActionSpy).toHaveBeenCalledTimes(1);
      }));
    });
  });
});
