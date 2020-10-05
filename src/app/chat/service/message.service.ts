import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Conversation } from '../../core/conversation/conversation';
import { Message } from '../../core/message/message';
import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user';
import { I18nService } from '../../core/i18n/i18n.service';
import { RealTimeService } from '../../core/message/real-time.service';
import { InboxConversation } from '../model';

@Injectable()
export class MessageService {

  public totalUnreadMessages$: Subject<number> = new Subject<number>();
  private _totalUnreadMessages = 0;

  constructor(private realTime: RealTimeService,
              private userService: UserService,
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

  public createPhoneNumberMessage(conversation, phone) {
    const message = this.i18n.getTranslations('phoneMessage') + phone;
    this.realTime.sendMessage(conversation, message);
  }
}
