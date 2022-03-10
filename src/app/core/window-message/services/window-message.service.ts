import { Inject, Injectable } from '@angular/core';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { fromEvent, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { WindowMessage } from '../interfaces/window-message.interface';
import { WindowMessageWrapper } from '../interfaces/window-message-wrapper.interface';
import { WindowMessageId } from '../types/window-message-id.type';

@Injectable({
  providedIn: 'root',
})
export class WindowMessageService {
  constructor(@Inject(WINDOW_TOKEN) private window: Window) {}

  public send(message: WindowMessage): void {
    const wrappedMessage = this.generateMessageFromPayload(message);
    this.sendMessageToSelf(wrappedMessage);
    this.sendMessageToOpener(wrappedMessage);
  }

  public listen(id: WindowMessageId): Observable<WindowMessage> {
    return fromEvent(this.window, 'message').pipe(
      map((messageEvent: MessageEvent) => messageEvent.data),
      filter(this.isValidMessage),
      map((message) => message.payload),
      filter((message: WindowMessage) => this.isTargetMessage(message, id))
    );
  }

  private get windowOpener(): Window | null {
    return this.window.opener;
  }

  private sendMessageToWindow(windowParam: Window, message: WindowMessageWrapper) {
    const { origin: target } = windowParam;
    windowParam.postMessage(message, target);
  }

  private sendMessageToSelf(message: WindowMessageWrapper): void {
    this.sendMessageToWindow(this.window, message);
  }

  private sendMessageToOpener(message: WindowMessageWrapper): void {
    const opener: Window = this.windowOpener;
    if (opener) {
      this.sendMessageToWindow(opener, message);
    }
  }

  private isValidMessage(messageBody: unknown): messageBody is WindowMessageWrapper {
    return (messageBody as WindowMessageWrapper)?.fromWallapop;
  }

  private isTargetMessage(message: WindowMessage, id: WindowMessageId): boolean {
    return message.id === id;
  }

  private generateMessageFromPayload(payload: WindowMessage): WindowMessageWrapper {
    const message: WindowMessageWrapper = {
      payload,
      fromWallapop: true,
    };
    return message;
  }
}
