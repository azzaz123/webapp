import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { InboxMessage } from '@private/features/chat/core/model';

@Component({
  selector: 'tsl-third-voice-shipping-keywords',
  templateUrl: './third-voice-shipping-keywords.component.html',
  styleUrls: ['./third-voice-shipping-keywords.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThirdVoiceShippingKeywordsComponent {
  @Input() message: InboxMessage;
  @Input() shortMessage = false;
}
