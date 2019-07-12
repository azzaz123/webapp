import * as _ from 'lodash';
import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { EventService } from '../../../core/event/event.service';
import { InboxConversation } from './inbox-conversation/inbox-conversation';
import { InboxService } from '../../../core/inbox/inbox.service';
import { ConversationService } from '../../../core/inbox/conversation.service';
import { Message } from '../../../core/message/message';
import { debug } from 'util';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { UserService } from '../../../core/user/user.service';

export enum InboxState { Inbox, Archived }

@Component({
  selector: 'tsl-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  animations: [trigger('appearInOut', [
    transition(':enter', [   // :enter is alias to 'void => *'
      style({
        transform: 'translateY(-180%)',
        opacity: 0
      }),
      animate('300ms ease-in-out', keyframes([
        style({
          transform: 'translateY(20%)',
          opacity: 1,
          offset: 0.9
        }),
        style({
          transform: 'translateY(0)',
          offset: 1
        })
      ]))
    ]),
    transition(':leave', [   // :leave is alias to '* => void'
      animate('300ms ease-in-out', keyframes([
        style({
          transform: 'translateY(20%)',
          opacity: 0.4,
          offset: 0.1
        }),
        style({
          transform: 'translateY(-180%)',
          opacity: 0,
          offset: 1
        })
      ]))
    ])
  ])]
})
export class InboxComponent implements OnInit, OnDestroy {

  @Output() public loadingEvent = new EventEmitter<any>();
  @Output() public loadingError = new EventEmitter<any>();
  @ViewChild('scrollPanel') scrollPanel: ElementRef;

  public conversations: InboxConversation[] = [];
  public archivedConversations: InboxConversation[] = [];
  public showNewMessagesToast = false;
  public componentState: InboxState;
  private _loading = false;
  private _loadingMore = false;
  private conversationElementHeight = 100;
  public errorRetrievingInbox = false;
  public errorRetrievingArchived = false;
  private conversation: InboxConversation;
  public isProfessional: boolean;

  constructor(private inboxService: InboxService,
              private eventService: EventService,
              private conversationService: ConversationService,
              private userService: UserService) {
  }

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

    this.userService.isProfessional().subscribe((value: boolean) => {
      this.isProfessional = value;
    });

    this.eventService.subscribe(EventService.CURRENT_CONVERSATION_SET, (conversation => {
      if (this.conversation !== conversation) {
        this.unselectCurrentConversation();
        this.conversation = conversation;
        conversation.active = true;
      }
      if (this.archivedConversations.find((c) => c === conversation) && this.componentState === InboxState.Inbox) {
        this.componentState = InboxState.Archived;
      }
    }));
  }

  ngOnDestroy() {
    this.unselectCurrentConversation();
  }

  private onInboxReady(conversations) {
    this.conversations = conversations;
    this.loading = false;
    this.loadingMore = false;
    this.errorRetrievingInbox = this.inboxService.errorRetrievingInbox;
    this.errorRetrievingArchived = this.inboxService.errorRetrievingArchived;
    this.showInbox();
  }

  private bindNewMessageToast() {
    this.eventService.subscribe(EventService.NEW_MESSAGE, (message: Message) => {
      if (message.fromSelf && this.conversation.id === message.thread) {
        this.scrollToTop();
      } else {
        this.showNewMessagesToast = this.scrollPanel.nativeElement.scrollTop > this.conversationElementHeight * 0.75;
      }
    });
  }

  public showInbox() {
    this.loadingError.emit(this.errorRetrievingInbox);
    this.componentState = InboxState.Inbox;
  }

  public showArchive() {
    this.loadingError.emit(this.errorRetrievingArchived);
    this.componentState = InboxState.Archived;
  }

  public handleScroll() {
    this.showNewMessagesToast = this.scrollPanel.nativeElement.scrollTop > this.conversationElementHeight * 0.25;
  }

  public scrollToTop() {
    this.scrollPanel.nativeElement.scrollTop = 0;
  }

  public setCurrentConversation(newCurrentConversation: InboxConversation) {
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
