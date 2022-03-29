import { Component, Inject, OnInit } from '@angular/core';
import { WINDOW_MESSAGE_TYPE } from '@core/window-message/enums/window-message-type.enum';
import { WindowMessage } from '@core/window-message/interfaces/window-message.interface';
import { WindowMessageService } from '@core/window-message/services/window-message.service';
import { WINDOW_TOKEN } from '@core/window/window.token';

@Component({
  selector: 'tsl-process-complete',
  templateUrl: './process-complete.component.html',
  styleUrls: ['./process-complete.component.scss'],
})
export class ProcessCompleteComponent implements OnInit {
  constructor(@Inject(WINDOW_TOKEN) private window: Window, private windowMessageService: WindowMessageService) {}

  ngOnInit(): void {
    this.sendSuccessMessageToSelfWindow();
    this.sendSuccessMessageToParentWindow();
    this.closeCurrentWindow();
  }

  private get processCompleteMessage(): WindowMessage {
    return { type: WINDOW_MESSAGE_TYPE.PROCESS_COMPLETE };
  }

  private closeCurrentWindow(): void {
    this.window.close();
  }

  private sendSuccessMessageToSelfWindow(): void {
    this.windowMessageService.send(this.processCompleteMessage, this.window);
  }

  private sendSuccessMessageToParentWindow(): void {
    if (this.window.parent) {
      this.windowMessageService.send(this.processCompleteMessage, this.window.parent);
    }
  }
}
