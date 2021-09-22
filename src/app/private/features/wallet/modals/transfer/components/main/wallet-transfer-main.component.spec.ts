import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { WalletTransferAmountComponent } from '@private/features/wallet/modals/transfer/components/amount/wallet-transfer-amount.component';
import { WalletTransferMainComponent } from '@private/features/wallet/modals/transfer/components/main/wallet-transfer-main.component';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('GIVEN the WalletTransferMainComponent', () => {
  let component: WalletTransferMainComponent;
  let fixture: ComponentFixture<WalletTransferMainComponent>;
  let ngbActiveModal: NgbActiveModal;
  const walletTransferModalSelector = '.WalletTransferModal';
  const walletTransferModalCloseSelector = `${walletTransferModalSelector}__close`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgIconComponent, WalletTransferAmountComponent, WalletTransferMainComponent],
      imports: [HttpClientTestingModule],
      providers: [NgbActiveModal],
    }).compileComponents();
  });

  beforeEach(() => {
    ngbActiveModal = TestBed.inject(NgbActiveModal);
    fixture = TestBed.createComponent(WalletTransferMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('WHEN displaying the view', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
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
