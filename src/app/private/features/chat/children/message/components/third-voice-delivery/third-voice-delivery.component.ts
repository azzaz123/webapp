import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { InboxMessage } from '@private/features/chat/core/model';

@Component({
  selector: 'tsl-third-voice-delivery',
  templateUrl: './third-voice-delivery.component.html',
  styleUrls: ['./third-voice-delivery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThirdVoiceDeliveryComponent implements OnChanges {
  @Input() message: InboxMessage;
  @Input() shortMessage = false;
  @Output() clickedCTA: EventEmitter<void> = new EventEmitter<void>();

  public isCTAVisible: boolean = true;

  ngOnChanges(): void {
    this.isCTAVisible = this.showCTA;
  }

  private get showCTA(): boolean {
    return !!this.message.payload;
  }

  public handleClickCTA(): void {
    this.clickedCTA.emit();
  }
}
