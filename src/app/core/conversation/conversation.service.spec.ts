/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { ConversationService } from './conversation.service';
import { HttpService } from '../http/http.service';
import { Conversation } from './conversation';
import { UserService } from '../user/user.service';
import { ItemService } from '../item/item.service';
import { XmppService } from '../xmpp/xmpp.service';
import { MessageService } from '../message/message.service';
import { EventService } from '../event/event.service';
import { NotificationService } from '../notification/notification.service';
import { TrackingService } from '../tracking/tracking.service';
import { MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';
import { MockedUserService } from '../../../tests/user.fixtures.spec';
import { MockedItemService } from '../../../tests/item.fixtures.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { ConnectionService } from '../connection/connection.service';
import { MsgArchiveService } from '../message/archive.service';
import { I18nService } from '../i18n/i18n.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendPhoneComponent } from '../../chat/modals/send-phone/send-phone.component';
import { RealTimeService } from '../message/real-time.service';
import { BlockUserXmppService } from './block-user';
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

    it('should call trackingService.track with ITEM_SHAREPHONE_SHOWFORM when called with required TRUE', () => {
      spyOn(trackingService, 'track');

      service.openPhonePopup(conversation, true);

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.ITEM_SHAREPHONE_SHOWFORM, { item_id: conversation.item.id });
    });
  });
});
