import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { I18nService } from '../../core/i18n/i18n.service';
import { RealTimeService } from '../../core/message/real-time.service';
import { InboxConversation } from '../model';

@Injectable()
export class MessageService {

  public totalUnreadMessages$: Subject<number> = new Subject<number>();
  private _totalUnreadMessages = 0;

  constructor(private realTime: RealTimeService,
              private i18n: I18nService) {
  }

  set totalUnreadMessages(value: number) {
    value = Math.max(value, 0);
    this._totalUnreadMessages = value;
    this.totalUnreadMessages$.next(value);
  }

  get totalUnreadMessages(): number {
    return this._totalUnreadMessages;
  }

  public send(conversation: InboxConversation, message: string): string {
    return this.realTime.sendMessage(conversation, message);
  }
}
