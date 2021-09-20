import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { WalletTransferAmountComponent } from '@private/features/wallet/modals/transfer/components/amount/wallet-transfer-amount.component';
import { WalletTransferModalComponent } from '@private/features/wallet/modals/transfer/components/modal/wallet-transfer-modal.component';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('GIVEN the WalletTransferModalComponent', () => {
  let component: WalletTransferModalComponent;
  let fixture: ComponentFixture<WalletTransferModalComponent>;
  const walletTransferModalSelector = '.WalletTransferModal';
  const walletTransferModalCloseSelector = `${walletTransferModalSelector}__close`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgIconComponent, WalletTransferAmountComponent, WalletTransferModalComponent],
      imports: [HttpClientTestingModule],
      providers: [NgbActiveModal],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletTransferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('WHEN displaying the view', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    describe('WHEN they click on the cross button', () => {
      it('should close the modal', () => {
        const closeModalSpy = spyOn(component.activeModal, 'close');

        fixture.debugElement.query(By.css(walletTransferModalCloseSelector)).nativeElement.click();

        expect(closeModalSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
