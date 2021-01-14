import { getTestBed, inject, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';

describe('Service: UnreadChatMessages', () => {
  let injector: TestBed;
  let service: UnreadChatMessagesService;
  let titleService: Title;

  beforeEach(() => {
    injector = getTestBed();
    injector.configureTestingModule({
      providers: [UnreadChatMessagesService],
    });
    service = injector.inject(UnreadChatMessagesService);
    titleService = injector.inject(Title);
  });

  it('should instanciate', () => {
    expect(service).toBeTruthy();
  });

  describe('when starting the service', () => {
    beforeEach(() => {
      spyOn(titleService, 'setTitle');
    });

    describe('and when browser title is not showing that there are unread messages', () => {
      beforeEach(() => {
        spyOn(titleService, 'getTitle').and.returnValue('Chat');
      });

      describe('and there are new unread messages', () => {
        it('should update the title with unread messages', () => {
          service.totalUnreadMessages$.next(100);

          expect(titleService.setTitle).toHaveBeenCalledWith('(100) Chat');
        });
      });

      it('should update the title just with the title when unread messages are 0', () => {
        service.totalUnreadMessages$.next(0);

        expect(titleService.setTitle).toHaveBeenCalledWith('Chat');
      });
    });

    describe('and when there are messages', () => {
      beforeEach(() => {
        spyOn(titleService, 'getTitle').and.returnValue('(10) Chat');
      });

      it('should update the title with unread messages when > 0', () => {
        service.totalUnreadMessages$.next(100);

        expect(titleService.setTitle).toHaveBeenCalledWith('(100) Chat');
      });

      it('should update the title just with the title when unread messages are 0', () => {
        service.totalUnreadMessages$.next(0);

        expect(titleService.setTitle).toHaveBeenCalledWith('Chat');
      });
    });
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
