import * as _ from 'lodash';
import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { EventService } from '../../../core/event/event.service';
import { InboxConversation } from './inbox-conversation/inbox-conversation';
import { InboxService } from '../../../core/inbox/inbox.service';
import { ConversationService } from '../../../core/inbox/conversation.service';
import { Message } from '../../../core/message/message';
import { debug } from 'util';

enum InboxState { Inbox, Archived }

@Component({
  selector: 'tsl-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, OnDestroy  {
  @Output() public loadingEvent = new EventEmitter<any>();
  @ViewChild('scrollPanel') scrollPanel: ElementRef;

  public conversations: InboxConversation[] = [];
  public archivedConversations: InboxConversation[] = [];
  public showNewMessagesToast = false;
  public componentState: InboxState;
  private _loading = false;
  private _loadingMore = false;
  private conversationElementHeight = 100;
  public errorRetrievingInbox = false;
  private conversation: InboxConversation;

  constructor(private inboxService: InboxService,
    private eventService: EventService,
    private conversationService: ConversationService) {}

  set loading(value: boolean) {
    this._loading = value;
    this.loadingEvent.emit({
      loading: value,
      total: this.conversations ? this.conversations.length : 0,
    });
  }

  get loading(): boolean {
    return this._loading;
  }

  set loadingMore(value: boolean) {
    this._loadingMore = value;
  }

  get loadingMore(): boolean {
    return this._loadingMore;
  }

  get isInbox(): boolean {
    return this.componentState === InboxState.Inbox;
  }

  get isArchived(): boolean {
    return this.componentState === InboxState.Archived;
  }
  ngOnInit() {
    this.componentState = InboxState.Inbox;
    this.bindNewMessageToast();
    if (this.inboxService.conversations) {
      this.onInboxReady(this.inboxService.conversations);
      this.archivedConversations = this.inboxService.archivedConversations;
      this.loading = false;
    } else {
      this.loading = true;
    }
    this.eventService.subscribe(EventService.INBOX_LOADED, (conversations: InboxConversation[]) => {
      this.onInboxReady(conversations);
    });

    this.eventService.subscribe(EventService.ARCHIVED_INBOX_LOADED, (conversations: InboxConversation[]) => {
      this.archivedConversations = conversations;
    });
  }

  ngOnDestroy() {
    this.unselectCurrentConversation();
  }

  private onInboxReady(conversations) {
    this.conversations = conversations;
    this.loading = false;
    this.loadingMore = false;
    this.errorRetrievingInbox = this.inboxService.errorRetrievingInbox;
  }

  private bindNewMessageToast() {
    this.eventService.subscribe(EventService.NEW_MESSAGE, (message: Message) => {
      if (message.fromSelf) {
        this.scrollToTop();
      } else {
        this.showNewMessagesToast = this.scrollPanel.nativeElement.scrollTop > this.conversationElementHeight * 0.75;
      }
    });
  }

  public showInbox() {
    this.componentState = InboxState.Inbox;
  }

  public showArchive() {
    this.componentState = InboxState.Archived;
  }

  public handleScroll() {
    this.showNewMessagesToast = this.scrollPanel.nativeElement.scrollTop > this.conversationElementHeight * 0.25;
  }

  public scrollToTop() {
    this.scrollPanel.nativeElement.scrollTop = 0;
  }

  public setCurrentConversation(newCurrentConversation: InboxConversation) {
    this.unselectCurrentConversation();
    this.conversation = newCurrentConversation;
    newCurrentConversation.active = true;
    this.conversationService.openConversation(newCurrentConversation);
  }

  public loadMore() {
    this.loadingMore = true;
    this.inboxService.loadMorePages();
  }

  public showLoadMore(): boolean {
    return this.inboxService.shouldLoadMorePages();
  }

  public loadMoreArchived() {
    this.loadingMore = true;
    this.inboxService.loadMoreArchivedPages();
  }

  public showLoadMoreArchived(): boolean {
    return this.inboxService.shouldLoadMoreArchivedPages();
  }

  public hasConversations(): boolean {
    return this.conversations && this.conversations.length > 0;
  }

  public hasArchivedConversations(): boolean {
    return this.archivedConversations && this.archivedConversations.length > 0;
  }

  public shouldDisplayHeader(): boolean {
    return this.hasArchivedConversations() || this.hasConversations();
  }

  private unselectCurrentConversation() {
    if (this.conversation) {
      this.conversation.active = false;
    }
  }
}
