import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { EventService } from '../../core/event/event.service';
import { ConversationService } from '../../core/conversation/conversation.service';
import { UserService } from '../../core/user/user.service';
import { TrackingService } from '../../core/tracking/tracking.service';
import { Conversation } from '../../core/conversation/conversation';
import { Message } from '../../core/message/message';
import { NewConversationResponse } from '../../core/conversation/conversation-response.interface';
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
  public archive = false;
  private _loading = false;
  private conversationsSubscription: Subscription;
  private currentConversationSet = false;
  public page = 1;
  private active = true;
  private newConversationItemId: string;
  public isProfessional: boolean;

  constructor(public conversationService: ConversationService,
              private eventService: EventService,
              private route: ActivatedRoute,
              private trackingService: TrackingService,
              public userService: UserService,
              private elRef: ElementRef) {
    this.userService.isProfessional().subscribe((value: boolean) => {
      this.isProfessional = value;
    });
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
    this.eventService.subscribe(EventService.LEAD_ARCHIVED, () => this.setCurrentConversation(null));
    this.eventService.subscribe(EventService.MESSAGE_ADDED, (message: Message) => this.sendRead(message));
    this.eventService.subscribe(EventService.FIND_CONVERSATION,
      (conversation: NewConversationResponse) => this.findConversation(conversation));
    this.eventService.subscribe(EventService.CONVERSATION_UNARCHIVED, () => {
      if (this.archive) {
        this.archive = false;
        this.page = 1;
        this.setCurrentConversation(null);
        this.getConversations();
      }
    });
  }

  ngOnDestroy() {
    this.setCurrentConversation(null);
    this.active = false;
  }

  public loadMore() {
    this.page++;
    this.loading = true;
    let observable: Observable<any>;
    if (this.archive) {
      observable = this.conversationService.loadMoreArchived();
    } else {
      observable = this.conversationService.loadMore();
    }
    observable.subscribe(() => {
      this.getConversations();
    });
  }

  private getConversations() {
    if (this.conversationsSubscription) {
      this.conversationsSubscription.unsubscribe();
    }
    this.conversationsSubscription = this.conversationService.getPage(this.page, this.archive).takeWhile(() => {
      return this.active;
    }).subscribe((conversations: Conversation[]) => {
      if (this.archive) {
        this.trackingService.track(TrackingService.CONVERSATION_LIST_PROCESSED_LOADED);
      } else {
        this.trackingService.track(TrackingService.CONVERSATION_LIST_ACTIVE_LOADED);
      }
      if (!this.currentConversationSet) {
        this.route.queryParams.subscribe((params: any) => {
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
      this.conversationService.checkIfLastPage(this.archive).subscribe();
    });
  }

  private setCurrentConversationFromQueryParams() {
    this.route.queryParams.takeWhile(() => {
      return this.active;
    }).subscribe((params: any) => {
      this.currentConversationSet = true;
      const conversationId: string = params.c || this.userService.queryParams.c;
      if (conversationId) {
        this.setCurrentConversationWithConversationId(conversationId);
      }
    });
  }

  private setCurrentConversationWithConversationId(conversationId: string) {
    const page = this.conversationService.getConversationPage(conversationId);
    if (page === -1) {
      this.createConversationAndSetItCurrent();
    } else {
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
    this.conversationService.createConversation(this.newConversationItemId).subscribe((newConversation: Conversation) => {
      this.conversationService.getSingleConversationMessages(newConversation).subscribe((newConversationWithMessages: Conversation) => {
        this.conversationService.addLead(newConversationWithMessages);
        this.setCurrentConversation(newConversationWithMessages);
      });
    });
  }

  private scrollToActive() {
    const active: HTMLElement = this.elRef.nativeElement.querySelector('tsl-conversation.active');
    if (active) {
      this.scrollPanel.nativeElement.scrollTop = active.offsetTop - active.offsetHeight;
    }
  }

  private sendRead(message: Message) {
    if (this.conversation && this.conversation.id === message.conversationId && !message.fromSelf) {
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
