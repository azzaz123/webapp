import { Component, Input } from '@angular/core';
import {
  InboxItem,
  InboxMessage,
  InboxUser,
  MessageType,
} from '@features/chat/core/model';
import { eq } from 'lodash-es';

@Component({
  selector: 'tsl-third-voice-review',
  templateUrl: './third-voice-review.component.html',
  styleUrls: ['./third-voice-review.component.scss'],
})
export class ThirdVoiceReviewComponent {
  public static ALLOW_MESSAGES_TYPES = [MessageType.REVIEW];

  @Input() message: InboxMessage;
  @Input() user: InboxUser;
  @Input() item: InboxItem;
  @Input() shortMessage = false;

  public isReview(): boolean {
    return eq(this.message.type, MessageType.REVIEW);
  }
}
