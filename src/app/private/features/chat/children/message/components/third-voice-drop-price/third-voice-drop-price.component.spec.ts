import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CREATE_MOCK_INBOX_CONVERSATION } from '@fixtures/chat';
import { ThirdVoiceMessageComponent } from '../third-voice-message';
import { ThirdVoiceReviewButtonComponent } from '../third-voice-review-button';
import { ThirdVoiceDropPriceComponent } from './third-voice-drop-price.component';

describe('ThirdVoiceDropPriceComponent', () => {
  let component: ThirdVoiceDropPriceComponent;
  let fixture: ComponentFixture<ThirdVoiceDropPriceComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule],
        declarations: [ThirdVoiceDropPriceComponent, ThirdVoiceMessageComponent, ThirdVoiceReviewButtonComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdVoiceDropPriceComponent);
    component = fixture.componentInstance;
    component.message = component.message = CREATE_MOCK_INBOX_CONVERSATION().messages[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
