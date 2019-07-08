import { Component, Input } from '@angular/core';
import { InboxMessage } from '../inbox-message';
import { InboxConversation } from '../../inbox/inbox-conversation';

@Component({
  selector: 'tsl-third-voice-message',
  templateUrl: './third-voice-message.component.html',
  styleUrls: ['./third-voice-message.component.scss', '../message.component.scss']
})
export class ThirdVoiceMessageComponent {

  @Input() message: InboxMessage;
  @Input() currentConversation: InboxConversation;
}
