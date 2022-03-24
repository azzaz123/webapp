import { AfterViewInit, Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { WindowMessageService } from '@core/window-message/services/window-message.service';
import { WINDOW_TOKEN } from '@core/window/window.token';

@Component({
  selector: 'tsl-web-view-modal',
  templateUrl: './web-view-modal.component.html',
  styleUrls: ['./web-view-modal.component.scss'],
})
export class WebViewModalComponent implements AfterViewInit {
  @Input() startUrl: string;
  @Input() width: number;
  @Input() height: number;
  @Input() title: string;
  @Input() onCloseCallback: Function;
  @ViewChild('webview', { static: true }) webviewElement: ElementRef<HTMLIFrameElement>;

  public readonly CLOSE_ICON_SRC: string = '/assets/icons/cross.svg';
  public readonly CLOSE_ICON_SIZE: number = 16;

  constructor(@Inject(WINDOW_TOKEN) private window, private windowMessageService: WindowMessageService) {}

  ngAfterViewInit() {
    this.iframeRef.setAttribute('src', this.startUrl);
    this.iframeRef.setAttribute('style', `min-width: ${this.width}px; min-height: ${this.height}px; border: 0`);
    this.windowMessageService.listen(this.window).subscribe(() => this.runOnCloseCallback());
    try {
      this.windowMessageService.listen(this.iframeRef.contentWindow).subscribe(() => this.runOnCloseCallback());
    } catch {}
  }

  public runOnCloseCallback(): void {
    if (!!this.onCloseCallback) {
      this.onCloseCallback(true);
    }
  }

  private get iframeRef(): HTMLIFrameElement {
    return this.webviewElement.nativeElement;
  }
}
