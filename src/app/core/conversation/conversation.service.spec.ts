import { inject, TestBed } from '@angular/core/testing';
import {
  Conversation,
  EventService,
  HttpService,
  ItemService,
  MessageService,
  MOCK_ITEM,
  MOCK_MESSAGE,
  MOCK_USER,
  NEW_CONVERSATION_RESPONSE,
  NewConversationResponse,
  NotificationService,
  PersistencyService,
  SECOND_MOCK_CONVERSATION,
  TEST_HTTP_PROVIDERS,
  TrackingService,
  MockTrackingService,
  UserService,
  XmppService,
  USER_DATA
} from 'shield';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Response, ResponseOptions } from '@angular/http';
import { ConversationService } from './conversation.service';
import { Observable } from 'rxjs/Observable';

fdescribe('ConversationService', () => {
  let mockBackend: MockBackend;
  let http: HttpService;
  let service: ConversationService;
  let itemService: ItemService;
  let userService: UserService;
  let messageService: MessageService;
  let trackingService: TrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: UserService, useValue: {
          me: () => {
            return Observable.of(MOCK_USER);
          },
          get: () => {
          }
        }
        },
        {
          provide: ItemService, useValue: {
          get: () => {
          }
        }
        },
        {provide: EventService, useValue: {}},
        {provide: XmppService, useValue: {}},
        {provide: PersistencyService, useValue: {}},
        {
          provide: MessageService, useValue: {
          getMessages: () => {
          }
        }
        },
        {provide: TrackingService, useClass: MockTrackingService
        },
        {provide: NotificationService, usevalue: {}},
        ...TEST_HTTP_PROVIDERS,
        ConversationService,
        MockBackend
      ]
    });
    mockBackend = TestBed.get(MockBackend);
    http = TestBed.get(HttpService);
    service = TestBed.get(ConversationService);
    userService = TestBed.get(UserService);
    itemService = TestBed.get(ItemService);
    messageService = TestBed.get(MessageService);
    trackingService = TestBed.get(TrackingService);
  });

  it('should be created', inject([ConversationService], (service: ConversationService) => {
    expect(service).toBeTruthy();
  }));
  describe('getByItemId', () => {
    beforeEach(() => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(NEW_CONVERSATION_RESPONSE)})));
      });
    });
    it('should return the NewConversationResponse of the given itemId', () => {
      let conversation: NewConversationResponse;
      service.getByItemId('random').subscribe((convResponse: NewConversationResponse) => {
        conversation = convResponse;
      });
      expect(conversation).toEqual(NEW_CONVERSATION_RESPONSE);
    });
  });
  describe('createConversation', () => {
    it('should get the user & item info and return a new conversation', () => {
      let conversation: Conversation;
      spyOn(userService, 'get').and.returnValue(Observable.of(MOCK_USER));
      spyOn(itemService, 'get').and.returnValue(Observable.of(MOCK_ITEM));
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(NEW_CONVERSATION_RESPONSE)})));
      });
      service.createConversation('id').subscribe((convResponse: Conversation) => {
        conversation = convResponse;
      });
      expect(conversation instanceof Conversation).toBeTruthy();
      expect(conversation.id).toBe(NEW_CONVERSATION_RESPONSE.conversation_id);
      expect(conversation.modifiedDate).toBe(NEW_CONVERSATION_RESPONSE.modified_date);
      expect(conversation.user).toEqual(MOCK_USER);
      expect(conversation.item).toEqual(MOCK_ITEM);
    });
    it('should send the tracking event new_conversation', () => {
      let conversation: Conversation;
      spyOn(userService, 'get').and.returnValue(Observable.of(MOCK_USER));
      spyOn(itemService, 'get').and.returnValue(Observable.of(MOCK_ITEM));
      spyOn(trackingService, 'track');
      mockBackend.connections.subscribe((connection: MockConnection) => {
        let res: ResponseOptions = new ResponseOptions({body: JSON.stringify(USER_DATA)});
        connection.mockRespond(new Response(res));
      });

      service.createConversation(MOCK_ITEM.id).subscribe((convResponse: Conversation) => {
        conversation = convResponse;
      });

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CONVERSATION_CREATE_NEW,
        { user_id: MOCK_USER.id, item_id: MOCK_ITEM.id, thread_id: conversation.id });
    });
  });
  describe('getSingleConversationMessages', () => {
    beforeEach(() => {
      spyOn(messageService, 'getMessages').and.returnValue(Observable.of({
        data: [MOCK_MESSAGE],
        meta: {},
      }))
    });
    it('should call the messageService.getMessages passing the given conversation', () => {
      service.getSingleConversationMessages(SECOND_MOCK_CONVERSATION);
      expect(messageService.getMessages).toHaveBeenCalledWith(SECOND_MOCK_CONVERSATION);
    });
    it('should return the conversation with the retrieved messages', () => {
      service.getSingleConversationMessages(SECOND_MOCK_CONVERSATION)
      .subscribe((conversationWithMessages: Conversation) => {
        expect(conversationWithMessages.messages.length).toBe(1);
        expect(conversationWithMessages.messages[0]).toEqual(MOCK_MESSAGE);
        expect(conversationWithMessages.id).toBe(SECOND_MOCK_CONVERSATION.id);
      });
    });
  });
});
