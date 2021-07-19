import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KYCImagesComponent } from './kyc-images.component';

describe('KYCImagesComponent', () => {
  let component: KYCImagesComponent;
  let fixture: ComponentFixture<KYCImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KYCImagesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
