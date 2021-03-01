import { InboxMessage, MessagePayload, MessageStatus, MessageType } from '@private/features/chat/core/model';
import { Subject } from 'rxjs';
import { Message } from '../app/core/message/message';
import { OTHER_USER_ID, USER_ID } from './user.fixtures.spec';

export const MESSAGE_MAIN: any = {
  body: 'Message body',
  id: 'iVQYE-1310',
  lang: 'en',
  requestReceipt: true,
  thread: 'w67dl03g3w6x',
  from: USER_ID,
  date: new Date('2016-12-12 13:00').getTime(),
};
export const MESSAGE_MAIN_UPDATED: any = {
  body: 'Message body',
  id: 'random',
  receipt: 'iVQYE-1310',
  lang: 'en',
  requestReceipt: true,
  thread: 'w67dl03g3w6x',
  from: USER_ID,
  date: new Date('2016-12-12 13:02').getTime(),
};

export function createMessagesArray(total: number) {
  const messages: Message[] = [];
  for (let i = 1; i <= total; i++) {
    messages.push(new Message(`${MESSAGE_MAIN.id}${i}`, MESSAGE_MAIN.thread, MESSAGE_MAIN.body, MESSAGE_MAIN.from, new Date()));
  }
  return messages;
}

export function createInboxMessagesArray(total: number) {
  const messages: InboxMessage[] = [];
  for (let i = 1; i <= total; i++) {
    messages.push(
      new InboxMessage(
        `${MESSAGE_MAIN.id}${i}`,
        MESSAGE_MAIN.thread,
        MESSAGE_MAIN.body,
        MESSAGE_MAIN.from,
        true,
        new Date(),
        MessageStatus.SENT,
        MessageType.TEXT
      )
    );
  }
  return messages;
}

export function createReceivedReceiptsArray(total: number): any {
  const receipts: any[] = [];
  for (let i = 1; i <= total; i++) {
    receipts.push({
      thread: MESSAGE_MAIN.thread,
      messageId: `${MESSAGE_MAIN.id}${i}`,
      from: OTHER_USER_ID,
      to: MESSAGE_MAIN.from,
      fromSelf: false,
      timestamp: new Date().getTime(),
    });
  }
  return receipts;
}

export const MOCK_MESSAGE: Message = new Message(
  MESSAGE_MAIN.id,
  MESSAGE_MAIN.thread,
  MESSAGE_MAIN.body,
  MESSAGE_MAIN.from,
  MESSAGE_MAIN.date,
  null
);

export const MOCK_MESSAGE_FROM_OTHER: Message = new Message(
  'other-id',
  MESSAGE_MAIN.thread,
  MESSAGE_MAIN.body,
  OTHER_USER_ID,
  MESSAGE_MAIN.date,
  null
);

export const MOCK_RANDOM_MESSAGE: Message = new Message(
  'random',
  MESSAGE_MAIN.thread,
  MESSAGE_MAIN.body,
  MESSAGE_MAIN.from,
  MESSAGE_MAIN.date,
  null
);

export const MOCK_PAYLOAD_OK: MessagePayload = {
  type: 'review',
  text: 'text',
};

export const MOCK_PAYLOAD_KO: MessagePayload = {
  type: 'delivery',
  text: 'text',
};

export class MockUnreadChatMessagesService {
  public totalUnreadMessages$: Subject<number> = new Subject<number>();
  private _totalUnreadMessages = 0;

  set totalUnreadMessages(value: number) {
    value = Math.max(value, 0);
    this._totalUnreadMessages = value;
    this.totalUnreadMessages$.next(value);
  }

  get totalUnreadMessages(): number {
    return this._totalUnreadMessages;
  }
}
