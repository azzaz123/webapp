import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Conversation, EventService, Message, UserService, ConversationService, Filter, Filters, TrackingService } from 'shield';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'tsl-conversations-panel',
  templateUrl: './conversations-panel.component.html',
  styleUrls: ['./conversations-panel.component.scss']
})
export class ConversationsPanelComponent implements OnInit, OnDestroy {

  @Output() public currentConversation: EventEmitter<Conversation> = new EventEmitter<Conversation>();
  @Output() public loaded: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('scrollPanel') scrollPanel: ElementRef;

  private conversation: Conversation;
  public conversations: Array<Conversation> = [];
  public archive: boolean = false;
  private _loading: boolean = false;
  private conversationsSubscription: Subscription;
  private currentConversationSet: boolean = false;
  private page: number = 1;
  public filter: string;
  private active: boolean = true;

  constructor(public conversationService: ConversationService,
              private eventService: EventService,
              private route: ActivatedRoute,
              private trackingService: TrackingService,
              private userService: UserService,
              private elRef: ElementRef) {
  }

  set loading(value: boolean) {
    this._loading = value;
    this.loaded.emit({
      loaded: !value,
      total: this.conversations ? this.conversations.length : 0
    });
  }

  get loading(): boolean {
    return this._loading;
  }

  ngOnInit() {
    this.loading = true;
    this.route.queryParams.takeWhile(() => {
      return this.active;
    }).subscribe((params: any) => {
      this.filter = params.filterBy;
      this.getConversations();
    });
    this.handleArchiveConversations();
    this.eventService.subscribe(EventService.MESSAGE_ADDED, (message: Message) => this.sendRead(message));
    this.eventService.subscribe(EventService.CONVERSATION_UNARCHIVED, () => {
      if (this.archive) {
        this.archive = false;
        this.page = 1;
        this.getConversations();
      }
    });
  }

  private handleArchiveConversations() {
    this.eventService.subscribe(EventService.CONVERSATION_ARCHIVED, (conversation: Conversation) => {
      this.setCurrentConversation(null);
    });
  }

  ngOnDestroy() {
    this.setCurrentConversation(null);
    this.active = false;
  }

  public loadMore() {
    this.page++;
    this.getConversations();
  }

  private getConversations() {
    if (this.conversationsSubscription) {
      this.conversationsSubscription.unsubscribe();
    }
    let filters: Filter[];
    if (this.filter === 'others') {
      filters = Filters.OTHERS;
    } else if (this.filter === 'meetings') {
      filters = Filters.MEETINGS;
    }
    this.conversationsSubscription = this.conversationService.getPage(this.page, this.archive, filters).takeWhile(() => {
      return this.active;
    }).subscribe((conversations: Conversation[]) => {
      if (this.archive) {
        this.trackingService.track(TrackingService.CONVERSATION_LIST_PROCESSED_LOADED);
      } else {
        this.trackingService.track(TrackingService.CONVERSATION_LIST_ACTIVE_LOADED);
      }
      if (conversations && conversations.length > 0) {
        this.conversations = conversations;
        this.loading = false;
        if (!this.currentConversationSet) {
          this.setCurrentConversationFromQueryParams();
        }
      } else {
        this.conversations = [];
        this.loading = false;
      }
    });
  }

  private setCurrentConversationFromQueryParams() {
    this.route.queryParams.takeWhile(() => {
      return this.active;
    }).subscribe((params: any) => {
      this.currentConversationSet = true;
      const conversationId: string = params.c || this.userService.queryParams.c;
      const archive: boolean = params.archive === 'true';
      const page: number = this.conversationService.getConversationPage(conversationId, archive);
      if (page !== -1) {
        if (archive) {
          this.filterByArchived(true);
        }
        if (page > 1) {
          for (let i: number = 2; i <= page; i++) {
            this.loadMore();
          }
        }
        const currentConversation: Conversation = _.find(this.conversations, {id: conversationId});
        if (currentConversation) {
          this.setCurrentConversation(currentConversation);
          setTimeout(() => {
            this.scrollToActive();
          });
        }
      }
    });
  }

  private scrollToActive() {
    const active: HTMLElement = this.elRef.nativeElement.querySelector('tsl-conversation.active');
    if (active) {
      this.scrollPanel.nativeElement.scrollTop = active.offsetTop - active.offsetHeight;
    }

  }

  private sendRead(message: Message) {
    if (this.conversation && this.conversation.id === message.conversationId && message.fromBuyer) {
      Visibility.onVisible(() => {
        setTimeout(() => {
          this.conversationService.sendRead(this.conversation);
        }, 1000);
      });
    }
  }

  public setCurrentConversation(conversation: Conversation) {
    this.currentConversation.emit(conversation);
    this.conversation = conversation;
  }

  public filterByArchived(archive: boolean) {
    this.archive = archive;
    this.page = 1;
    this.loading = true;
    this.setCurrentConversation(null);
    this.getConversations();
  }

}
