import { Message } from '../app/core/message/message';
import { MESSAGE_MAIN } from './message.fixtures.spec';
import { OTHER_USER_ID, USER_ID } from './user.fixtures.spec';
import { CONVERSATION_ID } from './conversation.fixtures.spec';

export function createMockMessagesArray(count: number): Message[] {
  const messages: Message[] = [];
  for (let i = 1; i <= count; i++) {
    const message = new Message(`${MESSAGE_MAIN.id}${i}`,
    MESSAGE_MAIN.thread,
    MESSAGE_MAIN.body,
    i % 2 ? USER_ID : OTHER_USER_ID,
    new Date(new Date(MESSAGE_MAIN.date).getTime() + (100000 * i)));

  message.fromSelf = i % 2 ? true : false;
  messages.push(message);
  }
  return messages;
}

export const MOCK_MESSAGES_ARRAY = createMockMessagesArray(5);

export function createMockMessageEvents(count: number) {
  const response = [];
  for (let i = 0; i < count; i++) {
    const event = {
      event: {
        body: 'abc-' + i,
        conversation_hash: CONVERSATION_ID,
        created_ts: '153597932' + i + '.000000',
        from_user_hash: i % 2 ? OTHER_USER_ID : USER_ID,
        message_id: 'msgid-' + i,
        to_user_hash: i % 2 ? USER_ID : OTHER_USER_ID,
        type: 'message'
      },
      id: 'msgid-' + i,
      ts: '153597932' + i + '.100000',
      type: 'chat.message.created'
    };
    response.push(event);
  }
  return response;
}

export function createMockReceivedEvents(count: number) {
  const response = [];
  for (let i = 0; i < count; i++) {
    const event = {
      event: {
        conversation_hash: CONVERSATION_ID,
        created_ts: '153597922' + i + '.000000',
        from_user_hash: i % 2 ? USER_ID : OTHER_USER_ID,
        message_id: 'msgid-' + i,
        to_user_hash: i % 2 ? OTHER_USER_ID : USER_ID,
      },
      id: 'msgid-' + i,
      ts: '153597922' + i + '.100000',
      type: 'chat.message.received'
    };
    response.push(event);
  }
  return response;
}

export function createMockReadEvents(count: number) {
  const response = [];
  for (let i = 0; i < count ; i++) {
    const receipt = {
      event: {
        conversation_hash: CONVERSATION_ID,
        created_ts: '153597942' + i + '.000000',
        to_user_hash: i % 2 ? USER_ID : OTHER_USER_ID
      },
      id: 'id-' + i,
      type: 'chat.conversation.read',
      ts: '153597942' + i + '.100000'
    };
    response.push(receipt);
  }

  return response;
}
