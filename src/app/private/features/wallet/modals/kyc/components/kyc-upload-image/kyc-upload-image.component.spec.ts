import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KYCUploadImageComponent } from './kyc-upload-image.component';

describe('KYCUploadImageComponent', () => {
  let component: KYCUploadImageComponent;
  let fixture: ComponentFixture<KYCUploadImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KYCUploadImageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCUploadImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
