import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { WindowMessage } from '../interfaces/window-message.interface';
import { WindowMessageWrapper } from '../interfaces/window-message-wrapper.interface';

@Injectable({
  providedIn: 'root',
})
export class WindowMessageService {
  constructor() {}

  public send(message: WindowMessage, windowReference: Window): void {
    const wrappedMessage = this.generateMessageFromPayload(message);
    this.sendMessageToWindow(wrappedMessage, windowReference);
  }

  public listen(windowReference: Window): Observable<WindowMessage> {
    return fromEvent(windowReference, 'message').pipe(
      map((messageEvent: MessageEvent) => messageEvent.data),
      filter(this.isValidMessage),
      map((message) => message.payload)
    );
  }

  private sendMessageToWindow(message: WindowMessageWrapper, windowReference: Window): void {
    const allOriginsInWindow: string = '*';
    windowReference.postMessage(message, allOriginsInWindow);
  }

  private isValidMessage(messageBody: unknown): messageBody is WindowMessageWrapper {
    return (messageBody as WindowMessageWrapper)?.fromWallapop;
  }

  private generateMessageFromPayload(payload: WindowMessage): WindowMessageWrapper {
    const message: WindowMessageWrapper = {
      payload,
      fromWallapop: true,
    };
    return message;
  }
}
