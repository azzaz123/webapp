import { InboxConversation } from '../app/core/conversation/conversation';
import { Message } from '../app/core/message/message';
import { InboxUser } from '../app/core/user/user';
import { InboxItem } from '../app/core/item/item';
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
                "name": "John D.",
                "blocked": false
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
                    "message_id": "20394401-ec61-4032-9eee-e79441fae457",
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
                    "message_id": "df9455bd-9d3f-4315-abdc-c7c230932347",
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
                    "message_id": "b034a784-2702-4517-99cd-1268ba7d1cb7",
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
                    "message_id": "2bc9b35e-3d17-4044-91b7-20d52884bc1c",
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
                    "message_id": "02E8347D-526B-4042-8AA8-A7F343488D12",
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
                "name": "John D.",
                "blocked": false
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
                    "message_id": "58AC7C92-1441-4D65-A05B-3FF1EABE48E2",
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

export const CREATE_MOCK_INBOX_CONVERSATION: Function = (
    id: string = CONVERSATION_ID,
    userId: string = OTHER_USER_ID,
    date: number = CONVERSATION_DATE): InboxConversation => {
      const tempMsg = MOCK_INBOX_CONVERSATION.messages[0];
      const message = new Message(
          tempMsg.id,
          MOCK_INBOX_CONVERSATION.hash,
          tempMsg.text,
          tempMsg.from,
          new Date(tempMsg.timestamp),
          tempMsg.status,
          tempMsg.payload);
      message.fromSelf = tempMsg.from === 'self';

      return new InboxConversation(id, date, new InboxUser(userId), new InboxItem(ITEM_ID), message, 0, false, false);
};
export const SECOND_MOCK_INBOX_CONVERSATION: InboxConversation = new InboxConversation('secondId', CONVERSATION_DATE,
  new InboxUser(OTHER_USER_ID), new InboxItem(ITEM_ID));
export const MOCKED_INBOX_CONVERSATIONS: InboxConversation[] = [CREATE_MOCK_INBOX_CONVERSATION(), SECOND_MOCK_INBOX_CONVERSATION];
export const NOT_FOUND_INBOX_CONVERSATION_ID = 'notFound';
export const MOCK_NOT_FOUND_INBOX_CONVERSATION: InboxConversation = new InboxConversation(
  NOT_FOUND_INBOX_CONVERSATION_ID,
  CONVERSATION_DATE,
  new InboxUser(OTHER_USER_ID),
  new InboxItem(ITEM_ID));

export function createInboxConversationsArray(total: number, conversationsId?: string) {
  const conversations: InboxConversation[] = [];
  for (let i = 1; i <= total; i++) {
    conversations.push(CREATE_MOCK_INBOX_CONVERSATION(conversationsId ? i + conversationsId : i.toString(),
    OTHER_USER_ID, CONVERSATION_DATE - i));
  }
  return conversations;
}

