import * as _ from 'lodash';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EventService } from '../../../core/event/event.service';
import { InboxConversation } from '../../../core/conversation/conversation';
import { InboxService } from '../../../core/inbox/inbox.service';

@Component({
  selector: 'tsl-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  @Output() public loaded = new EventEmitter<any>();

  public conversations: InboxConversation[] = [];
  private _loading = false;

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
    if (this.inboxService.conversations) {
      this.conversations = this.inboxService.conversations;
      this.loading = false;
    } else {
      this.eventService.subscribe(EventService.INBOX_LOADED, (conversations: InboxConversation[]) => {
        this.conversations = conversations;
        this.loading = false;
      });
    }
  }
}
