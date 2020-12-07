import { Component, Input } from '@angular/core';
import { InboxMessage, MessageType } from '@features/chat/core/model';

@Component({
  selector: 'tsl-third-voice-drop-price',
  templateUrl: './third-voice-drop-price.component.html',
  styleUrls: ['./third-voice-drop-price.component.scss'],
})
export class ThirdVoiceDropPriceComponent {
  public static ALLOW_MESSAGES_TYPES = [
    MessageType.PRICE_DROP,
    MessageType.DROP_PRICE,
  ];

  @Input() message: InboxMessage;
  @Input() shortMessage = false;
}
