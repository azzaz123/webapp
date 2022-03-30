import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, ViewChild } from '@angular/core';
import { WindowMessageService } from '@core/window-message/services/window-message.service';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tsl-web-view-modal',
  templateUrl: './web-view-modal.component.html',
  styleUrls: ['./web-view-modal.component.scss'],
})
export class WebViewModalComponent implements AfterViewInit, OnDestroy {
  @Input() startUrl: string;
  @Input() title: string;
  @Input() onCloseCallback: Function;
  @ViewChild('webview', { static: true }) webviewElement: ElementRef<HTMLIFrameElement>;

  public readonly CLOSE_ICON_SRC: string = '/assets/icons/cross.svg';
  public readonly CLOSE_ICON_SIZE: number = 16;
  private subscription: Subscription = new Subscription();

  constructor(@Inject(WINDOW_TOKEN) private window, private windowMessageService: WindowMessageService) {}

  ngAfterViewInit() {
    this.iframeRef.setAttribute('src', this.startUrl);
    this.subscription.add(this.windowMessageService.listen(this.window).subscribe(() => this.runOnCloseCallback()));
    try {
      this.subscription.add(this.windowMessageService.listen(this.iframeRef.contentWindow).subscribe(() => this.runOnCloseCallback()));
    } catch {}
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
