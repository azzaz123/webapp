import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdVoiceMessageComponent } from './third-voice-message.component';

describe('ThirdVoiceMessageComponent', () => {
  let component: ThirdVoiceMessageComponent;
  let fixture: ComponentFixture<ThirdVoiceMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThirdVoiceMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdVoiceMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
