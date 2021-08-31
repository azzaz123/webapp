import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KYCStatusModalComponent } from './kyc-status-modal.component';

describe('KYCStatusModalComponent', () => {
  let component: KYCStatusModalComponent;
  let fixture: ComponentFixture<KYCStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KYCStatusModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
