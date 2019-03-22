import { Injectable } from '@angular/core';
import { RealTimeService } from '../message/real-time.service';
import { InboxConversation } from '../../chat/chat-with-inbox/inbox/inbox-conversation/inbox-conversation';
import { CurrentConversation } from '../../chat/chat-with-inbox/current-conversation/current-conversation';
import { PersistencyService } from '../persistency/persistency.service';
import { EventService } from '../event/event.service';
import { InboxMessage } from '../../chat/chat-with-inbox/message/inbox-message';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  constructor(
    private realTime: RealTimeService,
    private persistency: PersistencyService,
    private event: EventService,
    private userService: UserService
  ) { }

  public openConversation(conversation: InboxConversation) {
    const currentConversation = new CurrentConversation(conversation.id, conversation.modifiedDate, conversation.user, conversation.item,
      conversation.phoneShared, conversation.unreadCounter);
    currentConversation.cannotChat = conversation.cannotChat;
    this.persistency.getMessages(conversation.id).subscribe(messages => {
      messages.map(m => {
        const msg = new InboxMessage(m.doc._id, m.doc.conversationId,  m.doc.message, m.doc.from, m.doc.from === this.userService.user.id,
          m.doc.date, m.doc.status, m.doc.payload, m.doc.phoneRequest);
        currentConversation.messages.push(msg);
      });
      this.event.emit(EventService.CURRENT_CONVERSATION_SET, currentConversation);
    });

    if (currentConversation.unreadCounter) {
      this.realTime.sendRead(conversation.user.id, conversation.id);
    }
  }
}
