import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdVoiceDropPriceComponent } from './third-voice-drop-price.component';

describe('ThirdVoiceDropPriceComponent', () => {
  let component: ThirdVoiceDropPriceComponent;
  let fixture: ComponentFixture<ThirdVoiceDropPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThirdVoiceDropPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdVoiceDropPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
