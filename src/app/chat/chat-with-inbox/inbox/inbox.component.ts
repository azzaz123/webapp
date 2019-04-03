import * as _ from 'lodash';
import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { EventService } from '../../../core/event/event.service';
import { InboxConversation } from './inbox-conversation/inbox-conversation';
import { InboxService } from '../../../core/inbox/inbox.service';
import { ConversationService } from '../../../core/inbox/conversation.service';

@Component({
  selector: 'tsl-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, OnDestroy  {
  @Output() public loadingEvent = new EventEmitter<any>();
  @ViewChild('scrollPanel') scrollPanel: ElementRef;

  public conversations: InboxConversation[];
  public showNewMessagesToast = false;
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
  ngOnInit() {

    this.bindNewMessageToast();
    if (this.inboxService.conversations) {
      this.onInboxReady(this.inboxService.conversations);
      this.loading = false;
    } else {
      this.loading = true;
    }
    this.eventService.subscribe(EventService.INBOX_LOADED, (conversations: InboxConversation[]) => {
      this.onInboxReady(conversations);
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
    this.eventService.subscribe(EventService.NEW_MESSAGE, () => {
      this.showNewMessagesToast = this.scrollPanel.nativeElement.scrollTop > this.conversationElementHeight * 0.75;
    });
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

  public showLoadMore(): Boolean {
    return this.inboxService.shouldLoadMorePages();
  }

  private unselectCurrentConversation() {
    if (this.conversation) {
      this.conversation.active = false;
    }
  }
}
