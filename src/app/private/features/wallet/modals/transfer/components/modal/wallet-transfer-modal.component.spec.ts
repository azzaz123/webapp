import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { WalletTransferModalComponent } from '@private/features/wallet/modals/transfer/components/modal/wallet-transfer-modal.component';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GIVEN the WalletTransferModalComponent', () => {
  let component: WalletTransferModalComponent;
  let fixture: ComponentFixture<WalletTransferModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgIconComponent, WalletTransferModalComponent],
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
  });
});
