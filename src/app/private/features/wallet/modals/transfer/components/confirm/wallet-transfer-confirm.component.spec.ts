import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import {
  MOCK_BALANCE,
  MOCK_MONEY_TO_TRANSFER,
  MOCK_TRANSFER_AMOUNT,
} from '@fixtures/private/wallet/transfer/wallet-transfer.fixtures.spec';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { WalletTransferConfirmComponent } from '@private/features/wallet/modals/transfer/components/confirm/wallet-transfer-confirm.component';
import { WalletTransferGenericError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-generic-error';
import { WalletTransferMoneyModel } from '@private/features/wallet/modals/transfer/models/wallet-transfer-money.model';
import { WalletTransferService } from '@private/features/wallet/services/transfer/wallet-transfer.service';
import { WalletTransferTrackingEventService } from '@private/features/wallet/modals/transfer/services/wallet-transfer-tracking-event.service';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'tsl-fake-component',
  templateUrl: './wallet-transfer-confirm.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class FakeComponent extends WalletTransferConfirmComponent {
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    ngbActiveModal: NgbActiveModal,
    toastService: ToastService,
    transferService: WalletTransferService,
    transferTrackingEventService: WalletTransferTrackingEventService
  ) {
    super(changeDetectorRef, ngbActiveModal, toastService, transferService, transferTrackingEventService);
  }
}

describe('WalletTransferConfirmComponent', () => {
  let component: WalletTransferConfirmComponent;
  let fixture: ComponentFixture<WalletTransferConfirmComponent>;
  let ngbActiveModal: NgbActiveModal;
  let toastService: ToastService;
  let transferService: WalletTransferService;
  let transferTrackingEventService: WalletTransferTrackingEventService;

  const walletTransferConfirmSelector = '.WalletTransferConfirm';
  const walletTransferConfirmAmountSelector = `${walletTransferConfirmSelector}__amount`;
  const walletTransferConfirmCancelButtonSelector = `${walletTransferConfirmSelector}__cancel tsl-button button`;
  const walletTransferConfirmConfirmButtonSelector = `${walletTransferConfirmSelector}__confirm tsl-button button`;
  const walletTransferConfirmConfirmButtonLoadingSelector = `${walletTransferConfirmConfirmButtonSelector}.loading`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent, SvgIconComponent, FakeComponent],
      imports: [HttpClientTestingModule],
      providers: [
        NgbActiveModal,
        ToastService,
        {
          provide: WalletTransferService,
          useValue: {
            checkPayUserBankAcount() {
              return of(null);
            },
            transfer(value) {
              return of(null);
            },
          },
        },
        {
          provide: WalletTransferTrackingEventService,
          useValue: {
            trackConfirmTransferBankAccount() {},
            trackSelectTransferAmount() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    ngbActiveModal = TestBed.inject(NgbActiveModal);
    toastService = TestBed.inject(ToastService);
    transferService = TestBed.inject(WalletTransferService);
    transferTrackingEventService = TestBed.inject(WalletTransferTrackingEventService);

    fixture = TestBed.createComponent(FakeComponent);
    component = fixture.componentInstance;
    component.transferAmount = MOCK_TRANSFER_AMOUNT;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('WHEN the user has set a correct amount of money', () => {
    it('should show the amount of money in the range', () => {
      component.transferAmount = new WalletTransferMoneyModel(13.31, MOCK_BALANCE);
      const expectedAmountValue = `<span>You are going to transfer 13.31 € from wallet to your bank account</span>`;

      fixture.detectChanges();
      const amountValue = fixture.debugElement.query(By.css(walletTransferConfirmAmountSelector)).nativeElement.innerHTML;

      expect(amountValue).toEqual(expectedAmountValue);
    });

    it('should show the cancel button activated', () => {
      const cancelButton = fixture.debugElement.query(By.css(walletTransferConfirmCancelButtonSelector)).nativeElement;

      expect(cancelButton).toBeTruthy();
      expect((cancelButton as HTMLButtonElement).disabled).toBe(false);
    });

    it('should show the confirm button activated', () => {
      component.isTransferInProgress = false;
      fixture.detectChanges();
      const confirmButton = fixture.debugElement.query(By.css(walletTransferConfirmConfirmButtonSelector)).nativeElement;

      expect(confirmButton).toBeTruthy();
      expect((confirmButton as HTMLButtonElement).disabled).toBe(false);
    });

    it('should not show the spinner', () => {
      const target = fixture.debugElement.query(By.css(walletTransferConfirmConfirmButtonLoadingSelector));

      expect(target).toBeFalsy();
    });
  });

  describe('WHEN they click on the cancel button', () => {
    it('should go back to the transfer view', () => {
      const canceledSpy = spyOn(component.canceled, 'emit');

      fixture.debugElement.query(By.css(walletTransferConfirmCancelButtonSelector)).nativeElement.click();

      expect(canceledSpy).toHaveBeenCalledTimes(1);
      expect(canceledSpy).toHaveBeenCalledWith();
    });
  });

  describe('WHEN they click on the confirm button', () => {
    beforeEach(() => {
      const delayedTime = 2000;
      jest.spyOn(transferService, 'transfer').mockReturnValue(of(null).pipe(delay(delayedTime)));
      spyOn(transferTrackingEventService, 'trackConfirmTransferBankAccount');
    });

    it('should track the corresponding event', () => {
      component.transferAmount = MOCK_TRANSFER_AMOUNT;

      component.confirmTransfer();

      expect(transferTrackingEventService.trackConfirmTransferBankAccount).toHaveBeenCalledTimes(1);
      expect(transferTrackingEventService.trackConfirmTransferBankAccount).toHaveBeenCalledWith(
        MOCK_TRANSFER_AMOUNT.balance.amount.total,
        MOCK_TRANSFER_AMOUNT.amount.total
      );
    });

    it('should process only the first click', fakeAsync(() => {
      component.confirmTransfer();
      component.confirmTransfer();
      component.confirmTransfer();
      fixture.detectChanges();

      expect(transferService.transfer).toHaveBeenCalledTimes(1);

      discardPeriodicTasks();
    }));

    it('should show the spinner while it transfers the money', fakeAsync(() => {
      component.confirmTransfer();
      fixture.detectChanges();

      const target = fixture.debugElement.query(By.css(walletTransferConfirmConfirmButtonLoadingSelector));
      expect(target).toBeTruthy();

      discardPeriodicTasks();
    }));

    it('should close the modal when the transfer is completed', () => {
      spyOn(ngbActiveModal, 'close').and.callThrough();

      transferService.transfer(MOCK_MONEY_TO_TRANSFER).subscribe(() => {
        expect(ngbActiveModal.close).toHaveBeenCalledTimes(1);
      });

      fixture.debugElement.query(By.css(walletTransferConfirmConfirmButtonSelector)).nativeElement.click();
      fixture.detectChanges();
    });

    it('should show the sent transfer message', () => {
      const expectedMessage = {
        type: 'success',
        text: $localize`:@@make_transfer_view_snackbar_money_sent_description:Money sent! Will be reflected in your account within the indicated period.`,
      };
      spyOn(toastService, 'show').and.callFake(() => {});

      transferService.transfer(MOCK_MONEY_TO_TRANSFER).subscribe(() => {
        expect(toastService.show).toBeCalledTimes(1);
        expect(toastService.show).toHaveBeenCalledWith(jasmine.objectContaining(expectedMessage));
      });
      fixture.debugElement.query(By.css(walletTransferConfirmConfirmButtonSelector)).nativeElement.click();
      fixture.detectChanges();
    });
  });

  describe('AND WhEN there is an error from the server side', () => {
    beforeEach(() => {
      spyOn(transferService, 'transfer').and.returnValue(throwError(new WalletTransferGenericError()));
      spyOn(toastService, 'show');
      spyOn(component.transferError, 'emit');

      component.confirmTransfer();
      fixture.detectChanges();
    });

    it('should show a toast with a generic message', () => {
      const expected = {
        text: "Something went wrong, money hasn't been transferred. Try again.",
        title: 'Oops!',
        type: 'error',
      };
      expect(toastService.show).toHaveBeenCalledWith(expected);
    });

    it('should emit an event with the error', () => {
      component.transferAmount = MOCK_TRANSFER_AMOUNT;
      expect(component.transferError.emit).toHaveBeenCalledWith(component.transferAmount);
    });
  });
});
