import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { WalletTransferMainComponent } from '@private/features/wallet/modals/transfer/components/main/wallet-transfer-main.component';

describe('GIVEN the WalletTransferMainComponent', () => {
  let component: WalletTransferMainComponent;
  let fixture: ComponentFixture<WalletTransferMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletTransferMainComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletTransferMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('WHEN displaying the view', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
    });
  });
});
