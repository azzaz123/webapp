import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdVoiceReviewComponent } from './third-voice-review.component';
import { ThirdVoiceMessageComponent } from '../third-voice-message';
import { MatIconModule } from '@angular/material';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../../tests/inbox.fixtures.spec';
import { InboxMessage, MessageType } from '../../model';

describe('ThirdVoiceReviewComponent', () => {
  let component: ThirdVoiceReviewComponent;
  let fixture: ComponentFixture<ThirdVoiceReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, MatIconModule, CommonModule],
      declarations: [
        ThirdVoiceReviewComponent,
        ThirdVoiceMessageComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdVoiceReviewComponent);
    component = fixture.componentInstance;
    component.message = component.message = CREATE_MOCK_INBOX_CONVERSATION().messages[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isReview', () => {

    it('should return false if message type is not review', () => {
      component.message = new InboxMessage('message-id', 'conversation-id', 'text', 'user-id', true,
        new Date(), 'SEND', MessageType.TEXT);
      expect(component.isReview()).toBeFalsy();

      component.message = new InboxMessage('message-id', 'conversation-id', 'text', 'user-id', true,
        new Date(), 'SEND', MessageType.PRICE_DROP);
      expect(component.isReview()).toBeFalsy();

      component.message = new InboxMessage('message-id', 'conversation-id', 'text', 'user-id', true,
        new Date(), 'SEND', MessageType.DROP_PRICE);
      expect(component.isReview()).toBeFalsy();
    });

    it('should return false if message type is review', () => {
      component.message = new InboxMessage('message-id', 'conversation-id', 'text', 'user-id', true,
        new Date(), 'SEND', MessageType.REVIEW);
      expect(component.isReview()).toBeTruthy();
    });
  });
});
