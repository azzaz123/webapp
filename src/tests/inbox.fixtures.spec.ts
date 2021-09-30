import {
  InboxConversation,
  InboxItem,
  InboxItemPlaceholder,
  InboxItemStatus,
  InboxMessage,
  InboxUser,
  MessageStatus,
  MessageType,
} from '@private/features/chat/core/model';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { ITEM_ID, MOCK_ITEM } from './item.fixtures.spec';
import { MESSAGE_MAIN } from './message.fixtures.spec';
import { OTHER_USER_ID, USER_ID } from './user.fixtures.spec';

export const CONVERSATION_ID: string = MESSAGE_MAIN.thread;
export const CONVERSATION_PHONE = '123.456.789';

export const MOCK_INBOX_API_RESPONSE = `{
    "user_hash": "mxzorp9np7z9",
    "page": 1,
    "next_from": "p61y8o5np265-7v6gwyklr5ze",
    "conversations": [
        {
            "hash": "p61y8o5np265",
            "with_user": {
                "hash": "7v6gwyklr5ze",
                "slug": "wallacars-56047883",
                "name": "John D.",
                "image_url": "http://cdn-beta.wallapop.com/images/13/16/sp/__/c13p71883041/i413962112.jpg?pictureSize=W640",
                "response_rate" : "less than a day",
                "score" : 20,
                "blocked": false,
                "available": true,
                "location" : {
                    "latitude": 37.39266063798759,
                    "longitude": -5.977606016287523
                }
            },
            "item": {
                "hash": "9nz0nlmkyv6o",
                "title": "Camiseta",
                "price": {
                    "amount": "12.45",
                    "currency": "€"
                },
                "status": "RESERVED",
                "image_url": "http://cdn-beta.wallapop.com/images/10420/30/yi/__/c10420p183008817/i413212126.jpg?pictureSize=W320"
            },
            "phone_shared": true,
            "unread_messages": 1,
            "messages": {
                "next_from": "220382881010",
                "messages": [
                        {
                            "id": "20394401-ec61-4032-9eee-e79441fae457",
                            "from_self": true,
                            "text": "Vale gracias",
                            "timestamp": "2019-01-28T08:00:20.573038Z",
                            "status": "read",
                            "type": "text",
                            "payload": {
                            }
                        },
                        {
                            "id": "df9455bd-9d3f-4315-abdc-c7c230932347",
                            "from_self": true,
                            "text": "Por cuanto vale?",
                            "timestamp": "2019-01-28T08:02:20.573038Z",
                            "status": "read",
                            "type": "text",
                            "payload": {
                            }
                        },
                        {
                            "id": "b034a784-2702-4517-99cd-1268ba7d1cb7",
                            "from_self": false,
                            "text": "€20",
                            "timestamp": "2019-01-28T08:45:20.573038Z",
                            "status": "read",
                            "type": "text",
                            "payload": {
                            }
                        },
                        {
                            "id": "2bc9b35e-3d17-4044-91b7-20d52884bc1c",
                            "from_self": true,
                            "text": "Te va bien?",
                            "timestamp": "2019-01-28T08:47:20.573038Z",
                            "status": "read",
                            "type": "text",
                            "payload": {
                            }
                        },
                        {
                            "id": "02E8347D-526B-4042-8AA8-A7F343488D12",
                            "from_self": false,
                            "text": "Vale gracias",
                            "timestamp": "2019-01-28T09:00:20.573038Z",
                            "status": "read",
                            "type": "text",
                            "payload": {
                            }
                        }
                ]
            }
        },
        {
            "hash": "pzp9qx0yd963",
            "with_user": {
                "hash": "xpzp3dpqnk63",
                "slug": "johnnycash-56047883",
                "name": "John D.",
                "image_url": "http://cdn-beta.wallapop.com/images/13/16/sp/__/c13p71883041/i413962112.jpg?pictureSize=W640",
                "response_rate" : "unknown",
                "score" : 100,
                "blocked": false,
                "available": false,
                "location" : {
                    "latitude": 19.39266063798759,
                    "longitude": -18.977606016287523
                }
            },
            "item": {
                "hash": "xpzplp4q1563",
                "title": "Bottle of Chato wine",
                "price": {
                    "amount": "111",
                    "currency": "€"
                },
                "status": "SOLD",
                "image_url": "http://cdn-beta.wallapop.com/images/10420/31/ao/__/c10420p183576804/i413792104.jpg?pictureSize=W320"
            },
            "phone_shared": false,
            "unread_messages": 0,
            "messages": {
                "messages": [
                        {
                        "id": "58AC7C92-1441-4D65-A05B-3FF1EABE48E2",
                        "from_self": true,
                        "text": "Vale perfecto",
                        "timestamp": "2019-01-28T08:44:01.571872Z",
                        "status": "sent",
                        "type": "text",
                        "payload": {
                        }
                        }
                ]
             }
        }
    ]
  }`;
export const MOCK_INBOX_CONVERSATION = JSON.parse(MOCK_INBOX_API_RESPONSE).conversations[0];
export const INBOX_CONVERSATION_DATE: Date = new Date();

const apiConvUser = MOCK_INBOX_CONVERSATION.with_user;
let mockInboxUser = new InboxUser(
  OTHER_USER_ID,
  apiConvUser.name,
  apiConvUser.blocked,
  apiConvUser.available,
  apiConvUser.slug,
  apiConvUser.avatar_url,
  apiConvUser.response_rate,
  apiConvUser.sellingItem,
  apiConvUser.sellingItemCount,
  apiConvUser.scoring,
  apiConvUser.location,
  undefined,
  false
);
let mockInboxItem = new InboxItem(
  ITEM_ID,
  null,
  'Some item',
  null,
  null,
  InboxItemStatus.PUBLISHED,
  false,
  CATEGORY_IDS.CELL_PHONES_ACCESSORIES
);
const mockInboxMessages = MOCK_INBOX_CONVERSATION.messages.messages
  .filter((m) => m.type === 'text')
  .map(
    (m) =>
      new InboxMessage(
        m.id,
        MOCK_INBOX_CONVERSATION.hash,
        m.text,
        m.from_self ? USER_ID : MOCK_INBOX_CONVERSATION.with_user ? MOCK_INBOX_CONVERSATION.with_user.hash : null,
        m.from_self,
        new Date(m.timestamp),
        m.status,
        m.payload
      )
  );

export const CREATE_MOCK_INBOX_CONVERSATION: Function = (
  id: string = CONVERSATION_ID,
  userId: string = OTHER_USER_ID
): InboxConversation => {
  const inboxMessages = MOCK_INBOX_CONVERSATION.messages.messages
    .filter((m) => m.type === 'text')
    .map(
      (m) =>
        new InboxMessage(
          m.id,
          MOCK_INBOX_CONVERSATION.hash,
          m.text,
          m.from_self ? USER_ID : MOCK_INBOX_CONVERSATION.with_user ? MOCK_INBOX_CONVERSATION.with_user.hash : null,
          m.from_self,
          new Date(m.timestamp),
          m.status,
          m.payload
        )
    );

  mockInboxItem = new InboxItem(
    ITEM_ID,
    { amount: 100, currency: '€' },
    'Some item',
    null,
    null,
    InboxItemStatus.PUBLISHED,
    false,
    CATEGORY_IDS.CELL_PHONES_ACCESSORIES
  );
  mockInboxUser = new InboxUser(
    userId,
    apiConvUser.name,
    apiConvUser.blocked,
    apiConvUser.available,
    apiConvUser.slug,
    apiConvUser.avatar_url,
    apiConvUser.response_rate,
    apiConvUser.scoring,
    0,
    0,
    {},
    undefined,
    false
  );
  const next_from = MOCK_INBOX_CONVERSATION.messages.next_from ? MOCK_INBOX_CONVERSATION.messages.next_from : null;

  return new InboxConversation(
    id,
    inboxMessages[0].date,
    mockInboxUser,
    mockInboxItem,
    next_from,
    inboxMessages,
    false,
    null,
    0,
    inboxMessages[0]
  );
};

export const CREATE_MOCK_INBOX_CONVERSATION_WITH_EMPTY_MESSAGE: Function = (
  id: string = CONVERSATION_ID,
  userId: string = OTHER_USER_ID
) => {
  const conv = CREATE_MOCK_INBOX_CONVERSATION(id, userId);
  conv.messages = [];
  return conv;
};

export const SECOND_MOCK_INBOX_CONVERSATION: InboxConversation = new InboxConversation(
  'secondId',
  INBOX_CONVERSATION_DATE,
  mockInboxUser,
  mockInboxItem,
  null,
  mockInboxMessages,
  false,
  null,
  0,
  mockInboxMessages[0]
);
export const MOCKED_INBOX_CONVERSATIONS: InboxConversation[] = [CREATE_MOCK_INBOX_CONVERSATION(), SECOND_MOCK_INBOX_CONVERSATION];
export const NOT_FOUND_INBOX_CONVERSATION_ID = 'notFound';
export const MOCK_NOT_FOUND_INBOX_CONVERSATION: InboxConversation = new InboxConversation(
  NOT_FOUND_INBOX_CONVERSATION_ID,
  INBOX_CONVERSATION_DATE,
  mockInboxUser,
  mockInboxItem,
  null,
  mockInboxMessages,
  false,
  null
);

export function createInboxConversationsArray(total: number, conversationsId?: string): InboxConversation[] {
  const conversations: InboxConversation[] = [];
  for (let i = 1; i <= total; i++) {
    conversations.push(CREATE_MOCK_INBOX_CONVERSATION(conversationsId ? i + conversationsId : i.toString(), OTHER_USER_ID));
  }
  return conversations;
}

export const MOCK_INBOX_USER = new InboxUser(
  'xpzp3dpqnk63',
  'John D.',
  false,
  true,
  'johnnycash-56047883',
  'http://cdn-beta.wallapop.com/images/13/16/sp/__/c13p71883041/i413962112.jpg?pictureSize=W640',
  'unknown',
  MOCK_ITEM,
  100,
  100,
  {
    latitude: 19.39266063798759,
    longitude: -18.977606016287523,
  },
  5,
  false
);

export const MOCK_UNSUBSCRIBED_INBOX_USER = new InboxUser(
  'xpzp3dpqnk63',
  'John D.',
  false,
  false,
  'johnnycash-56047883',
  'http://cdn-beta.wallapop.com/images/13/16/sp/__/c13p71883041/i413962112.jpg?pictureSize=W640',
  'unknown',
  MOCK_ITEM,
  100,
  100,
  {
    latitude: 19.39266063798759,
    longitude: -18.977606016287523,
  },
  5,
  false
);

export const MOCK_MALICIOUS_INBOX_USER = new InboxUser(
  'xpzp3dpqnk63',
  'John D.',
  false,
  false,
  'johnnycash-56047883',
  'http://cdn-beta.wallapop.com/images/13/16/sp/__/c13p71883041/i413962112.jpg?pictureSize=W640',
  'unknown',
  MOCK_ITEM,
  100,
  100,
  {
    latitude: 19.39266063798759,
    longitude: -18.977606016287523,
  },
  5,
  true
);

export const MOCK_INBOX_ITEM: InboxItem = InboxItemPlaceholder;

export const MOCK_INBOX_MESSAGE: InboxMessage = new InboxMessage(
  'msg1',
  'abcd',
  'Llumeta',
  USER_ID,
  false,
  new Date(),
  MessageStatus.RECEIVED,
  MessageType.TEXT
);

export const MOCK_INBOX_MESSAGE_2: InboxMessage = new InboxMessage(
  'msg2',
  'abcd',
  'Verda',
  USER_ID,
  false,
  new Date(),
  MessageStatus.RECEIVED,
  MessageType.TEXT
);

export const MOCK_INBOX_MESSAGES: InboxMessage[] = [MOCK_INBOX_MESSAGE, MOCK_INBOX_MESSAGE_2];
export const MOCK_INBOX_TRANSLATED_MESSAGES: InboxMessage[] = MOCK_INBOX_MESSAGES.map(
  ({ id, thread, text, from, fromSelf, date, status, type }) => {
    const message = new InboxMessage(id, thread, text, from, fromSelf, date, status, type);
    message.translation = `Translation: ${text}`;
    return message;
  }
);

export const MOCK_INBOX_CONVERSATION_BASIC: InboxConversation = new InboxConversation(
  'abcd',
  new Date(),
  MOCK_INBOX_USER,
  MOCK_INBOX_ITEM,
  'bli',
  MOCK_INBOX_MESSAGES,
  false,
  CONVERSATION_PHONE,
  288,
  MOCK_INBOX_MESSAGES[0]
);

export const MOCK_INBOX_CONVERSATION_WITH_UNSUBSCRIBED_USER: InboxConversation = new InboxConversation(
  'abcd',
  new Date(),
  MOCK_UNSUBSCRIBED_INBOX_USER,
  MOCK_INBOX_ITEM,
  'bli',
  MOCK_INBOX_MESSAGES,
  false,
  CONVERSATION_PHONE,
  288,
  MOCK_INBOX_MESSAGES[0]
);

export const MOCK_INBOX_CONVERSATION_WITH_MALICIOUS_USER: InboxConversation = new InboxConversation(
  'abcd',
  new Date(),
  MOCK_MALICIOUS_INBOX_USER,
  MOCK_INBOX_ITEM,
  'bli',
  MOCK_INBOX_MESSAGES,
  false,
  CONVERSATION_PHONE,
  288,
  MOCK_INBOX_MESSAGES[0]
);

export const MOCK_INBOX_TRANSLATABLE_CONVERSATION: InboxConversation = new InboxConversation(
  'abcd',
  new Date(),
  MOCK_MALICIOUS_INBOX_USER,
  MOCK_INBOX_ITEM,
  'bli',
  MOCK_INBOX_MESSAGES,
  false,
  CONVERSATION_PHONE,
  288,
  MOCK_INBOX_MESSAGES[0],
  true
);

export const MOCK_INBOX_TRANSLATABLE_CONVERSATION_ALREADY_TRANSLATED: InboxConversation = new InboxConversation(
  'abcd',
  new Date(),
  MOCK_INBOX_USER,
  MOCK_INBOX_ITEM,
  'bli',
  MOCK_INBOX_TRANSLATED_MESSAGES,
  false,
  CONVERSATION_PHONE,
  288,
  MOCK_INBOX_TRANSLATED_MESSAGES[0],
  true
);

export const MOCK_INBOX_TRANSLATABLE_CONVERSATION_MARKED_TO_TRANSLATE_AUTOMATICALLY: InboxConversation = new InboxConversation(
  'abcd',
  new Date(),
  MOCK_INBOX_USER,
  MOCK_INBOX_ITEM,
  'bli',
  MOCK_INBOX_TRANSLATED_MESSAGES,
  false,
  CONVERSATION_PHONE,
  288,
  MOCK_INBOX_TRANSLATED_MESSAGES[0],
  true
);
MOCK_INBOX_TRANSLATABLE_CONVERSATION_MARKED_TO_TRANSLATE_AUTOMATICALLY.isAutomaticallyTranslatable = true;
