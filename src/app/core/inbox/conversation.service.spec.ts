import { TestBed } from '@angular/core/testing';
import { ConversationService } from './conversation.service';
import { MessageService } from '../message/message.service';
import { RealTimeService } from '../message/real-time.service';
import { PersistencyService } from '../persistency/persistency.service';
import { MockedPersistencyService } from '../../../tests/persistency.fixtures.spec';
import { EventService } from '../event/event.service';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../tests/inbox.fixtures.spec';
import { InboxConversation } from '../../chat/chat-with-inbox/inbox/inbox-conversation/inbox-conversation';

let service: ConversationService;
let eventService: EventService;
let realTime: RealTimeService;
let persistencyService: PersistencyService;
let messageService: MessageService;


describe('ConversationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConversationService,
        EventService,
        {provide: RealTimeService, useValue: { sendRead() {}} },
        {provide: PersistencyService, useClass: MockedPersistencyService},
        {provide: MessageService, useValue: { totalUnreadMessagee: 0 }}
      ]
    });
    service = TestBed.get(ConversationService);
    eventService = TestBed.get(EventService);
    realTime = TestBed.get(RealTimeService);
    persistencyService = TestBed.get(PersistencyService);
    messageService = TestBed.get(MessageService);
  });

  describe('openConversation', () => {
    let conversation: InboxConversation;
    beforeEach(() => {
      spyOn(eventService, 'emit').and.callThrough();
      spyOn(realTime, 'sendRead');
      conversation = CREATE_MOCK_INBOX_CONVERSATION('my-id');
    });

    it('should emit a CURRENT_CONVERSATION_SET event when called', () => {
      service.openConversation(conversation);

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CURRENT_CONVERSATION_SET, conversation);
    });

    it('should call realTime.sendRead if the conversation has unread messages', () => {
      conversation.unreadCounter = 5;

      service.openConversation(conversation);

      expect(realTime.sendRead).toHaveBeenCalledWith(conversation.user.id, conversation.id);
    });

    it('should NOT call realTime.sendRead if the conversation does NOT have unread messages', () => {
      conversation.unreadCounter = 0;

      service.openConversation(conversation);

      expect(realTime.sendRead).not.toHaveBeenCalled();
    });
  });
});
