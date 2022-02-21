import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_INBOX_THIRD_VOICE_SHIPPING_KEYWORDS } from '@fixtures/chat';
import { InboxMessage } from '@private/features/chat/core/model';
import { ThirdVoiceMessageComponent } from '../third-voice-message';

import { ThirdVoiceShippingKeywordsComponent } from './third-voice-shipping-keywords.component';

@Component({
  selector: 'tsl-test-wrapper',
  template: ` <tsl-third-voice-shipping-keywords [message]="message" [shortMessage]="shortMessage"></tsl-third-voice-shipping-keywords> `,
})
class TestWrapperComponent {
  @Input() message: InboxMessage;
  @Input() shortMessage: boolean;
}

describe('ThirdVoiceShippingKeywordsComponent', () => {
  let component: ThirdVoiceShippingKeywordsComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestWrapperComponent, ThirdVoiceShippingKeywordsComponent, ThirdVoiceMessageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
    component.message = MOCK_INBOX_THIRD_VOICE_SHIPPING_KEYWORDS;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when it is opened as a large message', () => {
    beforeEach(() => {
      component.shortMessage = false;
    });

    it('should show third voice message', () => {
      const thirdVoiceElement: DebugElement = fixture.debugElement.query(By.directive(ThirdVoiceMessageComponent));

      expect(thirdVoiceElement).toBeTruthy();
    });
  });

  describe('when it is opened as a short message', () => {
    beforeEach(() => {
      component.shortMessage = true;
      fixture.detectChanges();
    });

    it('should show third voice message', () => {
      const thirdVoiceTextElement: DebugElement = fixture.debugElement.query(By.css('span'));
      const thirdVoiceText: string = thirdVoiceTextElement.nativeElement.innerHTML;

      expect(thirdVoiceText).toEqual(MOCK_INBOX_THIRD_VOICE_SHIPPING_KEYWORDS.text);
    });

    it('should NOT show third voice message with style', () => {
      const thirdVoiceElement: DebugElement = fixture.debugElement.query(By.directive(ThirdVoiceMessageComponent));

      expect(thirdVoiceElement).toBeFalsy();
    });
  });
});
