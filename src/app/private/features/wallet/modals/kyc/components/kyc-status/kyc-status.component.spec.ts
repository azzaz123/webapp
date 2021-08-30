import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KYCStatusComponent } from './kyc-status.component';

describe('KYCStatusComponent', () => {
  let component: KYCStatusComponent;
  let fixture: ComponentFixture<KYCStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KYCStatusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
