import { MsgArchiveResponse, ReceivedReceipt, ReadReceipt } from '../app/core/message/archive.interface';
import { Message } from '../app/core/message/message';
import { MessagePayload } from '../app/core/message/messages.interface';
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

export const MOCK_RECEIVED_RECEIPTS: ReceivedReceipt[] = [{
  thread: MOCK_MESSAGES_ARRAY[0].conversationId,
  messageId: MOCK_MESSAGES_ARRAY[0].id,
  from: OTHER_USER_ID,
  to: USER_ID,
  fromSelf: true,
  timestamp: new Date(MOCK_MESSAGES_ARRAY[0].date).getTime() + 1000
},
{
  thread: MOCK_MESSAGES_ARRAY[1].conversationId,
  messageId: MOCK_MESSAGES_ARRAY[1].id,
  from: USER_ID,
  to: OTHER_USER_ID,
  fromSelf: true,
  timestamp: new Date(MOCK_MESSAGES_ARRAY[1].date).getTime() + 1000
},
{
  thread: MOCK_MESSAGES_ARRAY[2].conversationId,
  messageId: MOCK_MESSAGES_ARRAY[2].id,
  from: OTHER_USER_ID,
  to: USER_ID,
  fromSelf: true,
  timestamp: new Date(MOCK_MESSAGES_ARRAY[2].date).getTime() + 1000
}];

export const MOCK_READ_RECEIPTS: ReadReceipt[] = [{
  thread: MOCK_MESSAGES_ARRAY[0].conversationId,
  to: USER_ID,
  timestamp: new Date(MOCK_MESSAGES_ARRAY[0].date).getTime() + 2000
},
{
  thread: MOCK_MESSAGES_ARRAY[0].conversationId,
  to: OTHER_USER_ID,
  timestamp: new Date(MOCK_MESSAGES_ARRAY[0].date).getTime() + 4000
},
{
  thread: MOCK_MESSAGES_ARRAY[0].conversationId,
  to: USER_ID,
  timestamp: new Date(MOCK_MESSAGES_ARRAY[1].date).getTime() + 6000
}];

export const MOCK_MSG_ARCHIVE_RESPONSE: MsgArchiveResponse = {
  messages: MOCK_MESSAGES_ARRAY,
  receivedReceipts: MOCK_RECEIVED_RECEIPTS,
  readReceipts: MOCK_READ_RECEIPTS
};

export class MockArchiveService {

  getEventsSince() {}
  getAllEvents() {}

  public messageContructor(id: string, conversationId: string, message: string,
    from: string, date: Date, status: string, payload: MessagePayload, fromSelf: boolean) {

    const msg = new Message(id, conversationId, message, from, date, status, payload);
    msg.fromSelf = fromSelf;
    return msg;
  }
}

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
