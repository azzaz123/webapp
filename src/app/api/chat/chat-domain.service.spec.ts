import { TestBed } from '@angular/core/testing';

import { ChatDomainService } from './chat-domain.service';
import { ChatDomainServiceModule } from '@api/chat/chat-domain-service.module';
import { ChatHttpService } from '@api/chat/http/chat-http.service';
import { inboxMessageFixture } from '@api/fixtures/chat/inbox-message.fixtures.spec';
import { MessageTranslation } from '@api/core/model/chat';
import { messageTranslationFixture, translateMessagesResponseFixture } from '@api/fixtures/chat';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChatApiService', () => {
  let service: ChatDomainService;
  let httpService: ChatHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChatDomainServiceModule, HttpClientTestingModule],
    });
    service = TestBed.inject(ChatDomainService);
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
