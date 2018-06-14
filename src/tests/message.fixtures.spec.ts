import { USER_ID, OTHE_USER_ID } from './user.fixtures.spec';
import { Message, messageStatus } from '../app/core/message/message';
import { MessagePayload } from '../app/core/message/messages.interface';

export const MESSAGE_MAIN: any = {
  'body': 'Message body',
  'id': 'iVQYE-1310',
  'lang': 'en',
  'requestReceipt': true,
  'thread': 'w67dl03g3w6x',
  'from': USER_ID + '@host',
  'date': new Date('2016-12-12 13:00').getTime()
};
export const MESSAGE_MAIN_UPDATED: any = {
  'body': 'Message body',
  'id': 'random',
  'receipt': 'iVQYE-1310',
  'lang': 'en',
  'requestReceipt': true,
  'thread': 'w67dl03g3w6x',
  'from': USER_ID + '@host',
  'date': new Date('2016-12-12 13:02').getTime()
};

export function createMessagesArray(total: number) {
  const messages: Message[] = [];
  for (let i = 1; i <= total; i++) {
    messages.push(new Message(`${MESSAGE_MAIN.id}${i}`,
      MESSAGE_MAIN.thread,
      MESSAGE_MAIN.body,
      MESSAGE_MAIN.from,
      new Date()));
  }
  return messages;
}

export function createReceiptsArray(total: number, thread: string, date?: string): any {
  const messages: any[] = [];
  for (let i = 1; i <= total; i++) {
    messages.push({
      thread: thread,
      readTimestamp: new Date(date)
    });
  }
  return messages;
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
  OTHE_USER_ID + '@host',
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
  text: 'text'
};

export const MOCK_PAYLOAD_KO: MessagePayload = {
  type: 'delivery',
  text: 'text'
};
