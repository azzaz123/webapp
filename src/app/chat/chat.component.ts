import { Component, OnInit } from '@angular/core';
import { InboxService } from '../core/inbox/inbox.service';

@Component({
  selector: 'tsl-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public inboxFeatureflagValue: boolean;

  constructor(private inboxService: InboxService) { }

  ngOnInit() {
    this.inboxService.getInboxFeatureFlag$().subscribe(val => {
      this.inboxFeatureflagValue = val;
    });
  }
}
