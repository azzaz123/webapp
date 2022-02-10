import { Component } from '@angular/core';
import { MessageType } from '@private/features/chat/core/model';
import { MessageComponent } from '../../message.component';

@Component({
  selector: 'tsl-third-voice-message',
  templateUrl: './third-voice-message.component.html',
  styleUrls: ['./third-voice-message.component.scss', '../../message.component.scss'],
})
export class ThirdVoiceMessageComponent extends MessageComponent {
  public isReview(): boolean {
    return this.message.type === MessageType.REVIEW;
  }
}
