import { By } from '@angular/platform-browser';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DecimalPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { ButtonModule } from '@shared/button/button.module';
import { DEFAULT_ERROR_TOAST } from '@layout/toast/core/constants/default-toasts';
import { KYC_BANNER_TYPES } from '@private/features/wallet/components/kyc-banner/kyc-banner-constants';
import { KYCBannerService } from '@private/features/wallet/services/kyc-banner/kyc-banner.service';
import {
  MockPaymentsWalletsService,
  MOCK_PAYMENTS_WALLETS_MAPPED_MONEY,
  MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY,
} from '@api/fixtures/payments/wallets/payments-wallets.fixtures.spec';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { ToastModule } from '@layout/toast/toast.module';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { WalletBalanceInfoComponent } from './wallet-balance-info.component';

import { delay } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

describe('WalletBalanceInfoComponent', () => {
  let bannerService: KYCBannerService;
  let component: WalletBalanceInfoComponent;
  let decimalPipe: DecimalPipe;
  let fixture: ComponentFixture<WalletBalanceInfoComponent>;
  let toastService: ToastService;
  let walletService: PaymentsWalletsService;

  const walletBalanceInfoParentSelector = '.WalletBalanceInfo';
  const walletBalanceInfoLoadingSelector = `${walletBalanceInfoParentSelector}__loading`;
  const walletBalanceInfoErrorSelector = `${walletBalanceInfoParentSelector}__error`;
  const walletBalanceInfoAmountSelector = `${walletBalanceInfoParentSelector}__amount`;
  const walletBalanceInfoCtaSelector = `${walletBalanceInfoParentSelector}__CTA`;
  const walletBalanceInfoIntegerSelector = `${walletBalanceInfoAmountSelector}__integer`;
  const walletBalanceInfoDecimalSelector = `${walletBalanceInfoAmountSelector}__decimal`;
  const walletBalanceInfoWithPositiveBalance = `${walletBalanceInfoAmountSelector}--hasPositiveBalance`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonModule, ToastModule, SvgIconModule, HttpClientTestingModule],
      declarations: [WalletBalanceInfoComponent],
      providers: [
        { provide: PaymentsWalletsService, useClass: MockPaymentsWalletsService },
        DecimalPipe,
        {
          provide: KYCBannerService,
          useValue: {
            getSpecifications() {
              return of(null);
            },
          },
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
    bannerService = TestBed.inject(KYCBannerService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when showing the Wallet balance', () => {
    describe('and while waiting for payment server response', () => {
      it('should show a loading animation', fakeAsync(() => {
        component.loading = true;
        const delayedTime = 2000;
        jest
          .spyOn(walletService, 'walletBalance$', 'get')
          .mockReturnValue(of(MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY).pipe(delay(delayedTime)));
        jest.spyOn(bannerService, 'getSpecifications').mockReturnValue(of(null).pipe(delay(delayedTime)));
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

    describe('and while waiting for banner server response', () => {
      it('should show a loading animation', fakeAsync(() => {
        component.loading = true;
        const delayedTime = 2000;
        jest.spyOn(bannerService, 'getSpecifications').mockReturnValue(of(null).pipe(delay(delayedTime)));
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
          jest.spyOn(bannerService, 'getSpecifications').mockReturnValue(of(null).pipe(delay(delayedTime)));
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

      it('should display balance with the non positive balance style', () => {
        const containerWithPositiveBalanceRef = fixture.debugElement.query(By.css(walletBalanceInfoWithPositiveBalance));
        expect(containerWithPositiveBalanceRef).toBeFalsy();
      });

      describe('WHEN the user is validated', () => {
        beforeEach(() => {
          jest.spyOn(bannerService, 'getSpecifications').mockReturnValue(of(KYC_BANNER_TYPES[2]));
          component.ngOnInit();
          fixture.detectChanges();
        });
        it('should disable the transfer money button', () => {
          const buttonComponentRef: ButtonComponent = fixture.debugElement.query(By.directive(ButtonComponent)).componentInstance;
          expect(buttonComponentRef.disabled).toBe(true);
        });
      });

      describe('WHEN the user does not need validation', () => {
        beforeEach(() => {
          jest.spyOn(bannerService, 'getSpecifications').mockReturnValue(of(null));
          component.ngOnInit();
          fixture.detectChanges();
        });
        it('should disable the transfer money button', () => {
          const buttonComponentRef: ButtonComponent = fixture.debugElement.query(By.directive(ButtonComponent)).componentInstance;
          expect(buttonComponentRef.disabled).toBe(true);
        });
      });
    });

    describe('and when there is no balance', () => {
      beforeEach(() => {
        jest.spyOn(walletService, 'walletBalance$', 'get').mockReturnValue(of(null));
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should not show balance information', () => {
        const balanceInfo = fixture.debugElement.query(By.css(walletBalanceInfoAmountSelector));

        expect(balanceInfo).toBeFalsy();
      });

      it('should not show the CTA', () => {
        const ctaButton = fixture.debugElement.query(By.css(walletBalanceInfoCtaSelector));

        expect(ctaButton).toBeFalsy();
      });

      it('should not allow transfer', () => {
        expect(component.allowTransfer).toBe(false);
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

      describe('WHEN the user is validated', () => {
        beforeEach(() => {
          jest.spyOn(bannerService, 'getSpecifications').mockReturnValue(of(KYC_BANNER_TYPES[2]));
          component.ngOnInit();
          fixture.detectChanges();
        });
        it('should display balance with the positive balance style', () => {
          const containerWithPositiveBalanceRef = fixture.debugElement.query(By.css(walletBalanceInfoWithPositiveBalance));
          expect(containerWithPositiveBalanceRef).toBeTruthy();
        });
      });

      describe('WHEN the user does not need validation', () => {
        beforeEach(() => {
          jest.spyOn(bannerService, 'getSpecifications').mockReturnValue(of(null));
          component.ngOnInit();
          fixture.detectChanges();
        });
        it('should display balance with the positive balance style', () => {
          const containerWithPositiveBalanceRef = fixture.debugElement.query(By.css(walletBalanceInfoWithPositiveBalance));
          expect(containerWithPositiveBalanceRef).toBeTruthy();
        });
      });

      describe('WHEN the user is not validated and needs validations', () => {
        beforeEach(() => {
          jest.spyOn(bannerService, 'getSpecifications').mockReturnValue(of(KYC_BANNER_TYPES[0]));
          component.ngOnInit();
          fixture.detectChanges();
        });
        it('should disable the transfer money button', () => {
          const buttonComponentRef: ButtonComponent = fixture.debugElement.query(By.directive(ButtonComponent)).componentInstance;
          expect(buttonComponentRef.disabled).toBe(true);
        });
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
  });
});
