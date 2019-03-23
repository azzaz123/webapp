import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdService } from '../../core/ad/ad.service';
import { UserService } from '../../core/user/user.service';
import { EventService } from '../../core/event/event.service';
import { InboxConversation } from './inbox/inbox-conversation/inbox-conversation';

@Component({
  selector: 'tsl-chat-with-inbox',
  templateUrl: './chat-with-inbox.component.html',
  styleUrls: ['./chat-with-inbox.component.scss']
})
export class ChatWithInboxComponent implements OnInit, OnDestroy {

  public conversationsLoaded: boolean;
  public conversationsTotal: number;
  public connectionError: boolean;
  public firstLoad: boolean;
  public userWebSlug: string;
  public isProfessional: boolean;
  public currentConversation: InboxConversation;

  constructor(public userService: UserService,
    private eventService: EventService,
    private adService: AdService) {
    this.userService.isProfessional().subscribe((value: boolean) => {
      this.isProfessional = value;
    });
  }

  ngOnInit() {
    this.eventService.subscribe(EventService.CONNECTION_ERROR, () => {
      this.connectionError = true;
      this.conversationsLoaded = true;
    });
    this.eventService.subscribe(EventService.CONNECTION_RESTORED, () => {
      this.connectionError = false;
    });
    this.eventService.subscribe(EventService.CURRENT_CONVERSATION_SET, (conversation: InboxConversation) => {
      this.currentConversation = conversation;
    });
  }

  ngOnDestroy () {
    this.adService.stopAdsRefresh();
  }

  public onLoaded(event: any) {
    this.conversationsLoaded = event.firstPage ? event.loaded : true;
    this.conversationsTotal = event.total;
  }
}
