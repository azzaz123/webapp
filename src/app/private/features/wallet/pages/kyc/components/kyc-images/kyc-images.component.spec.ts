import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycImagesComponent } from './kyc-images.component';

describe('KycImagesComponent', () => {
  let component: KycImagesComponent;
  let fixture: ComponentFixture<KycImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KycImagesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
