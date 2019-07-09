import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdService } from '../../core/ad/ad.service';
import { UserService } from '../../core/user/user.service';
import { EventService } from '../../core/event/event.service';
import { InboxConversation } from './inbox/inbox-conversation/inbox-conversation';
import { ActivatedRoute } from '@angular/router';
import { ConversationService } from '../../core/inbox/conversation.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'tsl-chat-with-inbox',
  templateUrl: './chat-with-inbox.component.html',
  styleUrls: ['./chat-with-inbox.component.scss']
})
export class ChatWithInboxComponent implements OnInit, OnDestroy {

  public conversationsLoading: boolean;
  public conversationsTotal: number;
  public connectionError: boolean;
  public firstLoad: boolean;
  public isProfessional: boolean;
  public currentConversation: InboxConversation;
  public isLoading = false;
  private inboxReady: boolean;
  private archivedInboxReady: boolean;

  constructor(public userService: UserService,
    private eventService: EventService,
    private adService: AdService,
    private route: ActivatedRoute,
    private conversationService: ConversationService) {
    this.userService.isProfessional().subscribe((value: boolean) => {
      this.isProfessional = value;
    });
    this.inboxReady = false;
    this.archivedInboxReady = false;
  }

  ngOnInit() {
    this.eventService.subscribe(EventService.CONNECTION_ERROR, () => {
      this.connectionError = true;
      this.conversationsLoading = false;
    });
    this.eventService.subscribe(EventService.CONNECTION_RESTORED, () => {
      this.connectionError = false;
    });
    this.eventService.subscribe(EventService.CURRENT_CONVERSATION_SET, (conversation: InboxConversation) => {
      this.currentConversation = conversation;
      this.conversationsLoading = false;
    });
    this.eventService.subscribe(EventService.INBOX_READY, (ready) => {
      this.inboxReady = ready;
      this.openConversationIfNeeded();
    });
    this.eventService.subscribe(EventService.ARCHIVED_INBOX_READY, (ready) => {
      this.archivedInboxReady = ready;
      this.openConversationIfNeeded();
    });
  }

  ngOnDestroy () {
    this.adService.stopAdsRefresh();
  }

  public onLoad(event: any) {
    this.conversationsLoading = event.loading;
    this.conversationsTotal = event.total;
  }

  private openConversationIfNeeded() {
    if (this.currentConversation || !this.inboxLoaded()) {
      return;
    }

    this.route.queryParams.subscribe((params: any) => {
      const itemId = params.itemId; // TODO: this params will include userId 

      // Try to find the conversation within the downloaded ones
      this.conversationsLoading = true;
      this.conversationService.openConversationWith$(itemId)
      .catch(() => {
        return Observable.of({});
      })
      .subscribe(() => {
        this.conversationsLoading = false;
      });
    });
  }

  private inboxLoaded(): boolean {
    return this.inboxReady && this.archivedInboxReady;
  }
}