/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { ConversationService } from './conversation.service';
import { HttpService } from '../http/http.service';
import { Conversation } from './conversation';
import { UserService } from '../user/user.service';
import { ItemService } from '../item/item.service';
import { XmppService } from '../xmpp/xmpp.service';
import { MessageService } from '../message/message.service';
import { PersistencyService } from '../persistency/persistency.service';
import { messageStatus } from '../message/message';
import { EventService } from '../event/event.service';
import { NotificationService } from '../notification/notification.service';
import { TrackingService } from '../tracking/tracking.service';
import { CONVERSATION_ID, createConversationsArray, MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';
import { MockedUserService, USER_ID } from '../../../tests/user.fixtures.spec';
import { MockedItemService } from '../../../tests/item.fixtures.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { MockedPersistencyService } from '../../../tests/persistency.fixtures.spec';
import { createMessagesArray, MOCK_MESSAGE, MOCK_RANDOM_MESSAGE } from '../../../tests/message.fixtures.spec';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { ConnectionService } from '../connection/connection.service';
import { MsgArchiveService } from '../message/archive.service';
import { I18nService } from '../i18n/i18n.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendPhoneComponent } from '../../chat/modals/send-phone/send-phone.component';
import { RealTimeService } from '../message/real-time.service';
import { BlockUserXmppService } from './block-user';
import { ChatSignal, chatSignalType } from '../message/chat-signal.interface';
import { RemoteConsoleService } from '../remote-console';
import { InboxConversationServiceMock, InboxServiceMock, MockRemoteConsoleService } from '../../../tests';
import { InboxService } from '../inbox/inbox.service';
import { InboxConversationService } from '../inbox/inbox-conversation.service';

let service: ConversationService;
let http: HttpService;
let userService: UserService;
let itemService: ItemService;
let messageService: MessageService;
let notificationService: NotificationService;
let remoteConsoleService: RemoteConsoleService;
let realTime: RealTimeService;
let persistencyService: PersistencyService;
let eventService: EventService;
let trackingService: TrackingService;
let connectionService: ConnectionService;
let inboxService: InboxService;
let inboxConversationService: InboxConversationService;
let modalService: NgbModal;
let archiveService: MsgArchiveService;
let i18n: I18nService;

const componentInstance: any = { SendPhoneComponent: jasmine.createSpy('SendPhoneComponent') };

describe('Service: Conversation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConversationService,
        RealTimeService,
        XmppService,
        ...TEST_HTTP_PROVIDERS,
        { provide: UserService, useClass: MockedUserService },
        { provide: ItemService, useClass: MockedItemService },
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: PersistencyService, useClass: MockedPersistencyService },
        { provide: RemoteConsoleService, useClass: MockRemoteConsoleService },
        { provide: InboxService, useClass: InboxServiceMock },
        { provide: InboxConversationService, useClass: InboxConversationServiceMock },
        {
          provide: BlockUserXmppService, useValue: {
            getBlockedUsers() {
              return ['1', '2', '3'];
            }
          }
        },
        {
          provide: NotificationService, useValue: {
            sendBrowserNotification() {
            }
          }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: componentInstance
              };
            }
          }
        },
        {
          provide: ConnectionService, useValue: {}
        },
        MessageService,
        EventService,
        MsgArchiveService,
        I18nService
      ]
    });
    service = TestBed.get(ConversationService);
    inboxService = TestBed.get(InboxService);
    inboxConversationService = TestBed.get(InboxConversationService);
    userService = TestBed.get(UserService);
    itemService = TestBed.get(ItemService);
    messageService = TestBed.get(MessageService);
    http = TestBed.get(HttpService);
    realTime = TestBed.get(RealTimeService);
    persistencyService = TestBed.get(PersistencyService);
    notificationService = TestBed.get(NotificationService);
    remoteConsoleService = TestBed.get(RemoteConsoleService);
    eventService = TestBed.get(EventService);
    trackingService = TestBed.get(TrackingService);
    connectionService = TestBed.get(ConnectionService);
    archiveService = TestBed.get(MsgArchiveService);
    modalService = TestBed.get(NgbModal);
    i18n = TestBed.get(I18nService);
  });

  it('should instantiate the service', () => {
    expect(service).toBeTruthy();
  });

  describe('getLeads', () => {

    it('should return empty list', () => {
      service.getLeads().subscribe((leads: Conversation[]) => expect(leads).toEqual([]));
    });
  });

  describe('openPhonePopup', () => {
    const conversation = MOCK_CONVERSATION();
    const modalOptions = { windowClass: 'phone-request', backdrop: 'static', keyboard: false };

    beforeEach(() => {
      spyOn(modalService, 'open').and.callThrough();
    });

    it('should open phoneRequest modal when the button is clicked', () => {
      service.openPhonePopup(conversation);

      expect(modalService.open).toHaveBeenCalledWith(SendPhoneComponent, modalOptions);
    });

    it('should set the modal conversation to the currentConversation, when the modal is opened', () => {
      service['modalRef'] = <any>{ componentInstance: componentInstance };

      service.openPhonePopup(conversation);

      expect(service['modalRef'].componentInstance.conversation).toBe(conversation);
    });

    it('should call trackingService.addTrackingEvent with ITEM_SHAREPHONE_SHOWFORM when called with required TRUE', () => {
      spyOn(trackingService, 'addTrackingEvent');
      const event = {
        eventData: TrackingService.ITEM_SHAREPHONE_SHOWFORM,
        attributes: { item_id: conversation.item.id }
      };

      service.openPhonePopup(conversation, true);

      expect(trackingService.addTrackingEvent).toHaveBeenCalledWith(event);
    });
  });

  describe('archiveWithPhones', () => {
    const CONVERSATIONS_WITH_PHONE: Conversation[] = createConversationsArray(4, true);
    const NORMAL_CONVERSATIONS: Conversation[] = createConversationsArray(6);
    beforeEach(() => {
      spyOn<any>(service, 'bulkArchive');
      spyOn(service, 'sendRead');
      service.leads = [...CONVERSATIONS_WITH_PHONE, ...NORMAL_CONVERSATIONS];
      service.archiveWithPhones();
    });

    it('should call bulkArchive with conversations with phone', () => {
      expect(service['bulkArchive']).toHaveBeenCalledWith(CONVERSATIONS_WITH_PHONE);
    });

    it('should call sendRead', () => {
      expect(service.sendRead).toHaveBeenCalledTimes(CONVERSATIONS_WITH_PHONE.length);
    });
  });

  describe('onArchive', () => {
    it('should call sendRead', () => {
      spyOn(service, 'sendRead');

      const CONVERSATION: Conversation = MOCK_CONVERSATION();
      service['onArchive'](CONVERSATION);

      expect(service.sendRead).toHaveBeenCalledWith(CONVERSATION);
    });
  });

  describe('onArchiveAll', () => {
    const CONVERSATIONS: Conversation[] = createConversationsArray(4);
    const RETURNED_CONVERSATIONS: Conversation[] = createConversationsArray(2);
    beforeEach(() => {
      spyOn<any>(service, 'bulkArchive').and.returnValue(RETURNED_CONVERSATIONS);
      spyOn(service, 'stream');
      spyOn(service, 'sendRead');
      service.leads = CONVERSATIONS;
      service['onArchiveAll']();
    });

    it('should call sendRead', () => {
      expect(service.sendRead).toHaveBeenCalledTimes(CONVERSATIONS.length);
    });

    it('should call bulkArchive', () => {
      expect(service['bulkArchive']).toHaveBeenCalledWith(CONVERSATIONS);
      expect(service.leads).toEqual(RETURNED_CONVERSATIONS);
    });

    it('should call streams', () => {
      expect(service.stream).toHaveBeenCalled();
    });
  });

  describe('sendRead', () => {

    let conversation: Conversation;

    beforeEach(() => {
      spyOn(realTime, 'sendRead');
      spyOn(trackingService, 'track');
      conversation = MOCK_CONVERSATION();
      service.leads = [conversation];
    });

    it('should call realTime.sendRead', () => {
      conversation.unreadMessages = 2;

      service.sendRead(conversation);

      expect(realTime.sendRead).toHaveBeenCalledWith(USER_ID, CONVERSATION_ID);
    });

    it('should set conversation.unreadMessages to 0', () => {
      conversation.unreadMessages = 2;

      service.sendRead(conversation);

      expect(conversation.unreadMessages).toBe(0);
    });

    it('should decrement totalUnreadMessages', () => {
      conversation.unreadMessages = 5;
      messageService.totalUnreadMessages = 10;

      service.sendRead(conversation);

      expect(messageService.totalUnreadMessages).toBe(5);

      conversation.unreadMessages = 10;
      messageService.totalUnreadMessages = 10;

      service.sendRead(conversation);

      expect(messageService.totalUnreadMessages).toBe(0);

      conversation.unreadMessages = 10;
      messageService.totalUnreadMessages = 5;

      service.sendRead(conversation);

      expect(messageService.totalUnreadMessages).toBe(0);
    });
  });
});
