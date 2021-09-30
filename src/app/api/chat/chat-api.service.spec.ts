import { TestBed } from '@angular/core/testing';

import { ChatApiService } from './chat-api.service';
import { ChatApiModule } from '@api/chat/chat-api.module';
import { ChatHttpService } from '@api/chat/http/chat-http.service';
import { inboxMessageFixture } from '@api/fixtures/chat/inbox-message.fixtures.spec';
import { MessageTranslation } from '@api/core/model/chat';
import { messageTranslationFixture, translateMessagesResponseFixture } from '@api/fixtures/chat';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChatApiService', () => {
  let service: ChatApiService;
  let httpService: ChatHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChatApiModule, HttpClientTestingModule],
    });
    service = TestBed.inject(ChatApiService);
    httpService = TestBed.inject(ChatHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked to translate messages', () => {
    it('should translate messages', () => {
      spyOn(httpService, 'translateMessages').and.returnValue(of(translateMessagesResponseFixture));
      let messageTranslations: MessageTranslation[];

      service
        .translateMessages('conversationId', [inboxMessageFixture])
        .subscribe((translations: MessageTranslation[]) => (messageTranslations = translations));

      expect(messageTranslations).toEqual([messageTranslationFixture]);
    });
  });
});
