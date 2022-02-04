import { Component, Input } from '@angular/core';
import { InboxMessage } from '@private/features/chat/core/model';

@Component({
  selector: 'tsl-third-voice-delivery',
  templateUrl: './third-voice-delivery.component.html',
  styleUrls: ['./third-voice-delivery.component.scss'],
})
export class ThirdVoiceDeliveryComponent {
  @Input() message: InboxMessage;
  @Input() shortMessage = false;
}
