import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { WalletTransferModalComponent } from '@private/features/wallet/modals/transfer/components/modal/wallet-transfer-modal.component';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('GIVEN the WalletTransferModalComponent', () => {
  const walletTransferModalSelector = '.WalletTransferModal';
  const spinnerSelector = `${walletTransferModalSelector}__spinner`;
  const balanceSelector = `${walletTransferModalSelector}__amount`;
  const errorSelector = `${walletTransferModalSelector}__error`;

  let component: WalletTransferModalComponent;
  let fixture: ComponentFixture<WalletTransferModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletTransferModalComponent],
      imports: [ButtonModule, CommonModule, HttpClientTestingModule, SvgIconModule],
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

    it('should show the spinner', () => {
      component.ngOnInit();

      const target = fixture.debugElement.query(By.css(spinnerSelector));
      expect(target).toBeTruthy();
    });
  });
});
