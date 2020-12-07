import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ThirdVoiceMessageComponent } from './third-voice-message.component';
import { LinkTransformPipe } from '../../../shared/pipes/link-transform';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../../tests/inbox.fixtures.spec';
import { ThirdVoiceReviewButtonComponent } from '../third-voice-review-button';
import { MessageType } from '../../model/inbox-message';

describe('ThirdVoiceMessageComponent', () => {
  let component: ThirdVoiceMessageComponent;
  let fixture: ComponentFixture<ThirdVoiceMessageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ThirdVoiceMessageComponent,
          ThirdVoiceReviewButtonComponent,
          LinkTransformPipe,
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdVoiceMessageComponent);
    component = fixture.componentInstance;
    component.message = CREATE_MOCK_INBOX_CONVERSATION().messages[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return false if message id review', () => {
    component.message.type = null;
    expect(component.isReview()).toBe(false);

    component.message.type = MessageType.TEXT;
    expect(component.isReview()).toBe(false);

    component.message.type = MessageType.PRICE_DROP;
    expect(component.isReview()).toBe(false);
  });

  it('should return true if message id review', () => {
    component.message.type = MessageType.REVIEW;
    expect(component.isReview()).toBe(true);
  });
});
