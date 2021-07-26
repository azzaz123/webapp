import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KYCUploadImagesComponent } from './kyc-upload-images.component';

describe('KYCUploadImagesComponent', () => {
  let component: KYCUploadImagesComponent;
  let fixture: ComponentFixture<KYCUploadImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KYCUploadImagesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCUploadImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
