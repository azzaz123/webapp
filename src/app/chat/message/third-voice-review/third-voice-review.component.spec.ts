import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdVoiceReviewComponent } from './third-voice-review.component';

describe('ThirdVoiceReviewComponent', () => {
  let component: ThirdVoiceReviewComponent;
  let fixture: ComponentFixture<ThirdVoiceReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThirdVoiceReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdVoiceReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
