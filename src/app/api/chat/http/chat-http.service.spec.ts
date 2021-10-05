import { TestBed } from '@angular/core/testing';

import { ChatHttpService } from './chat-http.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TranslateMessagesResponse } from '@api/chat/dtos';
import { TRANSLATE_MESSAGES_ENDPOINT } from '@api/chat/http/endpoints';
import { translateMessagesResponseFixture } from '@api/fixtures/chat';

describe('ChatHttpService', () => {
  let service: ChatHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ChatHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked to retrieve message translations', () => {
    it('should retrieve message translations', () => {
      let response: TranslateMessagesResponse;

      service
        .translateMessages('conversationId', 'firstId', 0, 'lastId', 0)
        .subscribe((res: TranslateMessagesResponse) => (response = res));

      const req: TestRequest = httpMock.expectOne(TRANSLATE_MESSAGES_ENDPOINT);
      req.flush(translateMessagesResponseFixture);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        conversation_id: 'conversationId',
        first_message_id: 'firstId',
        first_message_timestamp: 0,
        last_message_id: 'lastId',
        last_message_timestamp: 0,
      });
      expect(response).toEqual(translateMessagesResponseFixture);
    });
  });
});
