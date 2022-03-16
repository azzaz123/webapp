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
  constructor(private windowMessageService: WindowMessageService, @Inject(WINDOW_TOKEN) private window: Window) {}

  ngOnInit(): void {
    this.sendSuccessMessageToSelfWindow();
    this.closeCurrentWindow();
  }

  private closeCurrentWindow(): void {
    this.window.close();
  }

  private sendSuccessMessageToSelfWindow(): void {
    const successMessage: WindowMessage = { type: WINDOW_MESSAGE_TYPE.SUCCESS };
    this.windowMessageService.send(successMessage, this.window);
  }
}
