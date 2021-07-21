import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KYCImageOptionsComponent } from './kyc-image-options.component';

describe('KYCImageOptionsComponent', () => {
  let component: KYCImageOptionsComponent;
  let fixture: ComponentFixture<KYCImageOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KYCImageOptionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCImageOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
