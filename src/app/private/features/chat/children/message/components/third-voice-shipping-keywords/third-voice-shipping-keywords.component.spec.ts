import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdVoiceShippingKeywordsComponent } from './third-voice-shipping-keywords.component';

describe('ThirdVoiceShippingKeywordsComponent', () => {
  let component: ThirdVoiceShippingKeywordsComponent;
  let fixture: ComponentFixture<ThirdVoiceShippingKeywordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdVoiceShippingKeywordsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdVoiceShippingKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
