import { Injectable } from '@angular/core';
import { RealTimeService } from '../message/real-time.service';
import { InboxConversation } from '../../chat/chat-with-inbox/inbox/inbox-conversation/inbox-conversation';
import { EventService } from '../event/event.service';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  constructor(
    private realTime: RealTimeService,
    private eventService: EventService) { }

  public openConversation(conversation: InboxConversation) {
    this.eventService.emit(EventService.CURRENT_CONVERSATION_SET, conversation);
    if (conversation.unreadCounter) {
      this.realTime.sendRead(conversation.user.id, conversation.id);
    }
  }
}
