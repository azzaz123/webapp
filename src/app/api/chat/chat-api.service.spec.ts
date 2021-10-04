import { TestBed } from '@angular/core/testing';

import { ChatApiService } from './chat-api.service';
import { ChatApiModule } from '@api/chat/chat-api.module';
import { ChatHttpService } from '@api/chat/http/chat-http.service';
import { MessageTranslation } from '@api/core/model/chat';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MOCK_MESSAGE_TRANSLATION, MOCK_INBOX_MESSAGE } from '@fixtures/chat';
import { translateMessagesResponseFixture } from '@api/fixtures/chat';

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
    describe('and message array has content', () => {
      it('should translate messages', () => {
        spyOn(httpService, 'translateMessages').and.returnValue(of(translateMessagesResponseFixture));
        let messageTranslations: MessageTranslation[];

        service
          .translateMessages('conversationId', [MOCK_INBOX_MESSAGE])
          .subscribe((translations: MessageTranslation[]) => (messageTranslations = translations));

        expect(messageTranslations).toEqual([MOCK_MESSAGE_TRANSLATION]);
      });
    });

    describe('and message array is empty', () => {
      it('should return empty array of translated messages', () => {
        spyOn(httpService, 'translateMessages');
        let messageTranslations: MessageTranslation[];

        service
          .translateMessages('conversationId', [])
          .subscribe((translations: MessageTranslation[]) => (messageTranslations = translations));

        expect(messageTranslations).toEqual([]);
        expect(httpService.translateMessages).not.toHaveBeenCalled();
      });
    });
  });
});
