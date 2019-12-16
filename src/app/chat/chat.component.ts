import { Component, OnInit } from '@angular/core';
import { InboxService } from '../core/inbox/inbox.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'tsl-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public inboxFeatureflagValue: boolean;
  public featureFlagLoaded = false;

  constructor(private inboxService: InboxService) { }

  ngOnInit() {
    this.inboxService.getInboxFeatureFlag$()
      .pipe(finalize(() => this.featureFlagLoaded = true))
      .subscribe(val => {
        this.inboxFeatureflagValue = val;
      });
  }
}
