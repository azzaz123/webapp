import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Conversation, Message, NewConversationResponse, TrackingService, ItemService } from 'shield';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { EventService } from '../../core/event/event.service';
import { ConversationService } from '../../core/conversation/conversation.service';
import { UserService } from '../../core/user/user.service';
import { Observable } from 'rxjs/Observable';

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
  private newConversationItemId: string;

  constructor(public conversationService: ConversationService,
              private eventService: EventService,
              private route: ActivatedRoute,
              private trackingService: TrackingService,
              private itemService: ItemService,
              public userService: UserService,
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
    this.eventService.subscribe(EventService.FIND_CONVERSATION, (conversation: NewConversationResponse) => this.findConversation(conversation));
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
      if (!this.currentConversationSet) {
        this.route.queryParams.subscribe((params) => {
          this.newConversationItemId = params.itemId;
          if (params.itemId) {
            this.conversationService.getByItemId(this.newConversationItemId).subscribe((convResponse: NewConversationResponse) => {
              this.eventService.emit(EventService.FIND_CONVERSATION, convResponse);
            }, (e) => {
              this.eventService.emit(EventService.FIND_CONVERSATION, null);
            });
          }
        });
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
      this.setCurrentConversationWithConversationId(conversationId);
    });
  }

  private setCurrentConversationWithConversationId(conversationId: string) {
    const page = this.conversationService.getConversationPage(conversationId);
    if (page !== -1) {
      if (page > 1) {
        this.createConversationAndSetItCurrent();
      }
      const currentConversation: Conversation = _.find(this.conversations, {id: conversationId});
      if (currentConversation) {
        this.setCurrentConversation(currentConversation);
        setTimeout(() => {
          this.scrollToActive();
        });
      }
    }
  }

  public findConversation(conversation: NewConversationResponse) {
    if (conversation === null) {
      this.createConversationAndSetItCurrent();
    } else {
      this.setCurrentConversationWithConversationId(conversation.conversation_id);
    }
  }

  private createConversationAndSetItCurrent() {
    this.conversationService.createConversation(this.newConversationItemId).subscribe((conv: NewConversationResponse) => {
      const resp: NewConversationResponse = conv;
      this.getConversationUserAndItemInfo(resp.seller_user_id, this.newConversationItemId).subscribe((r: any) => {
        const newConversation = new Conversation(
          resp.conversation_id,
          null,
          resp.modified_date,
          false,
          r[0],
          r[1]);
        this.conversationService.addLead(newConversation);
        this.conversationService.loadMessagesIntoConversations(this.conversations);
        this.setCurrentConversation(newConversation);
      });
    });
  }

  private getConversationUserAndItemInfo(userId: string, itemId: string) {
    return Observable.forkJoin(
      this.userService.get(userId),
      this.itemService.get(itemId)
    );
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
