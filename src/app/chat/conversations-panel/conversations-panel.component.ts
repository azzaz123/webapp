import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Conversation, ConversationService, EventService, Message, TrackingService, UserService } from 'shield';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'tsl-conversations-panel',
  templateUrl: './conversations-panel.component.html',
  styleUrls: ['./conversations-panel.component.scss']
})
export class ConversationsPanelComponent implements OnInit, OnDestroy {

  @Output() public currentConversation = new EventEmitter<Conversation>();
  @Output() public loaded = new EventEmitter<any>();
  @ViewChild('scrollPanel') scrollPanel: ElementRef;

  private conversation: Conversation;
  public conversations: Array<Conversation> = [];
  private _loading = false;
  private conversationsSubscription: Subscription;
  private currentConversationSet = false;
  public page = 1;
  private active = true;

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
    this.getConversations();
    this.eventService.subscribe(EventService.CONVERSATION_ARCHIVED, () => this.setCurrentConversation(null));
    this.eventService.subscribe(EventService.MESSAGE_ADDED, (message: Message) => this.sendRead(message));
  }

  ngOnDestroy() {
    this.setCurrentConversation(null);
    this.active = false;
  }

  public loadMore() {
    this.page++;
    this.loading = true;
    this.conversationService.loadMore().subscribe(() => {
      this.getConversations();
    });
  }

  private getConversations() {
    if (this.conversationsSubscription) {
      this.conversationsSubscription.unsubscribe();
    }
    this.conversationsSubscription = this.conversationService.getPage(this.page).takeWhile(() => {
      return this.active;
    }).subscribe((conversations: Conversation[]) => {
      this.trackingService.track(TrackingService.CONVERSATION_LIST_ACTIVE_LOADED);
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
      const page = this.conversationService.getConversationPage(conversationId);
      if (page !== -1) {
        if (page > 1) {
          for (let i = 2; i <= page; i++) {
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

}
