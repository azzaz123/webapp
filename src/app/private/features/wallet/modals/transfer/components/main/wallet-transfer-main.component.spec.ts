import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { WalletTransferAmountComponent } from '@private/features/wallet/modals/transfer/components/amount/wallet-transfer-amount.component';
import { WalletTransferMainComponent } from '@private/features/wallet/modals/transfer/components/main/wallet-transfer-main.component';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('GIVEN the WalletTransferMainComponent', () => {
  let component: WalletTransferMainComponent;
  let fixture: ComponentFixture<WalletTransferMainComponent>;
  let ngbActiveModal: NgbActiveModal;
  let toastService: ToastService;

  const walletTransferModalSelector = '.WalletTransferModal';
  const walletTransferModalCloseSelector = `${walletTransferModalSelector}__close`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgIconComponent, WalletTransferAmountComponent, WalletTransferMainComponent],
      imports: [HttpClientTestingModule],
      providers: [NgbActiveModal, ToastService],
    }).compileComponents();
  });

  beforeEach(() => {
    ngbActiveModal = TestBed.inject(NgbActiveModal);
    toastService = TestBed.inject(ToastService);
    fixture = TestBed.createComponent(WalletTransferMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('WHEN displaying the view', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should show the free comissions message', () => {
      spyOn(toastService, 'show').and.callFake(() => {});

      component.ngOnInit();

      expect(toastService.show).toBeCalledTimes(1);
      expect(toastService.show).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: 'success',
          text: $localize`:@@make_transfer_view_snackbar_no_commissions_description:Transfers are free, forget about fees.`,
        })
      );
    });

    describe('WHEN they click on the cross button', () => {
      it('should close the modal', () => {
        const closeModalSpy = spyOn(ngbActiveModal, 'close');

        fixture.debugElement.query(By.css(walletTransferModalCloseSelector)).nativeElement.click();

        expect(closeModalSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
