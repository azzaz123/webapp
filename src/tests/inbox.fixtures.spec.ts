import { InboxConversation } from '../app/chat/chat-with-inbox/inbox/inbox-conversation/inbox-conversation';
import { InboxUser } from '../app/chat/chat-with-inbox/inbox/inbox-user';
import { InboxItem, INBOX_ITEM_STATUSES } from '../app/chat/chat-with-inbox/inbox/inbox-item';
import { InboxMessage } from '../app/chat/chat-with-inbox/message/inbox-message';
import { MESSAGE_MAIN } from './message.fixtures.spec';
import { OTHER_USER_ID } from './user.fixtures.spec';
import { ITEM_ID } from './item.fixtures.spec';
import { CONVERSATION_DATE } from './conversation.fixtures.spec';

export const CONVERSATION_ID: string = MESSAGE_MAIN.thread;
export const CONVERSATION_PHONE = '123.456.789';

export const MOCK_INBOX_API_RESPONSE = `{
    "user_hash": "mxzorp9np7z9",
    "page": 1,
    "page_size": 1000,
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
            "messages": [
                {
                    "id": "20394401-ec61-4032-9eee-e79441fae457",
                    "from_user_hash": "mxzorp9np7z9",
                    "to_user_hash": "7v6gwyklr5ze",
                    "text": "Vale gracias",
                    "timestamp": "2019-01-28T08:00:20.573038Z",
                    "status": "read",
                    "type": "text",
                    "payload": {
                    }
                },
                {
                    "id": "df9455bd-9d3f-4315-abdc-c7c230932347",
                    "from_user_hash": "7v6gwyklr5ze",
                    "to_user_hash": "mxzorp9np7z9",
                    "text": "Por cuanto vale?",
                    "timestamp": "2019-01-28T08:02:20.573038Z",
                    "status": "read",
                    "type": "text",
                    "payload": {
                    }
                },
                {
                    "id": "b034a784-2702-4517-99cd-1268ba7d1cb7",
                    "from_user_hash": "mxzorp9np7z9",
                    "to_user_hash": "7v6gwyklr5ze",
                    "text": "€20",
                    "timestamp": "2019-01-28T08:45:20.573038Z",
                    "status": "read",
                    "type": "text",
                    "payload": {
                    }
                },
                {
                    "id": "2bc9b35e-3d17-4044-91b7-20d52884bc1c",
                    "from_user_hash": "7v6gwyklr5ze",
                    "to_user_hash": "mxzorp9np7z9",
                    "text": "Te va bien?",
                    "timestamp": "2019-01-28T08:47:20.573038Z",
                    "status": "read",
                    "type": "text",
                    "payload": {
                    }
                },
                {
                    "id": "02E8347D-526B-4042-8AA8-A7F343488D12",
                    "from_user_hash": "mxzorp9np7z9",
                    "to_user_hash": "7v6gwyklr5ze",
                    "text": "Vale gracias",
                    "timestamp": "2019-01-28T09:00:20.573038Z",
                    "status": "read",
                    "type": "text",
                    "payload": {
                    }
                }
            ]
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
            "messages": [
                {
                    "id": "58AC7C92-1441-4D65-A05B-3FF1EABE48E2",
                    "from_user_hash": "mxzorp9np7z9",
                    "to_user_hash": "xpzp3dpqnk63",
                    "text": "Vale perfecto",
                    "timestamp": "2019-01-28T08:44:01.571872Z",
                    "status": "sent",
                    "type": "text",
                    "payload": {
                    }
                }
            ]
        }
    ]
  }`;
  export const MOCK_INBOX_CONVERSATION = JSON.parse(MOCK_INBOX_API_RESPONSE).conversations[0];
  export const INBOX_CONVERSATION_DATE: Date = new Date();

const apiConvUser = MOCK_INBOX_CONVERSATION.with_user;
let mockInboxUser = new InboxUser(OTHER_USER_ID, apiConvUser.name, apiConvUser.blocked, apiConvUser.available, apiConvUser.slug,
    apiConvUser.avatar_url, apiConvUser.response_rate, apiConvUser.scoring);
let mockInboxItem = new InboxItem(ITEM_ID, null, 'Some item', null, INBOX_ITEM_STATUSES.published);
const mockInboxMessages = MOCK_INBOX_CONVERSATION.messages.filter(m => m.type === 'text')
.map(m => new InboxMessage(m.id, MOCK_INBOX_CONVERSATION.hash, m.text,
  m.from_user_id, m.from_user_hash === this.selfId, new Date(m.timestamp), m.status, m.payload));

export const CREATE_MOCK_INBOX_CONVERSATION: Function = (
    id: string = CONVERSATION_ID,
    userId: string = OTHER_USER_ID,
    date: Date = INBOX_CONVERSATION_DATE): InboxConversation => {
        const inboxMessages = MOCK_INBOX_CONVERSATION.messages.filter(m => m.type === 'text')
        .map(m => new InboxMessage(m.id, MOCK_INBOX_CONVERSATION.hash, m.text, m.from_user_id,
            m.from_user_hash === this.selfId, new Date(m.timestamp), m.status, m.payload));

    mockInboxItem = new InboxItem(ITEM_ID, null, 'Some item', null, INBOX_ITEM_STATUSES.published);
    mockInboxUser = new InboxUser(userId, apiConvUser.name, apiConvUser.blocked, apiConvUser.available, apiConvUser.slug,
        apiConvUser.avatar_url, apiConvUser.response_rate, apiConvUser.scoring);

      return new InboxConversation(id, date, mockInboxUser, mockInboxItem, inboxMessages, false, 0, inboxMessages[0]);
};


export const SECOND_MOCK_INBOX_CONVERSATION: InboxConversation = new InboxConversation('secondId', INBOX_CONVERSATION_DATE,
mockInboxUser,  mockInboxItem, mockInboxMessages, false, 0, mockInboxMessages[0]);
export const MOCKED_INBOX_CONVERSATIONS: InboxConversation[] = [CREATE_MOCK_INBOX_CONVERSATION(), SECOND_MOCK_INBOX_CONVERSATION];
export const NOT_FOUND_INBOX_CONVERSATION_ID = 'notFound';
export const MOCK_NOT_FOUND_INBOX_CONVERSATION: InboxConversation = new InboxConversation(
  NOT_FOUND_INBOX_CONVERSATION_ID,
  INBOX_CONVERSATION_DATE,
  mockInboxUser,
  mockInboxItem,
  mockInboxMessages,
  false);

export function createInboxConversationsArray(total: number, conversationsId?: string) {
  const conversations: InboxConversation[] = [];
  for (let i = 1; i <= total; i++) {
    conversations.push(CREATE_MOCK_INBOX_CONVERSATION(conversationsId ? i + conversationsId : i.toString(),
    OTHER_USER_ID, CONVERSATION_DATE - i));
  }
  return conversations;
}

