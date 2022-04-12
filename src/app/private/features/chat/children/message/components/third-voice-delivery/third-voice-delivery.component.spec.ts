import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  MOCK_INBOX_THIRD_VOICE_DELIVERY_GENERIC_MESSAGE,
  MOCK_INBOX_THIRD_VOICE_DELIVERY_GENERIC_MESSAGE_WITHOUT_PAYLOAD,
} from '@fixtures/chat';
import { InboxMessage } from '@private/features/chat/core/model';
import { ButtonComponent } from '@shared/button/button.component';
import { ThirdVoiceMessageComponent } from '../third-voice-message';

import { ThirdVoiceDeliveryComponent } from './third-voice-delivery.component';

@Component({
  selector: 'tsl-test-wrapper',
  template: `
    <tsl-third-voice-delivery
      [message]="message"
      [shortMessage]="shortMessage"
      [loading]="loading"
      (clickedCTA)="clickedCTA()"
    ></tsl-third-voice-delivery>
  `,
})
class TestWrapperComponent {
  @Input() message: InboxMessage;
  @Input() shortMessage: boolean;
  @Input() loading: boolean;
  clickedCTA(): void {}
}

describe('ThirdVoiceDeliveryComponent', () => {
  let component: TestWrapperComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdVoiceDeliveryComponent, TestWrapperComponent, ButtonComponent, ThirdVoiceMessageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
    component.message = MOCK_INBOX_THIRD_VOICE_DELIVERY_GENERIC_MESSAGE;
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

    describe('and when it has payload', () => {
      beforeEach(() => {
        component.message = MOCK_INBOX_THIRD_VOICE_DELIVERY_GENERIC_MESSAGE;
        fixture.detectChanges();
      });

      it('should display CTA', () => {
        const thirdVoiceCTAElement: DebugElement = fixture.debugElement.query(By.directive(ButtonComponent));

        expect(thirdVoiceCTAElement).toBeTruthy();
      });

      describe('and when user clicks on CTA', () => {
        beforeEach(() => {
          spyOn(component, 'clickedCTA');
          const thirdVoiceCTAElement: DebugElement = fixture.debugElement.query(By.directive(ButtonComponent));
          thirdVoiceCTAElement.nativeElement.click();
        });

        it('should notify click', () => {
          expect(component.clickedCTA).toHaveBeenCalledTimes(1);
        });
      });

      describe('and when NOT loading', () => {
        let thirdVoiceCTAElement: DebugElement;

        beforeEach(() => {
          component.loading = true;
          fixture.detectChanges();
          thirdVoiceCTAElement = fixture.debugElement.query(By.directive(ButtonComponent));
        });

        it('should disable the button', () => {
          expect(thirdVoiceCTAElement.componentInstance.disabled).toEqual(true);
        });
      });

      describe('and when NOT loading', () => {
        let thirdVoiceCTAElement: DebugElement;

        beforeEach(() => {
          component.loading = false;
          fixture.detectChanges();
          thirdVoiceCTAElement = fixture.debugElement.query(By.directive(ButtonComponent));
        });

        it('should enable the button', () => {
          expect(thirdVoiceCTAElement.componentInstance.disabled).toEqual(false);
        });
      });
    });

    describe('and when it does not have payload', () => {
      beforeEach(() => {
        component.message = MOCK_INBOX_THIRD_VOICE_DELIVERY_GENERIC_MESSAGE_WITHOUT_PAYLOAD;
        fixture.detectChanges();
      });

      it('should hide the CTA', () => {
        const thirdVoiceCTAElement: DebugElement = fixture.debugElement.query(By.directive(ButtonComponent));

        expect(thirdVoiceCTAElement).toBeFalsy();
      });
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

      expect(thirdVoiceText).toEqual(MOCK_INBOX_THIRD_VOICE_DELIVERY_GENERIC_MESSAGE.text);
    });

    it('should NOT show third voice message with style', () => {
      const thirdVoiceElement: DebugElement = fixture.debugElement.query(By.directive(ThirdVoiceMessageComponent));

      expect(thirdVoiceElement).toBeFalsy();
    });
  });
});
