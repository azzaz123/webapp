import { By } from '@angular/platform-browser';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DecimalPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { ButtonModule } from '@shared/button/button.module';
import { DEFAULT_ERROR_TOAST } from '@layout/toast/core/constants/default-toasts';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';
import { MOCK_KYC_NO_NEED_PROPERTIES_API } from '@fixtures/private/wallet/kyc/kyc-properties.fixtures.spec';
import {
  MOCK_KYC_SPECIFICATIONS_NO_NEED,
  MOCK_KYC_SPECIFICATIONS_PENDING,
  MOCK_KYC_SPECIFICATIONS_VERIFIED,
} from '@fixtures/private/wallet/kyc/kyc-specifications.fixtures.spec';
import {
  MockPaymentsWalletsService,
  MOCK_PAYMENTS_WALLETS_MAPPED_MONEY,
  MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY,
} from '@api/fixtures/payments/wallets/payments-wallets.fixtures.spec';
import { MockWalletSharedErrorActionService } from '@fixtures/private/wallet/shared/wallet-shared-error-action.fixtures.spec';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { ToastModule } from '@layout/toast/toast.module';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { WalletBalanceInfoComponent } from './wallet-balance-info.component';
import { WalletSharedErrorActionService } from '@private/features/wallet/shared/error-action';

import { delay } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('WalletBalanceInfoComponent', () => {
  let propertiesService: KYCPropertiesService;
  let component: WalletBalanceInfoComponent;
  let decimalPipe: DecimalPipe;
  let fixture: ComponentFixture<WalletBalanceInfoComponent>;
  let toastService: ToastService;
  let walletService: PaymentsWalletsService;
  let errorActionService: WalletSharedErrorActionService;
  let ngbModal: NgbModal;

  const walletBalanceInfoParentSelector = '.WalletBalanceInfo';
  const walletBalanceInfoLoadingSelector = `${walletBalanceInfoParentSelector}__loading`;
  const walletBalanceInfoErrorSelector = `${walletBalanceInfoParentSelector}__error`;
  const walletBalanceInfoAmountSelector = `${walletBalanceInfoParentSelector}__amount`;
  const walletBalanceInfoCtaSelector = `${walletBalanceInfoParentSelector}__CTA`;
  const walletBalanceInfoCtaButtonSelector = `${walletBalanceInfoParentSelector}__CTA tsl-button`;
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
          provide: KYCPropertiesService,
          useValue: {
            get() {
              return of(MOCK_KYC_NO_NEED_PROPERTIES_API);
            },
            getBannerSpecificationsFromProperties(property) {
              return of(MOCK_KYC_SPECIFICATIONS_NO_NEED);
            },
          },
        },
        {
          provide: WalletSharedErrorActionService,
          useValue: MockWalletSharedErrorActionService,
        },
        NgbModal,
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
    propertiesService = TestBed.inject(KYCPropertiesService);
    errorActionService = TestBed.inject(WalletSharedErrorActionService);
    ngbModal = TestBed.inject(NgbModal);
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
        jest
          .spyOn(propertiesService, 'getBannerSpecificationsFromProperties')
          .mockReturnValue(of(MOCK_KYC_SPECIFICATIONS_NO_NEED).pipe(delay(delayedTime)));

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
        jest
          .spyOn(propertiesService, 'getBannerSpecificationsFromProperties')
          .mockReturnValue(of(MOCK_KYC_SPECIFICATIONS_NO_NEED).pipe(delay(delayedTime)));

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
          jest.spyOn(propertiesService, 'getBannerSpecificationsFromProperties').mockReturnValue(of(MOCK_KYC_SPECIFICATIONS_VERIFIED));

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
          jest.spyOn(propertiesService, 'getBannerSpecificationsFromProperties').mockReturnValue(of(MOCK_KYC_SPECIFICATIONS_VERIFIED));

          component.ngOnInit();
          fixture.detectChanges();
        });

        it('should display balance with the positive balance style', () => {
          const containerWithPositiveBalanceRef = fixture.debugElement.query(By.css(walletBalanceInfoWithPositiveBalance));

          expect(containerWithPositiveBalanceRef).toBeTruthy();
        });

        it('should not disable the transfer money button', () => {
          const buttonComponentRef: ButtonComponent = fixture.debugElement.query(By.directive(ButtonComponent)).componentInstance;

          expect(buttonComponentRef.disabled).toBe(false);
        });

        describe('WHEN the user clicks over the transfer button', () => {
          beforeEach(() => {
            jest.spyOn(walletService, 'walletBalance$', 'get').mockReturnValue(of(MOCK_PAYMENTS_WALLETS_MAPPED_MONEY));
            spyOn(ngbModal, 'open').and.returnValue({
              result: Promise.resolve(),
            });
          });

          it('should open the modal view', () => {
            const buttonComponentRef: HTMLButtonElement = fixture.debugElement.query(By.css(walletBalanceInfoCtaButtonSelector))
              .nativeElement;

            (buttonComponentRef as HTMLButtonElement).click();

            expect(ngbModal.open).toHaveBeenCalledTimes(1);
          });

          it('should retrieve the wallet balance', () => {
            const buttonComponentRef: HTMLButtonElement = fixture.debugElement.query(By.css(walletBalanceInfoCtaButtonSelector))
              .nativeElement;

            (buttonComponentRef as HTMLButtonElement).click();

            walletService.walletBalance$.subscribe(() => {
              expect(walletService.walletBalance$).toHaveBeenCalledTimes(1);
            });
          });
        });
      });

      describe('WHEN the user does not need validation', () => {
        beforeEach(() => {
          jest.spyOn(propertiesService, 'getBannerSpecificationsFromProperties').mockReturnValue(of(MOCK_KYC_SPECIFICATIONS_NO_NEED));

          component.ngOnInit();
          fixture.detectChanges();
        });

        it('should display balance with the positive balance style', () => {
          const containerWithPositiveBalanceRef = fixture.debugElement.query(By.css(walletBalanceInfoWithPositiveBalance));

          expect(containerWithPositiveBalanceRef).toBeTruthy();
        });

        it('should not disable the transfer money button', () => {
          const buttonComponentRef: ButtonComponent = fixture.debugElement.query(By.directive(ButtonComponent)).componentInstance;

          expect(buttonComponentRef.disabled).toBe(false);
        });

        describe('WHEN the user clicks over the transfer button', () => {
          beforeEach(() => {
            jest.spyOn(walletService, 'walletBalance$', 'get').mockReturnValue(of(MOCK_PAYMENTS_WALLETS_MAPPED_MONEY));
            spyOn(ngbModal, 'open').and.returnValue({
              result: Promise.resolve(),
            });
          });

          it('should open the modal view', () => {
            const buttonComponentRef: HTMLButtonElement = fixture.debugElement.query(By.css(walletBalanceInfoCtaButtonSelector))
              .nativeElement;

            (buttonComponentRef as HTMLButtonElement).click();

            expect(ngbModal.open).toHaveBeenCalledTimes(1);
          });

          it('should retrieve the wallet balance', () => {
            const buttonComponentRef: HTMLButtonElement = fixture.debugElement.query(By.css(walletBalanceInfoCtaButtonSelector))
              .nativeElement;

            (buttonComponentRef as HTMLButtonElement).click();

            walletService.walletBalance$.subscribe(() => {
              expect(walletService.walletBalance$).toHaveBeenCalledTimes(1);
            });
          });
        });
      });

      describe('WHEN the user is not validated and needs validations', () => {
        beforeEach(() => {
          jest.spyOn(propertiesService, 'getBannerSpecificationsFromProperties').mockReturnValue(of(MOCK_KYC_SPECIFICATIONS_PENDING));

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
