import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletSharedErrorActionComponent } from './wallet-shared-error-action.component';

describe('WalletSharedErrorActionComponent', () => {
  let component: WalletSharedErrorActionComponent;
  let fixture: ComponentFixture<WalletSharedErrorActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletSharedErrorActionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletSharedErrorActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
