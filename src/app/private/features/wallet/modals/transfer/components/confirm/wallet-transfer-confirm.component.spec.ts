import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { WalletTransferAmountModel } from '@private/features/wallet/modals/transfer/models/wallet-transfer-amount.model';
import { WalletTransferConfirmComponent } from '@private/features/wallet/modals/transfer/components/confirm/wallet-transfer-confirm.component';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('WalletTransferConfirmComponent', () => {
  let component: WalletTransferConfirmComponent;
  let fixture: ComponentFixture<WalletTransferConfirmComponent>;
  let ngbActiveModal: NgbActiveModal;
  let toastService: ToastService;
  const walletTransferConfirmSelector = '.WalletTransferConfirm';
  const walletTransferConfirmContentSelector = `${walletTransferConfirmSelector}__content`;
  const walletTransferConfirmContentAmountSelector = `${walletTransferConfirmContentSelector}__amount`;
  const walletTransferConfirmContentCancelButtonSelector = `${walletTransferConfirmContentSelector}__cancel tsl-button button`;
  const walletTransferConfirmContentConfirmButtonSelector = `${walletTransferConfirmContentSelector}__confirm tsl-button button`;
  const walletTransferConfirmContentConfirmButtonLoadingSelector = `${walletTransferConfirmContentConfirmButtonSelector}.loading`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent, SvgIconComponent, WalletTransferConfirmComponent],
      imports: [HttpClientTestingModule],
      providers: [NgbActiveModal, ToastService],
    }).compileComponents();
  });

  beforeEach(() => {
    ngbActiveModal = TestBed.inject(NgbActiveModal);
    toastService = TestBed.inject(ToastService);
    fixture = TestBed.createComponent(WalletTransferConfirmComponent);
    component = fixture.componentInstance;
    component.transferAmount = new WalletTransferAmountModel(3.14);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('WHEN the user has set a correct amount of money', () => {
    it('should show the amount of money in the range', () => {
      component.transferAmount = new WalletTransferAmountModel(13.31);
      const expectedAmountValue = `<span>You are going to transfer 13.31 € from wallet to your bank account</span>`;

      fixture.detectChanges();
      const amountValue = fixture.debugElement.query(By.css(walletTransferConfirmContentAmountSelector)).nativeElement.innerHTML;

      expect(amountValue).toEqual(expectedAmountValue);
    });

    it('should show the cancel button activated', () => {
      const cancelButton = fixture.debugElement.query(By.css(walletTransferConfirmContentCancelButtonSelector)).nativeElement;

      expect(cancelButton).toBeTruthy();
      expect((cancelButton as HTMLButtonElement).disabled).toBe(false);
    });

    it('should show the confirm button activated', () => {
      component.isTransferInProgress = false;
      fixture.detectChanges();
      const confirmButton = fixture.debugElement.query(By.css(walletTransferConfirmContentConfirmButtonSelector)).nativeElement;

      expect(confirmButton).toBeTruthy();
      expect((confirmButton as HTMLButtonElement).disabled).toBe(false);
    });

    it('should not show the spinner', () => {
      const target = fixture.debugElement.query(By.css(walletTransferConfirmContentConfirmButtonLoadingSelector));

      expect(target).toBeFalsy();
    });
  });

  describe('WHEN they click on the cancel button', () => {
    it('should go back to the transfer view', () => {
      const canceledSpy = spyOn(component.canceled, 'emit');
      const expectedTransferAmount = new WalletTransferAmountModel(99.99);
      component.transferAmount = expectedTransferAmount;

      fixture.debugElement.query(By.css(walletTransferConfirmContentCancelButtonSelector)).nativeElement.click();

      expect(canceledSpy).toHaveBeenCalledTimes(1);
      expect(canceledSpy).toHaveBeenCalledWith(jasmine.objectContaining(expectedTransferAmount));
    });
  });

  describe('WHEN they click on the confirm button', () => {
    it('should show the spinner while it transfers the money', () => {
      fixture.debugElement.query(By.css(walletTransferConfirmContentConfirmButtonSelector)).nativeElement.click();
      fixture.detectChanges();

      const target = fixture.debugElement.query(By.css(walletTransferConfirmContentConfirmButtonLoadingSelector));

      expect(target).toBeTruthy();
    });

    it('should not show the spinner when the transfer is completed', () => {});

    it('should close the modal when the transfer is completed', () => {
      spyOn(ngbActiveModal, 'close').and.callThrough();

      fixture.debugElement.query(By.css(walletTransferConfirmContentConfirmButtonSelector)).nativeElement.click();
      fixture.detectChanges();

      expect(ngbActiveModal.close).toHaveBeenCalledTimes(1);
    });

    it('should show the sent transfer message', () => {
      const expectedMessage = {
        type: 'success',
        text: $localize`:@@make_transfer_view_snackbar_money_sent_description:Money sent! Will be reflected in your account within the indicated period.`,
      };
      spyOn(toastService, 'show').and.callFake(() => {});

      fixture.debugElement.query(By.css(walletTransferConfirmContentConfirmButtonSelector)).nativeElement.click();
      fixture.detectChanges();

      expect(toastService.show).toBeCalledTimes(1);
      expect(toastService.show).toHaveBeenCalledWith(jasmine.objectContaining(expectedMessage));
    });
  });
});
