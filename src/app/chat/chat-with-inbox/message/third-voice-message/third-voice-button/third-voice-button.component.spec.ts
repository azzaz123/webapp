import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdVoiceButtonComponent } from './third-voice-button.component';

describe('ThirdVoiceButtonComponent', () => {
  let component: ThirdVoiceButtonComponent;
  let fixture: ComponentFixture<ThirdVoiceButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThirdVoiceButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdVoiceButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
