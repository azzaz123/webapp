import { Component, OnInit } from '@angular/core';
import { InboxService } from '../core/inbox/inbox.service';
import { InboxConversation, PhoneMethod } from './model';
import { UserService } from '../core/user/user.service';
import { EventService } from '../core/event/event.service';
import { AdService } from '../core/ad/ad.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ConversationService } from '../core/conversation/conversation.service';
import { InboxConversationService } from '../core/inbox/inbox-conversation.service';
import { Observable } from 'rxjs';
import { isEmpty, isNil } from 'lodash-es';

@Component({
  selector: 'tsl-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public conversationsLoading: boolean;
  public conversationsTotal: number;
  public loadingError: boolean;
  public connectionError: boolean;
  public firstLoad: boolean;
  public isProfessional: boolean;
  private archivedInboxReady: boolean;

  constructor(public userService: UserService,
              private eventService: EventService,
              private adService: AdService,
              private route: ActivatedRoute,
              private conversationService: ConversationService,
              private inboxService: InboxService,
              public inboxConversationService: InboxConversationService) {
    this.userService.isProfessional().subscribe((value: boolean) => {
      this.isProfessional = value;
    });
    this.archivedInboxReady = false;
  }

  ngOnInit() {
    this.connectionError = false;
    this.conversationsLoading = false;
    if (this.inboxService.isInboxReady()) {
      this.openConversationIfNeeded();
    }
    this.eventService.subscribe(EventService.CONNECTION_ERROR, () => {
      this.connectionError = true;
      this.conversationsLoading = false;
    });
    this.eventService.subscribe(EventService.CONNECTION_RESTORED, () => {
      this.connectionError = false;
    });

    this.eventService.subscribe(EventService.CHAT_RT_CONNECTED, () => this.inboxConversationService.conversations
    .forEach((conversation: InboxConversation) => this.inboxConversationService.resendPendingMessages(conversation)));

    this.eventService.subscribe(EventService.CURRENT_CONVERSATION_SET, (conversation: InboxConversation) => {
      this.inboxConversationService.currentConversation = conversation;
      this.conversationsLoading = false;
    });
    this.eventService.subscribe(EventService.INBOX_READY, (ready) => {
      this.openConversationIfNeeded();
    });
    this.eventService.subscribe(EventService.ARCHIVED_INBOX_READY, (ready) => {
      this.archivedInboxReady = ready;
      this.openConversationIfNeeded();
    });
  }

  public onLoad(event: any) {
    this.conversationsLoading = event.loading;
    this.conversationsTotal = event.total;
  }

  public onChangeInboxOrArchivedDropdown(event: boolean) {
    if (event) {
      this.inboxConversationService.currentConversation = null;
    }
    this.loadingError = event;
  }

  private openConversationIfNeeded() {
    if (this.inboxConversationService.currentConversation || !this.inboxService.isInboxReady()) {
      return;
    }

    this.route.queryParams.subscribe((params: Params) => {
      const itemId = params.itemId;
      const conversationId = params.conversationId;

      if (conversationId) {
        this.openConversationByConversationId(conversationId);
      } else if (itemId) {
        this.openConversationByItmId(itemId);
      }
    });
  }

  private openConversationByConversationId(conversationId: string) {
    if (isNil(conversationId)) {
      return;
    }

    this.conversationsLoading = true;
    this.inboxConversationService.openConversationByConversationId$(conversationId).subscribe((inboxConversation: InboxConversation) => {
      if (inboxConversation) {
        this.inboxConversationService.currentConversation = inboxConversation;
        return;
      }
      this.conversationsLoading = false;
    });
  }

  private openConversationByItmId(itemId: string) {
    if (isNil(itemId)) {
      return;
    }

    // Try to find the conversation within the downloaded ones
    this.conversationsLoading = true;
    this.inboxConversationService.openConversationByItemId$(itemId)
    .catch(() => Observable.of(null))
    .subscribe((conversation: InboxConversation) => {
      if (conversation) {
        this.inboxConversationService.currentConversation = conversation;
      } else {
        this.conversationsLoading = false;
      }
      if (isEmpty(conversation.messages)) {
        this.getPhoneInfo(conversation);
      }
    });
  }

  private getPhoneInfo(conversation: InboxConversation): void {
    this.userService.getPhoneInfo(conversation.user.id).subscribe(phoneInfo => {
      if (!isNil(phoneInfo) && phoneInfo.phone_method === PhoneMethod.POP_UP) {
        this.conversationService.openPhonePopup(conversation, true);
      }
    });
  }
}
