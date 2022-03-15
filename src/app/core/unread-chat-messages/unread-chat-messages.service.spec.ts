import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { UnreadChatMessagesService, UNREAD_MESSAGES_COUNT_ENDPOINT } from './unread-chat-messages.service';
import { environment } from '@environments/environment';

describe('Service: UnreadChatMessages', () => {
  let injector: TestBed;
  let service: UnreadChatMessagesService;
  let titleService: Title;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    injector = getTestBed();
    injector.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UnreadChatMessagesService],
    });
    service = injector.inject(UnreadChatMessagesService);
    titleService = injector.inject(Title);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should instanciate', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve the counter of unread messages', () => {
    service.initializeUnreadChatMessages();
    const req = httpMock.expectOne(`${environment.baseUrl}${UNREAD_MESSAGES_COUNT_ENDPOINT}`);
    req.flush({ unread_counter: 2 });

    expect(req.request.method).toBe('GET');
    expect(service.totalUnreadMessages).toBe(2);
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
