import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { I18nService } from '@core/i18n/i18n.service';
import { InboxConversationService } from '@private/features/chat/core/inbox/inbox-conversation.service';
import { InboxConversation, InboxItemStatus } from '@private/features/chat/core/model';
import {
  InboxConversationServiceMock,
  CREATE_MOCK_INBOX_CONVERSATION,
  MOCK_INBOX_CONVERSATION_WITH_DELIVERY_THIRD_VOICES,
  MOCK_INBOX_THIRD_VOICE_DELIVERY_GENERIC_MESSAGE,
  MOCK_INBOX_THIRD_VOICE_DELIVERY_MESSAGE,
  MOCK_INBOX_THIRD_VOICE_SHIPPING_KEYWORDS,
} from '@fixtures/chat';
import { DateCalendarPipe } from 'app/shared/pipes';
import { NgxPermissionsModule } from 'ngx-permissions';
import { of } from 'rxjs';
import { InboxConversationComponent } from './inbox-conversation.component';
import { MomentCalendarSpecService } from '@core/i18n/moment/moment-calendar-spec.service';
import { ThirdVoiceDeliveryComponent } from '../../../message/components/third-voice-delivery/third-voice-delivery.component';
import { By } from '@angular/platform-browser';
import { ThirdVoiceShippingKeywordsComponent } from '../../../message';

describe('Component: Conversation', () => {
  let inboxConversationService: InboxConversationService;
  let component: InboxConversationComponent;
  let fixture: ComponentFixture<InboxConversationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, NgxPermissionsModule.forRoot()],
        declarations: [InboxConversationComponent, DateCalendarPipe, ThirdVoiceDeliveryComponent, ThirdVoiceShippingKeywordsComponent],
        providers: [
          I18nService,
          MomentCalendarSpecService,
          {
            provide: InboxConversationService,
            useClass: InboxConversationServiceMock,
          },
          DateCalendarPipe,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxConversationComponent);
    component = fixture.componentInstance;
    component.conversation = CREATE_MOCK_INBOX_CONVERSATION();
    inboxConversationService = TestBed.inject(InboxConversationService);
    fixture.detectChanges();
  });

  describe('describe dateIsThisYear', () => {
    it('should return TRUE when conversaiton.modifiedDate is in the current calendar year', () => {
      component.conversation.modifiedDate = new Date(Date.now());

      const expectedResult = component.dateIsThisYear();

      expect(expectedResult).toBe(true);
    });

    it('should return FALSE when conversaiton does not have a modifiedDate', () => {
      component.conversation.modifiedDate = null;

      const expectedResult = component.dateIsThisYear();

      expect(expectedResult).toBe(false);
    });

    it('should return FALSE when conversaiton.modifiedDate is not in the current calendar year', () => {
      component.conversation.modifiedDate = new Date('1 Jan 1999');

      const expectedResult = component.dateIsThisYear();

      expect(expectedResult).toBe(false);
    });
  });

  describe('cannotChat', () => {
    it('should set conversation.cannotChat to TRUE when the conversation user is not available', () => {
      component.conversation.user.available = false;

      expect(component.conversation.cannotChat).toBe(true);
    });

    it('should set conversation.cannotChat to TRUE when the conversation user is blocked', () => {
      component.conversation.user.blocked = true;

      expect(component.conversation.cannotChat).toBe(true);
    });

    it('should set conversation.cannotChat to TRUE when the conversation item is not available', () => {
      component.conversation.item.status = InboxItemStatus.NOT_AVAILABLE;

      expect(component.conversation.cannotChat).toBe(true);
    });

    it('should set conversation.cannotChat to TRUE when phone is requested', () => {
      component.conversation.phoneRequired = true;

      expect(component.conversation.cannotChat).toBe(true);
    });

    it('should set conversation.cannotChat to FALSE when none of the above conditions are met', () => {
      component.conversation.item.status = InboxItemStatus.PUBLISHED;
      component.conversation.user.blocked = false;
      component.conversation.user.available = true;

      expect(component.conversation.cannotChat).toBe(false);
    });
  });

  describe('archiveConversation', () => {
    let inboxConversation: InboxConversation;

    beforeEach(() => {
      inboxConversation = CREATE_MOCK_INBOX_CONVERSATION();
    });

    it('should archive$ conversation and set conversation to NULL', () => {
      spyOn(inboxConversationService, 'archive$').and.returnValue(of(inboxConversation));
      component.conversation = inboxConversation;

      component.onClickArchiveConversation();

      expect(inboxConversationService.archive$).toHaveBeenCalledWith(inboxConversation);
      expect(component.conversation).toEqual(null);
    });
  });

  describe('when the last message is a third voice', () => {
    describe('and when it is a delivery generic third voice type', () => {
      beforeEach(() => {
        MOCK_INBOX_CONVERSATION_WITH_DELIVERY_THIRD_VOICES.lastMessage = MOCK_INBOX_THIRD_VOICE_DELIVERY_GENERIC_MESSAGE;
        component.conversation = MOCK_INBOX_CONVERSATION_WITH_DELIVERY_THIRD_VOICES;
        fixture.detectChanges();
      });

      it('should display the third voice', () => {
        const deliveryThirdVoice: DebugElement = fixture.debugElement.query(By.directive(ThirdVoiceDeliveryComponent));

        expect(deliveryThirdVoice).toBeTruthy();
      });
    });

    describe('and when it is a delivery realtime third voice type', () => {
      beforeEach(() => {
        MOCK_INBOX_CONVERSATION_WITH_DELIVERY_THIRD_VOICES.lastMessage = MOCK_INBOX_THIRD_VOICE_DELIVERY_MESSAGE;
        component.conversation = MOCK_INBOX_CONVERSATION_WITH_DELIVERY_THIRD_VOICES;
        fixture.detectChanges();
      });

      it('should display the third voice', () => {
        const deliveryThirdVoice: DebugElement = fixture.debugElement.query(By.directive(ThirdVoiceDeliveryComponent));

        expect(deliveryThirdVoice).toBeTruthy();
      });
    });

    describe('and when it is a shipping keyword third voice type', () => {
      beforeEach(() => {
        MOCK_INBOX_CONVERSATION_WITH_DELIVERY_THIRD_VOICES.lastMessage = MOCK_INBOX_THIRD_VOICE_SHIPPING_KEYWORDS;
        component.conversation = MOCK_INBOX_CONVERSATION_WITH_DELIVERY_THIRD_VOICES;
        fixture.detectChanges();
      });

      it('should display the third voice', () => {
        const shippingKeywordsThirdVoice: DebugElement = fixture.debugElement.query(By.directive(ThirdVoiceShippingKeywordsComponent));

        expect(shippingKeywordsThirdVoice).toBeTruthy();
      });
    });
  });
});
