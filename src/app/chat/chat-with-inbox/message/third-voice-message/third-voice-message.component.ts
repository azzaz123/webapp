import { Component, Input, OnInit } from '@angular/core';

import { MessageComponent } from '../message.component';
import { MessageType } from '../inbox-message';
import { InboxItem, InboxUser } from '../../inbox';
import * as _ from 'lodash';

@Component({
  selector: 'tsl-third-voice-message',
  templateUrl: './third-voice-message.component.html',
  styleUrls: ['./third-voice-message.component.scss', '../message.component.scss']
})
export class ThirdVoiceMessageComponent extends MessageComponent implements OnInit {

  public static ALLOW_MESSAGES_TYPES = [MessageType.PRICE_DROP, MessageType.REVIEW];

  @Input() user: InboxUser;
  @Input() item: InboxItem;

  ngOnInit() {
    super.ngOnInit();
  }

  public isReview(): boolean {
    return _.eq(this.message.type, MessageType.REVIEW);
  }
}
