import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WindowMessage } from '@core/window-message/interfaces/window-message.interface';
import { WindowMessageService } from '@core/window-message/services/window-message.service';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { PUBLIC_PATH_PARAMS } from '@public/public-routing-constants';

@Component({
  selector: 'tsl-process-complete',
  templateUrl: './process-complete.component.html',
  styleUrls: ['./process-complete.component.scss'],
})
export class ProcessCompleteComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private windowMessageService: WindowMessageService,
    @Inject(WINDOW_TOKEN) private window: Window
  ) {}

  ngOnInit(): void {
    const isNotIdInUrl: boolean = !this.id;
    if (isNotIdInUrl) {
      return this.closeCurrentWindow();
    }

    const windowDoesNotHaveOpener: boolean = !this.windowOpener;
    if (windowDoesNotHaveOpener) {
      return this.closeCurrentWindow();
    }

    this.sendSuccessMessage();
    this.closeCurrentWindow();
  }

  private get id(): string {
    return this.route.snapshot.paramMap.get(PUBLIC_PATH_PARAMS.ID);
  }

  private get windowOpener(): Window {
    return this.window.opener;
  }

  private closeCurrentWindow(): void {
    this.window.close();
  }

  private sendSuccessMessage(): void {
    const success: WindowMessage = { id: this.id };
    this.windowMessageService.send(success);
  }
}
