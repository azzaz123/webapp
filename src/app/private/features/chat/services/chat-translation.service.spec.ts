import { TestBed } from '@angular/core/testing';
import { ChatTranslationService } from './chat-translation.service';
import { ChatApiModule } from '@api/chat/chat-api.module';
import { ChatApiService } from '@api/chat/chat-api.service';
import {
  MOCK_INBOX_TRANSLATABLE_CONVERSATION,
  MOCK_INBOX_TRANSLATABLE_CONVERSATION_ALREADY_TRANSLATED,
} from '@fixtures/inbox.fixtures.spec';
import { of } from 'rxjs';
import { InboxConversation, InboxMessage } from '@private/features/chat/core/model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChatTranslationService', () => {
  let service: ChatTranslationService;
  let apiService: ChatApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatTranslationService],
      imports: [ChatApiModule, HttpClientTestingModule],
    });
    service = TestBed.inject(ChatTranslationService);
    apiService = TestBed.inject(ChatApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked to translate conversation', () => {
    describe('and conversation has no translatable messages', () => {
      it('should not use api service', () => {
        spyOn(apiService, 'translateMessages').and.returnValue(of([]));
        service.translateConversation(MOCK_INBOX_TRANSLATABLE_CONVERSATION_ALREADY_TRANSLATED).subscribe();

        expect(apiService);
      });
    });

    describe('and conversation has translatable messages', () => {
      it('should ask for translation to api service', () => {
        const translatableMessages = getTranslatableMessages(MOCK_INBOX_TRANSLATABLE_CONVERSATION);
        spyOn(apiService, 'translateMessages').and.returnValue(of([]));
        service.translateConversation(MOCK_INBOX_TRANSLATABLE_CONVERSATION).subscribe();

        expect(apiService.translateMessages).toHaveBeenCalledTimes(1);
        expect(apiService.translateMessages).toHaveBeenCalledWith(MOCK_INBOX_TRANSLATABLE_CONVERSATION.id, translatableMessages);
      });
    });
  });

  function getTranslatableMessages(conversation: InboxConversation): InboxMessage[] {
    return conversation.messages.filter((message) => !message.fromSelf).filter((message) => !message.translation);
  }
});
