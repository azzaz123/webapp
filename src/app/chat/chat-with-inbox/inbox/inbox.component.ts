import * as _ from 'lodash';
import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { EventService } from '../../../core/event/event.service';
import { InboxConversation } from './inbox-conversation/inbox-conversation';
import { InboxService } from '../../../core/inbox/inbox.service';

@Component({
  selector: 'tsl-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  @Output() public loaded = new EventEmitter<any>();
  @ViewChild('scrollPanel') scrollPanel: ElementRef;

  public conversations: InboxConversation[] = [];
  public showNewMessagesToast = false;
  private _loading = false;
  private conversationElementHeight = 100;
  public errorRetrievingInbox = false;

  constructor(private inboxService: InboxService,
    private eventService: EventService) {}

  set loading(value: boolean) {
    this._loading = value;
    this.loaded.emit({
      loaded: !value,
      total: this.conversations ? this.conversations.length : 0,
      firstPage: true
    });
  }

  get loading(): boolean {
    return this._loading;
  }

  ngOnInit() {
    this.loading = true;
    this.bindNewMessageToast();
    if (this.inboxService.conversations) {
      this.onInboxReady(this.inboxService.conversations);
    } else {
      this.eventService.subscribe(EventService.INBOX_LOADED, (conversations: InboxConversation[]) => {
        this.onInboxReady(conversations);
      });
    }
  }

  private onInboxReady(conversations) {
    this.conversations = conversations;
    this.loading = false;
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
}
