import { Component, Input } from '@angular/core';
import { InboxItem, InboxUser, MessageType } from '@private/features/chat/core/model';
import { eq } from 'lodash-es';
import { MessageComponent } from '../../message.component';

@Component({
  selector: 'tsl-third-voice-message',
  templateUrl: './third-voice-message.component.html',
  styleUrls: ['./third-voice-message.component.scss', '../../message.component.scss'],
})
export class ThirdVoiceMessageComponent extends MessageComponent {
  @Input() user: InboxUser;
  @Input() item: InboxItem;

  public isReview(): boolean {
    return eq(this.message.type, MessageType.REVIEW);
  }
}
