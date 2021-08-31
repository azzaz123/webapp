import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { WalletSharedErrorActionComponent } from '@private/features/wallet/shared/error-action';

import { BankDetailsComponent } from './bank-details.component';

describe('BankDetailsComponent', () => {
  let component: BankDetailsComponent;
  let fixture: ComponentFixture<BankDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [BankDetailsComponent, WalletSharedErrorActionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
