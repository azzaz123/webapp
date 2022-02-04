import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdVoiceDeliveryComponent } from './third-voice-delivery.component';

describe('ThirdVoiceDeliveryComponent', () => {
  let component: ThirdVoiceDeliveryComponent;
  let fixture: ComponentFixture<ThirdVoiceDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdVoiceDeliveryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdVoiceDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
