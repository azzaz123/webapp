import { TestBed } from '@angular/core/testing';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';

describe('Service: UnreadChatMessages', () => {
  let service: UnreadChatMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnreadChatMessagesService],
    });
    service = TestBed.inject(UnreadChatMessagesService);
  });

  it('should instanciate', () => {
    expect(service).toBeTruthy();
  });

  describe('when there are new unread chat messages', () => {
    it('should notify changes', () => {
      let changedValue: number;
      const TOTAL_UNREAD_MESSAGES = 100;

      service.totalUnreadMessages$.subscribe((totalUnreadMessages) => {
        changedValue = totalUnreadMessages;
      });
      service.totalUnreadMessages = TOTAL_UNREAD_MESSAGES;

      expect(changedValue).toBe(TOTAL_UNREAD_MESSAGES);
    });
  });
});
