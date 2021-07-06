import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewChatScreen } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { EventService } from '@core/event/event.service';
import { RemoteConsoleService } from '@core/remote-console';
import { PERMISSIONS } from '@core/user/user-constants';
import { UserService } from '@core/user/user.service';
import { InboxConversationService } from '@private/features/chat/core/inbox/inbox-conversation.service';
import { InboxService } from '@private/features/chat/core/inbox/inbox.service';
import { InboxConversation, InboxMessage } from '@private/features/chat/core/model';
import { countBy, find, map } from 'lodash-es';
import { Subscription } from 'rxjs';

export enum InboxState {
  Inbox,
  Archived,
}

@Component({
  selector: 'tsl-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  animations: [
    trigger('appearInOut', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({
          transform: 'translateY(-180%)',
          opacity: 0,
        }),
        animate(
          '300ms ease-in-out',
          keyframes([
            style({
              transform: 'translateY(20%)',
              opacity: 1,
              offset: 0.9,
            }),
            style({
              transform: 'translateY(0)',
              offset: 1,
            }),
          ])
        ),
      ]),
      transition(':leave', [
        // :leave is alias to '* => void'
        animate(
          '300ms ease-in-out',
          keyframes([
            style({
              transform: 'translateY(20%)',
              opacity: 0.4,
              offset: 0.1,
            }),
            style({
              transform: 'translateY(-180%)',
              opacity: 0,
              offset: 1,
            }),
          ])
        ),
      ]),
    ]),
  ],
})
export class InboxComponent implements OnInit, OnDestroy {
  @Output() public loadingEvent = new EventEmitter<any>();
  @Output() public loadingError = new EventEmitter<any>();
  @ViewChild('scrollPanel') scrollPanel: ElementRef;
  public readonly PERMISSIONS = PERMISSIONS;
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

  subscriptions: Subscription = new Subscription();

  constructor(
    private inboxService: InboxService,
    private eventService: EventService,
    private inboxConversationService: InboxConversationService,
    public userService: UserService,
    private remoteConsoleService: RemoteConsoleService,
    private analyticsService: AnalyticsService
  ) {}

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
    if (this.inboxConversationService.conversations) {
      this.onInboxReady(this.inboxConversationService.conversations, 'INIT_INBOX');
      this.conversations = this.inboxConversationService.conversations;
      this.archivedConversations = this.inboxConversationService.archivedConversations;
      this.loading = false;
    } else {
      this.loading = true;
    }

    this.subscriptions.add(
      this.eventService.subscribe(EventService.INBOX_LOADED, (conversations: InboxConversation[], callMethodClient: string) => {
        this.conversations = this.inboxConversationService.conversations;
        this.onInboxReady(conversations, callMethodClient);
      })
    );
    this.subscriptions.add(
      this.eventService.subscribe(EventService.ARCHIVED_INBOX_LOADED, (conversations: InboxConversation[]) => {
        this.archivedConversations = this.inboxConversationService.archivedConversations;
        this.setStatusesAfterLoadConversations();
      })
    );
    this.subscriptions.add(
      this.userService.isProfessional().subscribe((value: boolean) => {
        this.isProfessional = value;
      })
    );

    this.subscriptions.add(
      this.eventService.subscribe(EventService.CURRENT_CONVERSATION_SET, (conversation) => {
        if (this.conversation !== conversation) {
          this.conversation = conversation;
          if (conversation) {
            this.trackViewConversation(conversation);
          }
        }
        if (this.archivedConversations.find((c) => c === conversation) && this.componentState === InboxState.Inbox) {
          this.componentState = InboxState.Archived;
        }
      })
    );
  }

  private setStatusesAfterLoadConversations() {
    this.loading = false;
    this.loadingMore = false;
    this.errorRetrievingInbox = this.inboxService.errorRetrievingInbox;
    this.errorRetrievingArchived = this.inboxService.errorRetrievingArchived;
  }

  ngOnDestroy() {
    this.unselectCurrentConversation();
    this.subscriptions.unsubscribe();
  }

  private onInboxReady(conversations: InboxConversation[], callMethodClient: string) {
    this.setStatusesAfterLoadConversations();
    this.showInbox();
    this.sendLogWithNumberOfConversationsByConversationId(conversations, callMethodClient);
  }

  private bindNewMessageToast() {
    this.eventService.subscribe(EventService.NEW_MESSAGE, (message: InboxMessage) => {
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
    if (!newCurrentConversation.user.location) {
      this.userService.get(newCurrentConversation.user.id).subscribe((user) => (newCurrentConversation.user.location = user.location));
    }
    this.inboxConversationService.openConversation(newCurrentConversation);
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

  private sendLogWithNumberOfConversationsByConversationId(conversations: InboxConversation[], callMethodClient: string) {
    const conversationsIds = countBy(map(conversations, (conversation) => conversation.id));
    const hasDuplicated = find(conversationsIds, (numberOfConversation) => numberOfConversation > 1);

    if (hasDuplicated) {
      const user = this.userService.user;

      this.remoteConsoleService.sendDuplicateConversations(user.id, callMethodClient, conversationsIds);
    }
  }

  private trackViewConversation(conversation: InboxConversation) {
    const event: AnalyticsPageView<ViewChatScreen> = {
      name: ANALYTICS_EVENT_NAMES.ViewChatScreen,
      attributes: {
        itemId: conversation.item.id,
        conversationId: conversation.id,
        screenId: SCREEN_IDS.Chat,
      },
    };

    this.analyticsService.trackPageView(event);
  }
}
