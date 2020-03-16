import { Component, Input, OnInit } from '@angular/core';

import { MessageComponent } from '../message.component';
import { eq } from 'lodash-es';
import { InboxItem, InboxUser, MessageType } from '../../model';

@Component({
  selector: 'tsl-third-voice-message',
  templateUrl: './third-voice-message.component.html',
  styleUrls: ['./third-voice-message.component.scss', '../message.component.scss']
})
export class ThirdVoiceMessageComponent extends MessageComponent implements OnInit {

  @Input() user: InboxUser;
  @Input() item: InboxItem;

  ngOnInit() {
    super.ngOnInit();
  }

  public isReview(): boolean {
    return eq(this.message.type, MessageType.REVIEW);
  }
}
